import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { AnalyticsService } from './analytics.service.js';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Request() req: { user: { id: string } }) {
    return this.analyticsService.getSummary(req.user.id);
  }

  @Get('trend')
  getTrend(@Request() req: { user: { id: string } }) {
    return this.analyticsService.getTrend(req.user.id);
  }
}
