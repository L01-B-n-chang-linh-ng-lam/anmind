import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResetService } from './reset.service.js';

const SESSION_ID = 'session-uuid-1';
const USER_ID = 'user-uuid-1';
const EXTERNAL_ID = 'ext-uuid-1';

const mockPrisma = {
  resetSession: {
    findUnique: jest.fn(),
  },
  moodEntry: {},
  $transaction: jest.fn(),
};

describe('ResetService', () => {
  let service: ResetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ResetService>(ResetService);
    jest.clearAllMocks();
  });

  const dto = {
    external_id: EXTERNAL_ID,
    duration_minutes: 5,
    score_before: 2,
    score_after: 4,
    started_at: new Date().toISOString(),
    ended_at: new Date().toISOString(),
    completed: true,
  };

  it('returns existing session data when external_id already exists', async () => {
    mockPrisma.resetSession.findUnique.mockResolvedValue({
      id: SESSION_ID,
      completed: true,
      moodEntry: { scoreBefore: 2, scoreAfter: 4 },
    });

    const result = await service.submit(USER_ID, dto);

    expect(result.session_id).toBe(SESSION_ID);
    expect(result.improvement).toBe(2);
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('creates new session and mood entry when external_id is new', async () => {
    mockPrisma.resetSession.findUnique.mockResolvedValue(null);
    mockPrisma.$transaction.mockImplementation(async (fn) => {
      const txMock = {
        resetSession: {
          create: jest.fn().mockResolvedValue({
            id: SESSION_ID,
            completed: true,
          }),
        },
        moodEntry: {
          create: jest.fn().mockResolvedValue({
            scoreBefore: 2,
            scoreAfter: 4,
          }),
        },
      };
      return fn(txMock);
    });

    const result = await service.submit(USER_ID, dto);

    expect(result.session_id).toBe(SESSION_ID);
    expect(result.improvement).toBe(2);
    expect(result.status).toBe('completed');
  });

  it('returns improvement of 0 when existing session has no mood entry', async () => {
    mockPrisma.resetSession.findUnique.mockResolvedValue({
      id: SESSION_ID,
      completed: false,
      moodEntry: null,
    });

    const result = await service.submit(USER_ID, dto);

    expect(result.improvement).toBe(0);
    expect(result.status).toBe('pending');
  });
});
