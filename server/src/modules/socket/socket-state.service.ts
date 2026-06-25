import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import Pixel from 'src/types/pixel.type';

@Injectable()
export class SocketStateService {
  constructor(private readonly redisService: RedisService) {}

  private get redis() {
    return this.redisService.getClient();
  }

  async addUser(roomId: string, socketId: string, userName: string) {
    await (await this.redis).hSet(`room:${roomId}:users`, socketId, userName);

    await (
      await this.redis
    ).hSet(`socket:${socketId}`, {
      roomId,
      userName,
    });
  }

  async removeUser(socketId: string) {
    const socketData = await (await this.redis).hGetAll(`socket:${socketId}`);

    if (!socketData.roomId) {
      return null;
    }

    await (await this.redis).hDel(`room:${socketData.roomId}:users`, socketId);
    await (await this.redis).del(`socket:${socketId}`);

    return {
      roomId: socketData.roomId,
      userName: socketData.userName,
    };
  }

  async getUsers(roomId: string) {
    const users = await (await this.redis).hGetAll(`room:${roomId}:users`);
    return Object.values(users);
  }

  async getUserCount(roomId: string) {
    return await (await this.redis).hLen(`room:${roomId}:users`);
  }

  async setRoomMeta(roomId: string, uuid: string, limitUser: number) {
    await (
      await this.redis
    ).hSet(`room:${roomId}:meta`, {
      uuid,
      limitUser: String(limitUser),
    });
  }

  async getRoomMeta(roomId: string) {
    return await (await this.redis).hGetAll(`room:${roomId}:meta`);
  }

  async setPixel(roomId: string, pixel: Pixel) {
    await (
      await this.redis
    ).hSet(`room:${roomId}:pixels`, pixel.location, JSON.stringify(pixel));
  }

  async deletePixel(roomId: string, location: string) {
    await (await this.redis).hDel(`room:${roomId}:pixels`, location);
  }

  async getPixels(roomId: string): Promise<Pixel[]> {
    const pixels = await (await this.redis).hGetAll(`room:${roomId}:pixels`);

    return Object.values(pixels).map((value) => JSON.parse(value));
  }

  async clearRoom(roomId: string) {
    await (
      await this.redis
    ).del([
      `room:${roomId}:meta`,
      `room:${roomId}:users`,
      `room:${roomId}:pixels`,
    ]);
  }

  async getSocket(socketId: string) {
    return await (await this.redis).hGetAll(`socket:${socketId}`);
  }
}
