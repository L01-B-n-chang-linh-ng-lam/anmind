import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('calls authService.signup and returns result', async () => {
    mockAuthService.signup.mockResolvedValue({ id: 'uid', username: 'user' });
    const result = await controller.signup({
      username: 'user',
      password: 'pass1234',
    });
    expect(result).toEqual({ id: 'uid', username: 'user' });
    expect(mockAuthService.signup).toHaveBeenCalledWith({
      username: 'user',
      password: 'pass1234',
    });
  });

  it('calls authService.login and returns token', async () => {
    mockAuthService.login.mockResolvedValue({
      access_token: 'tok',
      user: { id: 'uid', username: 'user' },
    });
    const result = await controller.login({
      username: 'user',
      password: 'pass',
    });
    expect(result.access_token).toBe('tok');
  });
});
