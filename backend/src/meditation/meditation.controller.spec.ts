import { Test, TestingModule } from '@nestjs/testing';
import { MeditationController } from './meditation.controller.js';
import { MeditationService } from './meditation.service.js';

const mockMeditationService = {
  getSessions: jest.fn(),
  getSession: jest.fn(),
  joinSession: jest.fn(),
  getAgoraToken: jest.fn(),
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

  it('returns single session from service', async () => {
    mockMeditationService.getSession.mockResolvedValue({
      id: 'ms-1',
      title: 'Test',
    });
    const result = await controller.getSession('ms-1');
    expect(mockMeditationService.getSession).toHaveBeenCalledWith('ms-1');
    expect(result).toMatchObject({ id: 'ms-1' });
  });

  describe('joinSession', () => {
    it('calls joinSession with user id when authenticated', async () => {
      mockMeditationService.joinSession.mockResolvedValue({ status: 'joined' });
      const result = await controller.joinSession({ user: { id: 'uid' } }, 'ms-1');
      expect(mockMeditationService.joinSession).toHaveBeenCalledWith('uid', 'ms-1');
      expect(result).toEqual({ status: 'joined' });
    });

    it('calls joinSession with null when guest (no user)', async () => {
      mockMeditationService.joinSession.mockResolvedValue({ status: 'joined' });
      const result = await controller.joinSession({ user: undefined }, 'ms-1');
      expect(mockMeditationService.joinSession).toHaveBeenCalledWith(null, 'ms-1');
      expect(result).toEqual({ status: 'joined' });
    });
  });

  describe('getToken', () => {
    const tokenPayload = {
      appId: 'app-id',
      channelName: 'chan',
      token: 'tok',
      uid: 0,
      expiresAt: new Date().toISOString(),
    };

    it('calls getAgoraToken with user id when authenticated', async () => {
      mockMeditationService.getAgoraToken.mockResolvedValue(tokenPayload);
      const result = await controller.getToken({ user: { id: 'uid' } }, 'ms-1');
      expect(mockMeditationService.getAgoraToken).toHaveBeenCalledWith('uid', 'ms-1');
      expect(result).toMatchObject({ token: 'tok' });
    });

    it('calls getAgoraToken with null when guest (no user)', async () => {
      mockMeditationService.getAgoraToken.mockResolvedValue(tokenPayload);
      const result = await controller.getToken({ user: undefined }, 'ms-1');
      expect(mockMeditationService.getAgoraToken).toHaveBeenCalledWith(null, 'ms-1');
      expect(result).toMatchObject({ token: 'tok' });
    });
  });
});
