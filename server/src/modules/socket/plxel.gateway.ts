import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import Pixel from 'src/types/pixel';

interface room {
  uuid: string;
  userList: Map<string, user>;
  pixelList: Map<string, Pixel>;
  updateTime: string;
}

class Room implements room {
  uuid: string;
  userList: Map<string, user>;
  pixelList: Map<string, Pixel>;
  updateTime: string;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.userList = new Map<string, user>;
    this.pixelList = new Map<string, Pixel>;
    this.updateTime = new Date().toDateString();
  }
}

interface user {
  userName: string;
  roomId: string;
}

class User implements user {
  userName: string;
  roomId: string;

  constructor(name: string, id: string) {
    this.userName = name;
    this.roomId = id;
  }
}

interface enterReq {
  roomId: string;
  name: string;
}

@WebSocketGateway(8080, { cors: { origin: '*' } })
export class PixelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  roomList: Map<string, room> = new Map<string, room>();
  userList: Map<string, user> = new Map<string, user>();

  // 소켓을 연결한다.
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Client ${socket.id} connected.`);
  }

  // 소켓 연결 해제
  async handleDisconnect(socket: Socket): Promise<void> {
    const roomID = this.userList.get(socket.id).roomId;
    const room = this.roomList.get(roomID);
    const name = this.userList.get(socket.id).userName;

    console.log(`${roomID}'s Room ::: ${room.uuid} disconnected.`);

    room.userList.delete(socket.id);
    this.userList.delete(socket.id);

    const userList: string[] = [];
    for (const item of room.userList.values()) {
      userList.push(item.userName);
    }

    this.server.to(roomID).emit('left', { roomID, userList, name });

    console.log(`Client ${socket.id} disconnected.`);
  }

  // 방 입장
  @SubscribeMessage('enter')
  async enterRoom(socket: Socket, data: enterReq): Promise<void> {
    let room = this.roomList.get(data.roomId);
    if (room === undefined) {
      const newRoomID = crypto.randomUUID();
      this.roomList.set(data.roomId, new Room(newRoomID.toString()));
      room = this.roomList.get(data.roomId);
    }

    console.log(`${data.roomId}'s Room ::: ${room.uuid} connected.`);

    const uuid = room.uuid;
    const userList: string[] = [];
    const pixelData: Pixel[] = [];

    if (socket.rooms.has(uuid)) {
      return;
    }

    this.userList.set(socket.id, new User(data.name, data.roomId));
    room.userList.set(socket.id, new User(data.name, data.roomId));

    for (const item of room.userList.values()) {
      userList.push(item.userName);
    }

    for (const item of room.pixelList.values()) {
      pixelData.push(item);
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
    // todo : 통합 DB 갱신하기

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

    // todo : 통합 DB 갱신하기
    this.server.to(roomID).emit('clear', { roomID: uuid, data });
  }
}
