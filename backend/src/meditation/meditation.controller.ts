import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard.js';
import { MeditationService } from './meditation.service.js';

@ApiTags('meditation-sessions')
@Controller('meditation-sessions')
@UseGuards(OptionalJwtAuthGuard)
export class MeditationController {
  constructor(private readonly meditationService: MeditationService) {}

  @Get()
  @ApiOperation({ summary: 'List all upcoming community meditation sessions' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'ms-uuid',
          title: 'Morning Calm',
          description: 'A gentle start to the day',
          start_time: '2026-05-13T08:00:00.000Z',
          duration_minutes: 20,
          channel_name: 'morning-calm-abc',
          status: 'SCHEDULED',
          max_participants: 100,
        },
      ],
    },
  })
  getSessions() {
    return this.meditationService.getSessions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single meditation session' })
  @ApiParam({ name: 'id', description: 'Meditation session UUID' })
  @ApiResponse({ status: 200, description: 'Session detail with participant count' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSession(@Param('id') id: string) {
    return this.meditationService.getSession(id);
  }

  @Post(':id/join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a meditation session as audience (anonymous guests are allowed)' })
  @ApiParam({ name: 'id', description: 'Meditation session UUID' })
  @ApiResponse({ status: 201, schema: { example: { status: 'joined' } } })
  @ApiResponse({ status: 404, description: 'Session not found' })
  joinSession(
    @Request() req: { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.meditationService.joinSession(req.user?.id ?? null, id);
  }

  @Get(':id/token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate an Agora RTC token (anonymous guests are allowed)' })
  @ApiParam({ name: 'id', description: 'Meditation session UUID' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        appId: 'agora-app-id',
        channelName: 'morning-calm-abc',
        token: 'agora-rtc-token-string',
        uid: 12345,
        expiresAt: '2026-05-13T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getToken(
    @Request() req: { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.meditationService.getAgoraToken(req.user?.id ?? null, id);
  }
}
