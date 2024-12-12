import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/database/entity/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private usersRepository: Repository<Room>,
  ) {}

  async findRoom(id: string): Promise<Room | null> {
    const result = await this.usersRepository
      .findOne({ where: { id } })
      .then((res) => {
        return res;
      });

    if (result === null) {
      throw new NotFoundException(`${id} 를 찾을 수 없습니다.`);
    }

    return result;
  }

  async updatePixel(id: string, data: string): Promise<any> {
    const result = await this.usersRepository.update(
      { id: id },
      { id: id, data: data },
    );

    return result;
  }
}
