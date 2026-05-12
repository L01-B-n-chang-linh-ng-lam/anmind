import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResetDto } from './dto/reset.dto.js';

@Injectable()
export class ResetService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(userId: string, dto: ResetDto) {
    const existing = await this.prisma.resetSession.findUnique({
      where: { externalId: dto.external_id },
      include: { moodEntry: true },
    });

    if (existing) {
      const improvement = existing.moodEntry
        ? (existing.moodEntry.scoreAfter ?? 0) -
          (existing.moodEntry.scoreBefore ?? 0)
        : 0;
      return {
        session_id: existing.id,
        status: existing.completed ? 'completed' : 'pending',
        improvement,
      };
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.resetSession.create({
        data: {
          externalId: dto.external_id,
          userId,
          durationMinutes: dto.duration_minutes,
          startedAt: new Date(dto.started_at),
          endedAt: dto.ended_at ? new Date(dto.ended_at) : null,
          completed: dto.completed ?? false,
        },
      });

      const mood = await tx.moodEntry.create({
        data: {
          resetSessionId: session.id,
          scoreBefore: dto.score_before,
          scoreAfter: dto.score_after,
        },
      });

      return { session, mood };
    });

    const improvement =
      (result.mood.scoreAfter ?? 0) - (result.mood.scoreBefore ?? 0);

    return {
      session_id: result.session.id,
      status: result.session.completed ? 'completed' : 'pending',
      improvement,
    };
  }
}
