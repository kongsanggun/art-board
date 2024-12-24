import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SERVER_CONFIG } from 'src/configs/server.config';
import { RoomService } from 'src/room/room.service';
import EnterReq from 'src/types/enter-req.type';

import Pixel from 'src/types/pixel.type';
import Room from 'src/types/room.type';
import User from 'src/types/user.type';

class roomClass implements Room {
  uuid: string;
  userList: Map<string, User>;
  pixelList: Map<string, Pixel>;
  limitUser: number;
  updateTime: string;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.userList = new Map<string, User>();
    this.pixelList = new Map<string, Pixel>();
    this.updateTime = new Date().toDateString();
  }
}

class userClass implements User {
  userName: string;
  roomId: string;

  constructor(name: string, id: string) {
    this.userName = name;
    this.roomId = id;
  }
}

@Injectable()
@WebSocketGateway(SERVER_CONFIG.SOCKET_PORT, { cors: { origin: '*' } })
export class PixelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly roomService: RoomService) {}

  roomList: Map<string, Room> = new Map<string, Room>();
  userList: Map<string, User> = new Map<string, User>();

  // 소켓을 연결한다.
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Client ${socket.id} connected.`);
  }

  // 소켓 연결 해제
  async handleDisconnect(socket: Socket): Promise<void> {
    if (this.userList.get(socket.id) !== undefined) {
      const roomID = this.userList.get(socket.id).roomId;
      const room = this.roomList.get(roomID);
      const name = this.userList.get(socket.id).userName;

      console.log(`${roomID}'s Room ::: ${room.uuid} disconnected.`);
      room.userList.delete(socket.id);
      this.userList.delete(socket.id);

      if (room.userList.size === 0) {
        console.log(`${roomID}'s Room is closed.`);
        const dataStr = JSON.stringify(Array.from(room.pixelList.values()));
        await this.roomService.updatePixel(roomID, dataStr);
        this.roomList.delete(roomID);
      } else {
        const userList: string[] = [];
        for (const item of room.userList.values()) {
          userList.push(item.userName);
        }
        this.server.to(roomID).emit('left', { roomID, userList, name });
      }

      console.log(`Client ${socket.id} disconnected.`);
    }
  }

  // 방 입장
  @SubscribeMessage('enter')
  async enterRoom(socket: Socket, data: EnterReq): Promise<void> {
    let room = this.roomList.get(data.roomId);
    const userList: string[] = [];
    const pixelData: Pixel[] = [];

    if (room === undefined) {
      const newRoomID = crypto.randomUUID();
      this.roomList.set(data.roomId, new roomClass(newRoomID.toString()));
      room = this.roomList.get(data.roomId);

      const dbData = await this.roomService.findRoom(data.roomId);
      room.pixelList = this.convertData(dbData.pixelData);
      room.limitUser = dbData.limitUser;
      console.log(`${data.roomId}'s Room is open.`);
    }

    const uuid = room.uuid;
    if (room.limitUser == room.userList.size) {
      console.log(`${data.roomId}'s Room is full.`);
      socket.emit('full', { roomID: room.uuid });
      return;
    }

    console.log(`${data.roomId}'s Room ::: ${room.uuid} connected.`);

    if (socket.rooms.has(uuid)) {
      return;
    }

    this.userList.set(socket.id, new userClass(data.name, data.roomId));
    room.userList.set(socket.id, new userClass(data.name, data.roomId));

    for (const item of room.userList.values()) {
      userList.push(item.userName);
    }

    for (const pixel of room.pixelList.values()) {
      pixelData.push(pixel);
    }

    socket.join(uuid);
    this.server.to(uuid).emit('enter', { uuid, userList });
    this.server.to(uuid).emit('pixel', { uuid, pixelData });
  }

  @SubscribeMessage('pen')
  async drawPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.userList.get(socket.id).roomId;
    const room = this.roomList.get(roomID);
    const uuid = room.uuid;

    room.pixelList.set(data.location, data);
    this.server.to(uuid).emit('draw', { roomID: uuid, data });
  }

  @SubscribeMessage('erase')
  async clearPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.userList.get(socket.id).roomId;
    const room = this.roomList.get(roomID);
    const uuid = room.uuid;

    const serachNumber = Number(data.brashSize);
    const [targetX, targetY] = data.location.split(',').map((v) => {
      return Number(v);
    });

    for (let x = 0; x < serachNumber; x++) {
      for (let y = 0; y < serachNumber; y++) {
        const location = targetX + x + ',' + (targetY + y);
        room.pixelList.delete(location);
      }
    }

    this.server.to(roomID).emit('clear', { roomID: uuid, data });
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

  @Cron('* * * * * *')
  async pixelDateUpdate(): Promise<void> {
    console.log(new Date().toUTCString() + ' ::: data update');
    for (const roomID of this.roomList.keys()) {
      const room = this.roomList.get(roomID);
      const dataStr = JSON.stringify(Array.from(room.pixelList.values()));
      await this.roomService.updatePixel(roomID, dataStr);
    }
  }
}
