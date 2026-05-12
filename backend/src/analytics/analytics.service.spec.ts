import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { AnalyticsService } from './analytics.service.js';

const USER_ID = 'user-uuid-1';

// scoreBefore=low, scoreAfter=high means positive improvement (scoreAfter - scoreBefore)
const makeSession = (
  daysAgo: number,
  scoreBefore: number,
  scoreAfter: number,
) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `session-${daysAgo}`,
    startedAt: d,
    moodEntry: { scoreBefore, scoreAfter },
  };
};

const mockPrisma = {
  resetSession: {
    findMany: jest.fn(),
  },
};

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('returns zeros for user with no sessions', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([]);

      const result = await service.getSummary(USER_ID);

      expect(result.total_sessions).toBe(0);
      expect(result.avg_improvement).toBe(0);
      expect(result.success_rate).toBe(0);
      expect(result.streak_days).toBe(0);
    });

    it('calculates correct summary metrics', async () => {
      // improvements: (4-2)=2, (5-3)=2, (3-4)=-1 → avg=1, success=2/3≈0.67
      mockPrisma.resetSession.findMany.mockResolvedValue([
        makeSession(0, 2, 4),
        makeSession(1, 3, 5),
        makeSession(2, 4, 3),
      ]);

      const result = await service.getSummary(USER_ID);

      expect(result.total_sessions).toBe(3);
      expect(result.avg_improvement).toBeCloseTo(1, 1);
      expect(result.success_rate).toBeCloseTo(0.67, 1);
      expect(result.streak_days).toBe(3);
    });

    it('breaks streak for non-consecutive days', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([
        makeSession(0, 2, 4),
        makeSession(5, 3, 1),
      ]);

      const result = await service.getSummary(USER_ID);
      expect(result.streak_days).toBe(1);
    });
  });

  describe('getTrend', () => {
    it('groups sessions by date', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([
        makeSession(1, 2, 4),
        makeSession(1, 3, 5),
        makeSession(0, 1, 3),
      ]);

      const result = await service.getTrend(USER_ID);

      expect(result).toHaveLength(2);
      const today = result.find((r) => r.total_sessions === 1);
      const yesterday = result.find((r) => r.total_sessions === 2);
      expect(today).toBeDefined();
      expect(yesterday).toBeDefined();
    });

    it('returns empty array for no sessions', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([]);
      const result = await service.getTrend(USER_ID);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAnalytics', () => {
    it('returns combined analytics in mobile-expected shape', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([
        makeSession(0, 2, 4),
        makeSession(1, 3, 5),
      ]);

      const result = await service.getAnalytics(USER_ID);

      expect(result).toHaveProperty('streak');
      expect(result).toHaveProperty('totalSessions');
      expect(result).toHaveProperty('avgImprovement');
      expect(result).toHaveProperty('weeklyData');
      expect(Array.isArray(result.weeklyData)).toBe(true);
      expect(result.weeklyData).toHaveLength(7);
      expect(result.totalSessions).toBe(2);
    });

    it('returns zeros and empty weekly data for user with no sessions', async () => {
      mockPrisma.resetSession.findMany.mockResolvedValue([]);

      const result = await service.getAnalytics(USER_ID);

      expect(result.streak).toBe(0);
      expect(result.totalSessions).toBe(0);
      expect(result.avgImprovement).toBe(0);
      expect(result.weeklyData.every((v) => v === 0)).toBe(true);
    });
  });
});
