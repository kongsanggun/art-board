import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

interface Pixel {
  color: string;
  location: string;
  userName: string;
  brashSize: string;
  timestamp: string;
}

@WebSocketGateway(8080, { cors: { origin: '*' } })
export class PixelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  user: { [key: string]: string } = {};
  // 방 ID
  roomList: { [key: string]: string } = {};
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
    const roomID = this.user[socket.id];
    const name = this.userList[roomID].get(socket.id);
    this.userList[roomID].delete(socket.id);

    const userList: string[] = [];
    for (const item of this.userList[roomID].values()) {
      userList.push(item);
    }

    this.server.to(roomID).emit('left', { roomID, userList, name });
    console.log(`Client ${socket.id} disconnected.`);
    console.log(`Room ${roomID} disconnected.`);
  }

  // 방 입장
  @SubscribeMessage('enter')
  async enterRoom(socket: Socket, data: any): Promise<void> {
    if (this.roomList[data.roomId] === undefined) {
      this.roomList[data.roomId] = crypto.randomUUID();
    }

    const roomID = this.roomList[data.roomId];
    console.log(`Room ${roomID} connected.`);
    this.user[socket.id] = roomID;
    if (socket.rooms.has(roomID)) {
      return;
    }

    if (!this.userList[roomID]) {
      this.userList[roomID] = new Map<string, string>();
      this.pixels[roomID] = new Map<string, Pixel>();
    }

    this.userList[roomID].set(socket.id, data.name);

    const userList: string[] = [];
    const pixelData: Pixel[] = [];
    for (const item of this.userList[roomID].values()) {
      userList.push(item);
    }

    this.server.to(roomID).emit('enter', { roomID, userList });
    socket.join(roomID);

    this.server.to(roomID).emit('enter', { roomID, userList });

    for (const item of this.pixels[roomID].values()) {
      pixelData.push(item);
    }

    this.server.to(roomID).emit('pixel', { roomID, pixelData });
  }

  @SubscribeMessage('pen')
  async drawPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.user[socket.id];
    this.pixels[roomID].set(data.location, data);
    this.server.to(roomID).emit('draw', { roomID, data });
  }

  @SubscribeMessage('erase')
  async clearPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.user[socket.id];
    const serachNumber = Number(data.brashSize);

    const [targetX, targetY] = data.location.split(',').map((v) => {
      return Number(v);
    });

    for (let x = 0; x < serachNumber; x++) {
      for (let y = 0; y < serachNumber; y++) {
        const location = targetX + x + ',' + (targetY + y);
        this.pixels[roomID].delete(location);
      }
    }

    this.server.to(roomID).emit('clear', { roomID, data });
  }
}
