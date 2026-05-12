import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MeditationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getSessions() {
    const sessions = await this.prisma.meditationSession.findMany({
      where: { startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? null,
      start_time: s.startTime,
      duration_minutes: s.durationMinutes,
      channel_name: s.channelName,
      status: s.status,
      max_participants: s.maxParticipants,
    }));
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.meditationSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { userMeditationSessions: true } } },
    });
    if (!session)
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Meditation session not found',
      });

    return {
      id: session.id,
      title: session.title,
      description: session.description ?? null,
      start_time: session.startTime,
      duration_minutes: session.durationMinutes,
      channel_name: session.channelName,
      status: session.status,
      max_participants: session.maxParticipants,
      participant_count: session._count.userMeditationSessions,
    };
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
      create: {
        userId,
        meditationSessionId: sessionId,
        role: 'AUDIENCE',
        joinedAt: new Date(),
      },
      update: {},
    });

    return { status: 'joined' };
  }

  async getAgoraToken(userId: string, sessionId: string) {
    const session = await this.prisma.meditationSession.findUnique({
      where: { id: sessionId },
    });
    if (!session)
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Meditation session not found',
      });

    const appId = this.config.get<string>('AGORA_APP_ID') ?? '';
    const appCertificate =
      this.config.get<string>('AGORA_APP_CERTIFICATE') ?? '';
    const channelName = session.channelName;
    const uid = 0;
    const expiresInSeconds = 3600;
    const privilegeExpiredTs =
      Math.floor(Date.now() / 1000) + expiresInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      RtcRole.SUBSCRIBER,
      privilegeExpiredTs,
    );

    await this.prisma.agoraTokenLog.create({
      data: {
        userId,
        meditationSessionId: sessionId,
        role: 'AUDIENCE',
        tokenExpireAt: new Date(privilegeExpiredTs * 1000),
      },
    });

    return {
      appId,
      channelName,
      token,
      uid,
      expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
    };
  }
}
