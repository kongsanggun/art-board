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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Room],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
