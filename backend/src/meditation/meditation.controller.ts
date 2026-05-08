import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { MeditationService } from './meditation.service.js';

@Controller('meditation')
@UseGuards(JwtAuthGuard)
export class MeditationController {
  constructor(private readonly meditationService: MeditationService) {}

  @Get('sessions')
  getSessions() {
    return this.meditationService.getSessions();
  }

  @Post('sessions/:id/join')
  joinSession(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.meditationService.joinSession(req.user.id, id);
  }
}
