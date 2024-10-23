import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

interface Pixel {
  RGB: string;
  location: string;
  user: string;
  brashSize: string;
  timestamp: string;
}

@WebSocketGateway(8443, { cors: { origin: '*' } })
export class PixelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // TODO : 추후 클래스로 변환 예정
  randomRoomID: string = crypto.randomUUID();
  // [socketId, name]
  userList: { [roomId: string]: Map<string, string> } = {};
  // [location, info]
  pixels: { [roomId: string]: Map<string, Pixel> } = {};

  // 소켓 연결
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Client ${socket.id} connected.`);
  }

  // 소켓 연결 해제
  async handleDisconnect(socket: Socket): Promise<void> {
    const roomID = this.randomRoomID;
    this.userList[roomID].delete(socket.id);

    const userList: string[] = [];
    for (const item of this.userList[roomID].values()) {
      userList.push(item);
    }

    this.server.to(roomID).emit('left', { roomID, userList });
    console.log(`Client ${socket.id} disconnected.`);
  }

  @SubscribeMessage('enter')
  async enterRoom(socket: Socket, data: string): Promise<void> {
    const roomID = this.randomRoomID;
    if (socket.rooms.has(roomID)) {
      return;
    }

    if (!this.userList[roomID]) {
      this.userList[roomID] = new Map<string, string>();
      this.pixels[roomID] = new Map<string, Pixel>();
    }

    this.userList[roomID].set(socket.id, data);

    const userList: string[] = [];
    const pixelData: Pixel[] = [];
    for (const item of this.userList[roomID].values()) {
      userList.push(item);
    }

    this.server.to(roomID).emit('enter', { roomID, userList });
    socket.join(roomID);

    this.server.emit('enter', { roomID, userList });

    for (const item of this.pixels[roomID].values()) {
      pixelData.push(item);
    }

    this.server.emit('pixel', { roomID, pixelData });
  }

  @SubscribeMessage('draw')
  async drawPixels(socket: Socket, data: Pixel): Promise<void> {
    // 정보를 저장한다.
    const roomID = this.randomRoomID;
    this.pixels[roomID].set(data.location, data);
    this.server.to(roomID).emit('draw', { roomID, data });
  }

  @SubscribeMessage('clear')
  async clearPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.randomRoomID;
    this.pixels[roomID].delete(data.location);
    this.server.to(roomID).emit('clear', { roomID, data });
  }
}
