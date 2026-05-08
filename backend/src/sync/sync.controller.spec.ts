import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller.js';
import { SyncService } from './sync.service.js';

const mockSyncService = { sync: jest.fn() };

describe('SyncController', () => {
  let controller: SyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [{ provide: SyncService, useValue: mockSyncService }],
    }).compile();

    controller = module.get<SyncController>(SyncController);
    jest.clearAllMocks();
  });

  it('calls syncService.sync with user id and dto', async () => {
    mockSyncService.sync.mockResolvedValue({ synced: 2, duplicates: 1 });

    const result = await controller.sync(
      { user: { id: 'uid' } },
      { sessions: [] },
    );

    expect(mockSyncService.sync).toHaveBeenCalledWith('uid', { sessions: [] });
    expect(result).toEqual({ synced: 2, duplicates: 1 });
  });
});
