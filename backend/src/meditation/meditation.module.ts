import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeditationController } from './meditation.controller.js';
import { MeditationService } from './meditation.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [MeditationController],
  providers: [MeditationService],
})
export class MeditationModule {}
