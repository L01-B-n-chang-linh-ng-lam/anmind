import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MeditationService {
  constructor(private readonly prisma: PrismaService) {}

  async getSessions() {
    const sessions = await this.prisma.meditationSession.findMany({
      where: { startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      start_time: s.startTime,
      duration_minutes: s.durationMinutes,
      meet_link: s.meetLink,
    }));
  }

  async joinSession(userId: string, sessionId: string) {
    const session = await this.prisma.meditationSession.findUnique({
      where: { id: sessionId },
    });
    if (!session)
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Meditation session not found',
      });

    await this.prisma.userMeditationSession.upsert({
      where: {
        userId_meditationSessionId: { userId, meditationSessionId: sessionId },
      },
      create: { userId, meditationSessionId: sessionId, joinedAt: new Date() },
      update: {},
    });

    return { status: 'joined' };
  }
}
