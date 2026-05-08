import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { SyncDto } from './dto/sync.dto.js';
import { SyncService } from './sync.service.js';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  sync(@Request() req: { user: { id: string } }, @Body() dto: SyncDto) {
    return this.syncService.sync(req.user.id, dto);
  }
}
