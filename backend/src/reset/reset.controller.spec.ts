import { Test, TestingModule } from '@nestjs/testing';
import { ResetController } from './reset.controller.js';
import { ResetService } from './reset.service.js';

const mockResetService = { submit: jest.fn() };

describe('ResetController', () => {
  let controller: ResetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetController],
      providers: [{ provide: ResetService, useValue: mockResetService }],
    }).compile();

    controller = module.get<ResetController>(ResetController);
    jest.clearAllMocks();
  });

  it('calls resetService.submit with user id and dto', async () => {
    const dto = {
      external_id: 'ext-1',
      duration_minutes: 5,
      score_before: 4,
      score_after: 2,
      started_at: new Date().toISOString(),
    };
    mockResetService.submit.mockResolvedValue({
      session_id: 'sid',
      status: 'completed',
      improvement: 2,
    });

    const result = await controller.submit({ user: { id: 'uid' } }, dto);

    expect(mockResetService.submit).toHaveBeenCalledWith('uid', dto);
    expect(result).toMatchObject({ session_id: 'sid', improvement: 2 });
  });
});
