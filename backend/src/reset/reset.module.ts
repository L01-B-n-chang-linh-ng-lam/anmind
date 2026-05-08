import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller.js';
import { ResetService } from './reset.service.js';

@Module({
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule {}
