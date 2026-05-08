import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { SyncService } from './sync.service.js';

const USER_ID = 'user-uuid-1';

const mockPrisma = {
  resetSession: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('SyncService', () => {
  let service: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    jest.clearAllMocks();
  });

  const makeItem = (id: string) => ({
    external_id: id,
    duration_minutes: 5,
    score_before: 3,
    score_after: 1,
    started_at: new Date().toISOString(),
    completed: true,
  });

  it('syncs new sessions and counts duplicates', async () => {
    mockPrisma.resetSession.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'existing' });

    mockPrisma.$transaction.mockResolvedValue(undefined);

    const result = await service.sync(USER_ID, {
      sessions: [makeItem('new-id'), makeItem('dup-id')],
    });

    expect(result.synced).toBe(1);
    expect(result.duplicates).toBe(1);
  });

  it('returns 0 synced and 0 duplicates for empty sessions', async () => {
    const result = await service.sync(USER_ID, { sessions: [] });
    expect(result.synced).toBe(0);
    expect(result.duplicates).toBe(0);
  });

  it('does not overwrite existing sessions', async () => {
    mockPrisma.resetSession.findUnique.mockResolvedValue({ id: 'existing' });

    await service.sync(USER_ID, { sessions: [makeItem('dup')] });

    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('creates session in a transaction', async () => {
    mockPrisma.resetSession.findUnique.mockResolvedValue(null);
    mockPrisma.$transaction.mockImplementation(async (fn) => {
      const txMock = {
        resetSession: { create: jest.fn().mockResolvedValue({ id: 'new-id' }) },
        moodEntry: { create: jest.fn().mockResolvedValue({}) },
      };
      return fn(txMock);
    });

    const result = await service.sync(USER_ID, {
      sessions: [makeItem('new-ext')],
    });

    expect(result.synced).toBe(1);
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});
