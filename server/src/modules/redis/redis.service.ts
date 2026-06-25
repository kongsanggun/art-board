import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private connectPromise: Promise<void> | null = null;

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    if (this.client?.isOpen) {
      return;
    }

    if (!this.connectPromise) {
      this.client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      });

      this.connectPromise = this.client.connect().then(() => undefined);
    }

    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  async getClient() {
    await this.connect();
    return this.client;
  }

  async duplicate() {
    await this.connect();

    const duplicatedClient = this.client.duplicate();

    if (!duplicatedClient.isOpen) {
      await duplicatedClient.connect();
    }

    return duplicatedClient;
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }
}
