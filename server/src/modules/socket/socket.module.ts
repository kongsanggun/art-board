import { Module } from '@nestjs/common';
import { PixelGateway } from './plxel.gateway';
import { RoomService } from 'src/room/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/database/entities/room.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Room])],
  controllers: [],
  providers: [PixelGateway, RoomService],
})
export class SocketModule {}
