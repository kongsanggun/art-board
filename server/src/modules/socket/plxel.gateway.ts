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

@WebSocketGateway(8080, { cors: { origin: '*' } })
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
    const name = this.userList[roomID].get(socket.id);
    this.userList[roomID].delete(socket.id);

    const userList: string[] = [];
    for (const item of this.userList[roomID].values()) {
      userList.push(item);
    }

    this.server.to(roomID).emit('left', { roomID, userList, name });
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

  @SubscribeMessage('pen')
  async drawPixels(socket: Socket, data: Pixel): Promise<void> {
    // 정보를 저장한다.
    const roomID = this.randomRoomID;
    this.pixels[roomID].set(data.location, data);
    this.server.to(roomID).emit('pen', { roomID, data });
  }

  @SubscribeMessage('erase')
  async clearPixels(socket: Socket, data: Pixel): Promise<void> {
    const roomID = this.randomRoomID;
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

    this.server.to(roomID).emit('erase', { roomID, data });
  }
}
