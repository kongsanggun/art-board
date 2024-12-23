import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SERVER_CONFIG } from './configs/server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVER_CONFIG.APP_PORT);
}
bootstrap();
