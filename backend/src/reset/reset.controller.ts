import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { ResetDto } from './dto/reset.dto.js';
import { ResetService } from './reset.service.js';

@Controller('reset')
@UseGuards(JwtAuthGuard)
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post()
  submit(@Request() req: { user: { id: string } }, @Body() dto: ResetDto) {
    return this.resetService.submit(req.user.id, dto);
  }
}
