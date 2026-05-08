import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HistoryModule } from './history/history.module.js';
import { MeditationModule } from './meditation/meditation.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ResetModule } from './reset/reset.module.js';
import { SyncModule } from './sync/sync.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ResetModule,
    SyncModule,
    HistoryModule,
    MeditationModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
