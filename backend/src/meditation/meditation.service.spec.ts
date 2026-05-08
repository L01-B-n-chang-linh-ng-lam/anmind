import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { MeditationService } from './meditation.service.js';

const USER_ID = 'user-uuid-1';
const SESSION_ID = 'med-session-1';

const mockPrisma = {
  meditationSession: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  userMeditationSession: {
    upsert: jest.fn(),
  },
};

describe('MeditationService', () => {
  let service: MeditationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeditationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MeditationService>(MeditationService);
    jest.clearAllMocks();
  });

  describe('getSessions', () => {
    it('returns upcoming sessions mapped to response shape', async () => {
      const future = new Date(Date.now() + 3600000);
      mockPrisma.meditationSession.findMany.mockResolvedValue([
        {
          id: SESSION_ID,
          title: 'Morning Reset',
          startTime: future,
          durationMinutes: 10,
          meetLink: 'https://meet.google.com/abc',
        },
      ]);

      const result = await service.getSessions();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: SESSION_ID,
        title: 'Morning Reset',
        duration_minutes: 10,
        meet_link: 'https://meet.google.com/abc',
      });
    });

    it('returns empty array when no upcoming sessions', async () => {
      mockPrisma.meditationSession.findMany.mockResolvedValue([]);
      expect(await service.getSessions()).toHaveLength(0);
    });
  });

  describe('joinSession', () => {
    it('upserts user meditation session and returns joined status', async () => {
      mockPrisma.meditationSession.findUnique.mockResolvedValue({
        id: SESSION_ID,
      });
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
});
