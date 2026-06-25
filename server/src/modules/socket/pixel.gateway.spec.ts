import { Test, TestingModule } from '@nestjs/testing';
import { createPixelGateway, PixelGateway } from './plxel.gateway';
import { RoomService } from '../../room/room.service';

describe('GatewayGateway', () => {
  let gateway: PixelGateway;
  const TestPixelGateway = createPixelGateway({
    name: 'test-socket',
    port: 8081,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestPixelGateway,
        {
          provide: RoomService,
          useValue: {},
        },
      ],
    }).compile();

    gateway = module.get<PixelGateway>(TestPixelGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
