import { Module } from '@nestjs/common';
import { PixelGateway } from './plxel.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [PixelGateway],
})
export class SocketModule {}
