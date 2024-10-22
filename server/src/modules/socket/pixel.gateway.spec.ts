import { Test, TestingModule } from '@nestjs/testing';
import { PixelGateway } from './plxel.gateway';

describe('GatewayGateway', () => {
  let gateway: PixelGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelGateway],
    }).compile();

    gateway = module.get<PixelGateway>(PixelGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
