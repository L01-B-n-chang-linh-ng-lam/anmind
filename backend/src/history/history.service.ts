import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(userId: string) {
    const sessions = await this.prisma.resetSession.findMany({
      where: { userId },
      include: { moodEntry: true },
      orderBy: { startedAt: 'desc' },
    });

    return sessions.map((s) => ({
      session_id: s.id,
      duration_minutes: s.durationMinutes,
      started_at: s.startedAt,
      ended_at: s.endedAt,
      score_before: s.moodEntry?.scoreBefore ?? null,
      score_after: s.moodEntry?.scoreAfter ?? null,
      improvement:
        s.moodEntry?.scoreBefore != null && s.moodEntry?.scoreAfter != null
          ? s.moodEntry.scoreBefore - s.moodEntry.scoreAfter
          : null,
    }));
  }
}
