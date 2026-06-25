import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from 'src/database/entities/room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAllRooms() {
    return this.roomService.findAllRooms();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findRoom(id);
  }

  @Post()
  createRoom(@Body() roomData: Room) {
    return this.roomService.createRoom(roomData);
  }
}
