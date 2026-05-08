import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PrismaClient } from '../generated/prisma/client.js';

type Client = InstanceType<typeof PrismaClient>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client!: Client;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const { PrismaClient: PC } = await import('../generated/prisma/client.js');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const connectionString = this.config.get<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });
    this._client = new PC({ adapter });
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client?.$disconnect();
  }

  get user(): Client['user'] {
    return this._client.user;
  }

  get resetSession(): Client['resetSession'] {
    return this._client.resetSession;
  }

  get moodEntry(): Client['moodEntry'] {
    return this._client.moodEntry;
  }

  get meditationSession(): Client['meditationSession'] {
    return this._client.meditationSession;
  }

  get userMeditationSession(): Client['userMeditationSession'] {
    return this._client.userMeditationSession;
  }

  $transaction<T>(fn: (tx: Client) => Promise<T>): Promise<T> {
    return this._client.$transaction(fn);
  }
}
