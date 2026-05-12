import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getHealth() {
    const databaseUp = await this.databaseService.ping().catch(() => false);

    return {
      status: databaseUp ? 'ok' : 'error',
      service: 'backend',
      database: databaseUp ? 'up' : 'down',
    };
  }
}
