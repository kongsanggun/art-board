import { createAdapter } from '@socket.io/redis-adapter';
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomService } from 'src/room/room.service';
import EnterReq from 'src/types/enter-req.type';

import Pixel from 'src/types/pixel.type';
import { SocketStateService } from './socket-state.service';
import { RedisService } from '../redis/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

export class PixelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly redisService: RedisService,
    private readonly socketStateService: SocketStateService,
  ) {}

  async afterInit(server: Server) {
    const pubClient = await this.redisService.getClient();
    const subClient = await this.redisService.duplicate();
    server.adapter(createAdapter(pubClient, subClient));
  }

  // 소켓을 연결한다.
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Client ${socket.id} connected.`);
  }

  // 소켓 연결 해제
  async handleDisconnect(socket: Socket): Promise<void> {
    const removedUser = await this.socketStateService.removeUser(socket.id);

    if (!removedUser) {
      return;
    }

    const { roomId, userName } = removedUser;

    const roomMeta = await this.socketStateService.getRoomMeta(roomId);
    const userCount = await this.socketStateService.getUserCount(roomId);

    if (userCount === 0) {
      const pixels = await this.socketStateService.getPixels(roomId);
      const dataStr = JSON.stringify(pixels);

      await this.roomService.updatePixel(roomId, dataStr);
      await this.socketStateService.clearRoom(roomId);

      return;
    }

    const userList = await this.socketStateService.getUsers(roomId);

    this.server.to(roomMeta.uuid).emit('left', {
      roomID: roomId,
      userList,
      name: userName,
    });
  }

  // 방 입장
  @SubscribeMessage('enter')
  async enterRoom(socket: Socket, data: EnterReq): Promise<void> {
    let roomMeta = await this.socketStateService.getRoomMeta(data.roomId);

    if (!roomMeta.uuid) {
      const dbData = await this.roomService.findRoom(data.roomId);
      const uuid = crypto.randomUUID();

      await this.socketStateService.setRoomMeta(
        data.roomId,
        uuid,
        dbData.limitUser,
      );

      const pixels = this.convertData(dbData.pixelData);

      for (const pixel of pixels.values()) {
        await this.socketStateService.setPixel(data.roomId, pixel);
      }

      roomMeta = {
        uuid,
        limitUser: String(dbData.limitUser),
      };
    }
    const userCount = await this.socketStateService.getUserCount(data.roomId);

    if (userCount >= Number(roomMeta.limitUser)) {
      socket.emit('full', { roomID: roomMeta.uuid });
      return;
    }

    await this.socketStateService.addUser(data.roomId, socket.id, data.name);

    const userList = await this.socketStateService.getUsers(data.roomId);
    const pixelData = await this.socketStateService.getPixels(data.roomId);

    socket.join(roomMeta.uuid);

    this.server.to(roomMeta.uuid).emit('enter', {
      uuid: roomMeta.uuid,
      userList,
    });

    this.server.to(roomMeta.uuid).emit('pixel', {
      uuid: roomMeta.uuid,
      pixelData,
    });
  }

  @SubscribeMessage('pen')
  async drawPixels(socket: Socket, data: Pixel): Promise<void> {
    const socketData = await this.socketStateService.getSocket(socket.id);
    const roomMeta = await this.socketStateService.getRoomMeta(
      socketData.roomId,
    );

    data.userName = socket.id;

    await this.socketStateService.setPixel(socketData.roomId, data);

    this.server.to(roomMeta.uuid).emit('draw', {
      roomID: roomMeta.uuid,
      data,
    });
  }

  @SubscribeMessage('erase')
  async clearPixels(socket: Socket, data: Pixel): Promise<void> {
    const socketData = await this.socketStateService.getSocket(socket.id);
    const roomMeta = await this.socketStateService.getRoomMeta(
      socketData.roomId,
    );

    data.userName = socket.id;

    const serachNumber = Number(data.brashSize);
    const [targetX, targetY] = data.location.split(',').map((v) => {
      return Number(v);
    });

    for (let x = 0; x < serachNumber; x++) {
      for (let y = 0; y < serachNumber; y++) {
        const location = targetX + x + ',' + (targetY + y);
        await this.socketStateService.deletePixel(socketData.roomId, location);
      }
    }

    this.server.to(roomMeta.uuid).emit('clear', {
      roomID: roomMeta.uuid,
      data,
    });
  }

  private convertData(dbData: string): Map<string, Pixel> {
    const result = new Map<string, Pixel>();
    const list = dbData.slice(1, -1).split('},');

    for (const item of list.slice(0, -1)) {
      const pixel = JSON.parse(item + '}') as Pixel;
      result.set(pixel.location, pixel);
    }

    return result;
  }

  async pixelDateUpdate(socket?: Socket): Promise<void> {
    if (!socket) return;

    const socketData = await this.socketStateService.getSocket(socket.id);
    const pixels = await this.socketStateService.getPixels(socketData.roomId);
    const dataStr = JSON.stringify(pixels);

    await this.roomService.updatePixel(socketData.roomId, dataStr);
  }
}

export interface SocketModuleOptions {
  name: string;
  port: number;
}

export const createPixelGateway = (
  options: SocketModuleOptions,
): typeof PixelGateway => {
  class RegisteredPixelGateway extends PixelGateway {
    constructor(
      @Inject(RoomService)
      roomService: RoomService,

      @Inject(RedisService)
      redisService: RedisService,

      @Inject(SocketStateService)
      socketStateService: SocketStateService,
    ) {
      super(roomService, redisService, socketStateService);
    }

    async pixelDateUpdate(): Promise<void> {
      return super.pixelDateUpdate();
    }
  }

  Object.defineProperty(RegisteredPixelGateway, 'name', {
    value: `${options.name.replace(/[^a-zA-Z0-9]/g, '')}PixelGateway`,
  });

  Injectable()(RegisteredPixelGateway);
  WebSocketGateway(options.port, { cors: { origin: '*' } })(
    RegisteredPixelGateway,
  );

  const descriptor = Object.getOwnPropertyDescriptor(
    RegisteredPixelGateway.prototype,
    'pixelDateUpdate',
  );

  Cron('* * * * * *')(
    RegisteredPixelGateway.prototype,
    'pixelDateUpdate',
    descriptor,
  );

  return RegisteredPixelGateway;
};
