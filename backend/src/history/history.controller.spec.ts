import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller.js';
import { HistoryService } from './history.service.js';

const mockHistoryService = { getHistory: jest.fn() };

describe('HistoryController', () => {
  let controller: HistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [{ provide: HistoryService, useValue: mockHistoryService }],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
    jest.clearAllMocks();
  });

  it('calls historyService.getHistory with user id', async () => {
    mockHistoryService.getHistory.mockResolvedValue([{ session_id: 'sid' }]);
    const result = await controller.getHistory({ user: { id: 'uid' } });
    expect(mockHistoryService.getHistory).toHaveBeenCalledWith('uid');
    expect(result).toHaveLength(1);
  });
});
