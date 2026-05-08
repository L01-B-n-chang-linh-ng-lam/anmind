import { Module } from '@nestjs/common';
import { MeditationController } from './meditation.controller.js';
import { MeditationService } from './meditation.service.js';

@Module({
  controllers: [MeditationController],
  providers: [MeditationService],
})
export class MeditationModule {}
