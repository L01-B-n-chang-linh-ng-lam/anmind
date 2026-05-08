import { Test, TestingModule } from '@nestjs/testing';
import { MeditationController } from './meditation.controller.js';
import { MeditationService } from './meditation.service.js';

const mockMeditationService = {
  getSessions: jest.fn(),
  joinSession: jest.fn(),
};

describe('MeditationController', () => {
  let controller: MeditationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeditationController],
      providers: [
        { provide: MeditationService, useValue: mockMeditationService },
      ],
    }).compile();

    controller = module.get<MeditationController>(MeditationController);
    jest.clearAllMocks();
  });

  it('returns sessions from service', async () => {
    mockMeditationService.getSessions.mockResolvedValue([{ id: 'ms-1' }]);
    const result = await controller.getSessions();
    expect(result).toHaveLength(1);
  });

  it('calls joinSession with user id and session id', async () => {
    mockMeditationService.joinSession.mockResolvedValue({ status: 'joined' });
    const result = await controller.joinSession(
      { user: { id: 'uid' } },
      'ms-1',
    );
    expect(mockMeditationService.joinSession).toHaveBeenCalledWith(
      'uid',
      'ms-1',
    );
    expect(result).toEqual({ status: 'joined' });
  });
});
