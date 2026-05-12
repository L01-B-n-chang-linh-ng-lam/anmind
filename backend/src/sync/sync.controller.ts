import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { SyncDto } from './dto/sync.dto.js';
import { SyncService } from './sync.service.js';

@ApiTags('sync')
@ApiBearerAuth()
@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @ApiOperation({ summary: 'Batch upload offline-queued sessions' })
  @ApiResponse({
    status: 201,
    description: 'Returns count of synced and duplicate sessions',
    schema: { example: { synced: 3, duplicates: 1 } },
  })
  sync(@Request() req: { user: { id: string } }, @Body() dto: SyncDto) {
    return this.syncService.sync(req.user.id, dto);
  }
}
