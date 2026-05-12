import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { ResetDto } from './dto/reset.dto.js';
import { ResetService } from './reset.service.js';

@ApiTags('reset')
@ApiBearerAuth()
@Controller('reset')
@UseGuards(JwtAuthGuard)
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a completed breathing reset session' })
  @ApiResponse({
    status: 201,
    description: 'Session saved. Returns session_id, status, and improvement score.',
    schema: {
      example: {
        session_id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'completed',
        improvement: 2,
      },
    },
  })
  submit(@Request() req: { user: { id: string } }, @Body() dto: ResetDto) {
    return this.resetService.submit(req.user.id, dto);
  }
}
