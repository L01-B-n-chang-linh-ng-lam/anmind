import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { MeditationService } from './meditation.service.js';

jest.mock('agora-access-token', () => ({
  RtcTokenBuilder: {
    buildTokenWithUid: jest.fn().mockReturnValue('mock-agora-token'),
  },
  RtcRole: { SUBSCRIBER: 2 },
}));

const USER_ID = 'user-uuid-1';
const SESSION_ID = 'med-session-1';

const mockSession = {
  id: SESSION_ID,
  title: 'Morning Reset',
  description: 'A calm morning session',
  startTime: new Date(Date.now() + 3600000),
  durationMinutes: 10,
  channelName: 'channel-abc',
  status: 'SCHEDULED',
  maxParticipants: 50,
};

const mockPrisma = {
  meditationSession: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  userMeditationSession: {
    upsert: jest.fn(),
  },
  agoraTokenLog: {
    create: jest.fn(),
  },
};

const mockConfig = {
  get: jest.fn().mockReturnValue('test-agora-value'),
};

describe('MeditationService', () => {
  let service: MeditationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeditationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<MeditationService>(MeditationService);
    jest.clearAllMocks();
  });

  describe('getSessions', () => {
    it('returns upcoming sessions mapped to response shape', async () => {
      mockPrisma.meditationSession.findMany.mockResolvedValue([mockSession]);

      const result = await service.getSessions();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: SESSION_ID,
        title: 'Morning Reset',
        duration_minutes: 10,
        channel_name: 'channel-abc',
        status: 'SCHEDULED',
        max_participants: 50,
      });
    });

    it('returns empty array when no upcoming sessions', async () => {
      mockPrisma.meditationSession.findMany.mockResolvedValue([]);
      expect(await service.getSessions()).toHaveLength(0);
    });
  });

  describe('getSession', () => {
    it('returns session detail with participant count', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue({
        ...mockSession,
        _count: { userMeditationSessions: 3 },
      });

      const result = await service.getSession(SESSION_ID);

      expect(result).toMatchObject({
        id: SESSION_ID,
        channel_name: 'channel-abc',
        participant_count: 3,
      });
    });

    it('throws NotFoundException when session not found', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue(null);
      await expect(service.getSession('bad-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('joinSession', () => {
    it('upserts user meditation session and returns joined status', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue(mockSession);
      mockPrisma.userMeditationSession.upsert.mockResolvedValue({});

      const result = await service.joinSession(USER_ID, SESSION_ID);

      expect(result).toEqual({ status: 'joined' });
      expect(mockPrisma.userMeditationSession.upsert).toHaveBeenCalledTimes(1);
    });

    it('throws NotFoundException when session does not exist', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue(null);
      await expect(
        service.joinSession(USER_ID, 'bad-id'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getAgoraToken', () => {
    it('returns token payload when session exists', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue(mockSession);
      mockPrisma.agoraTokenLog.create.mockResolvedValue({});

      const result = await service.getAgoraToken(USER_ID, SESSION_ID);

      expect(result).toMatchObject({
        appId: 'test-agora-value',
        channelName: 'channel-abc',
        token: 'mock-agora-token',
        uid: 0,
      });
      expect(result.expiresAt).toBeDefined();
      expect(mockPrisma.agoraTokenLog.create).toHaveBeenCalledTimes(1);
    });

    it('throws NotFoundException when session not found', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue(null);
      await expect(
        service.getAgoraToken(USER_ID, 'bad-id'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
