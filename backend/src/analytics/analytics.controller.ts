import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { AnalyticsService } from './analytics.service.js';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get combined analytics for the mobile dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Returns streak, totalSessions, avgImprovement, weeklyData[7]',
    schema: {
      example: {
        streak: 3,
        totalSessions: 12,
        avgImprovement: 1.75,
        weeklyData: [0, 2, 1, 0, 3, 1, 2],
      },
    },
  })
  getAnalytics(@Request() req: { user: { id: string } }) {
    return this.analyticsService.getAnalytics(req.user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get detailed summary stats' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        total_sessions: 12,
        avg_improvement: 1.75,
        success_rate: 0.83,
        streak_days: 3,
      },
    },
  })
  getSummary(@Request() req: { user: { id: string } }) {
    return this.analyticsService.getSummary(req.user.id);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get daily mood improvement trend' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        { date: '2026-05-10', avg_improvement: 2, total_sessions: 3 },
        { date: '2026-05-11', avg_improvement: 1.5, total_sessions: 2 },
      ],
    },
  })
  getTrend(@Request() req: { user: { id: string } }) {
    return this.analyticsService.getTrend(req.user.id);
  }
}
