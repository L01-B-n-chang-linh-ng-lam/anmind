import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { HistoryService } from './history.service.js';

@ApiTags('history')
@ApiBearerAuth()
@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all past reset sessions for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of reset sessions with mood entries',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          duration_minutes: 5,
          started_at: '2026-05-12T10:00:00.000Z',
          ended_at: '2026-05-12T10:05:00.000Z',
          completed: true,
          score_before: 2,
          score_after: 4,
          improvement: 2,
        },
      ],
    },
  })
  getHistory(@Request() req: { user: { id: string } }) {
    return this.historyService.getHistory(req.user.id);
  }
}
