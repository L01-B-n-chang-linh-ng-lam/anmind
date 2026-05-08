import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { HistoryService } from './history.service.js';

const USER_ID = 'user-uuid-1';

const mockPrisma = {
  resetSession: {
    findMany: jest.fn(),
  },
};

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    jest.clearAllMocks();
  });

  it('returns mapped history items', async () => {
    const started = new Date();
    const ended = new Date();
    mockPrisma.resetSession.findMany.mockResolvedValue([
      {
        id: 'session-1',
        durationMinutes: 10,
        startedAt: started,
        endedAt: ended,
        moodEntry: { scoreBefore: 4, scoreAfter: 2 },
      },
    ]);

    const result = await service.getHistory(USER_ID);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      session_id: 'session-1',
      duration_minutes: 10,
      started_at: started,
      ended_at: ended,
      score_before: 4,
      score_after: 2,
      improvement: 2,
    });
  });

  it('returns null improvement when mood entry is missing', async () => {
    mockPrisma.resetSession.findMany.mockResolvedValue([
      {
        id: 'session-2',
        durationMinutes: 5,
        startedAt: new Date(),
        endedAt: null,
        moodEntry: null,
      },
    ]);

    const result = await service.getHistory(USER_ID);

    expect(result[0].improvement).toBeNull();
    expect(result[0].score_before).toBeNull();
  });

  it('returns empty array when user has no sessions', async () => {
    mockPrisma.resetSession.findMany.mockResolvedValue([]);
    const result = await service.getHistory(USER_ID);
    expect(result).toHaveLength(0);
  });
});
