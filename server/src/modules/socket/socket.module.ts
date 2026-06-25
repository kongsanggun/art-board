import { DynamicModule, Module } from '@nestjs/common';
import { createPixelGateway, SocketModuleOptions } from './plxel.gateway';
import { RoomModule } from 'src/room/room.module';
import { RedisModule } from '../redis/redis.module';
import { SocketStateService } from './socket-state.service';

@Module({
  imports: [RoomModule],
  controllers: [],
})
export class SocketModule {
  static register(options: SocketModuleOptions): DynamicModule {
    const pixelGateway = createPixelGateway(options);

    return {
      module: SocketModule,
      imports: [RoomModule, RedisModule],
      providers: [pixelGateway, SocketStateService],
    };
  }
}
