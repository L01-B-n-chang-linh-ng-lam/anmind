import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller.js';
import { ProfileService } from './profile.service.js';

const mockProfileService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
};

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    jest.clearAllMocks();
  });

  it('delegates getProfile to service with user id', async () => {
    const profile = {
      id: 'uid',
      username: 'user',
      createdAt: new Date(),
    };
    mockProfileService.getProfile.mockResolvedValue(profile);

    const result = await controller.getProfile({ user: { id: 'uid' } });

    expect(mockProfileService.getProfile).toHaveBeenCalledWith('uid');
    expect(result).toEqual(profile);
  });

  it('delegates updateProfile to service with user id and dto', async () => {
    const updated = {
      id: 'uid',
      username: 'newname',
      createdAt: new Date(),
    };
    mockProfileService.updateProfile.mockResolvedValue(updated);

    const result = await controller.updateProfile(
      { user: { id: 'uid' } },
      { username: 'newname' },
    );

    expect(mockProfileService.updateProfile).toHaveBeenCalledWith('uid', {
      username: 'newname',
    });
    expect(result).toEqual(updated);
  });
});
