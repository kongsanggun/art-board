import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { renderHTML } from 'src/common/func/renderHTML';
import { Room } from 'src/database/entities/room.entity';
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

    if (result.detail !== null) {
      result.detail = await renderHTML(
        result.detail,
        new URL(`${process.env.URL_ORIGIN}${id}`),
      );
    }

    return result;
  }

  async updatePixel(id: string, data: string): Promise<any> {
    const result = await this.usersRepository.update(
      { id: id },
      { id: id, pixelData: data },
    );

    return result;
  }
}
