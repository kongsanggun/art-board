import { Module } from '@nestjs/common';
import { SocketModule } from './modules/socket/socket.module';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './database/entity/room.entity';

@Module({
  imports: [
    SocketModule,
    RoomModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'artboard',
      entities: [Room],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
