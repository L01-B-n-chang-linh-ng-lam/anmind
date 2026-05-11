import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SyncDto, SyncItemDto } from './dto/sync.dto.js';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async sync(userId: string, dto: SyncDto) {
    let synced = 0;
    let duplicates = 0;

    for (const item of dto.sessions) {
      const isDuplicate = await this.processItem(userId, item);
      if (isDuplicate) duplicates++;
      else synced++;
    }

    return { synced, duplicates };
  }

  private async processItem(
    userId: string,
    item: SyncItemDto,
  ): Promise<boolean> {
    const existing = await this.prisma.resetSession.findUnique({
      where: { externalId: item.external_id },
    });

    if (existing) return true;

    await this.prisma.$transaction(async (tx) => {
      const session = await tx.resetSession.create({
        data: {
          externalId: item.external_id,
          userId,
          durationMinutes: item.duration_minutes,
          startedAt: new Date(item.started_at),
          endedAt: item.ended_at ? new Date(item.ended_at) : null,
          completed: item.completed ?? false,
        },
      });

      await tx.moodEntry.create({
        data: {
          resetSessionId: session.id,
          scoreBefore: item.score_before,
          scoreAfter: item.score_after,
        },
      });
    });

    return false;
  }
}
