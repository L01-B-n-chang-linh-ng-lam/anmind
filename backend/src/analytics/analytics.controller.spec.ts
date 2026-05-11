import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';

const mockAnalyticsService = {
  getSummary: jest.fn(),
  getTrend: jest.fn(),
};

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    jest.clearAllMocks();
  });

  it('returns summary from service', async () => {
    mockAnalyticsService.getSummary.mockResolvedValue({
      total_sessions: 5,
      avg_improvement: 1.5,
      success_rate: 0.8,
      streak_days: 3,
    });
    const result = await controller.getSummary({ user: { id: 'uid' } });
    expect(mockAnalyticsService.getSummary).toHaveBeenCalledWith('uid');
    expect(result.total_sessions).toBe(5);
  });

  it('returns trend from service', async () => {
    mockAnalyticsService.getTrend.mockResolvedValue([
      { date: '2025-01-01', avg_improvement: 2, total_sessions: 3 },
    ]);
    const result = await controller.getTrend({ user: { id: 'uid' } });
    expect(result).toHaveLength(1);
  });
});
