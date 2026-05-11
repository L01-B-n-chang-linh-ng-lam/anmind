import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMetadata() {
    return {
      service: 'backend',
      status: 'ok',
    };
  }
}
