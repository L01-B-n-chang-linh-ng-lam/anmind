import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

const mockUser = {
  id: 'user-uuid-1',
  username: 'testuser',
  password: '',
  createdAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('creates a new user and returns id and username', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...mockUser,
        username: 'newuser',
      });

      const result = await service.signup({
        username: 'newuser',
        password: 'pass1234',
      });

      expect(result).toEqual({ id: mockUser.id, username: 'newuser' });
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('throws ConflictException when username is taken', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.signup({ username: 'testuser', password: 'pass1234' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('hashes password before storing', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      await service.signup({ username: 'newuser', password: 'plainpass' });

      const createArg = mockPrisma.user.create.mock.calls[0][0];
      expect(createArg.data.password).not.toBe('plainpass');
      const valid = await bcrypt.compare('plainpass', createArg.data.password);
      expect(valid).toBe(true);
    });
  });

  describe('login', () => {
    it('returns access_token and user on valid credentials', async () => {
      const hashed = await bcrypt.hash('secret', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });

      const result = await service.login({
        username: 'testuser',
        password: 'secret',
      });

      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user.username).toBe('testuser');
    });

    it('throws UnauthorizedException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ username: 'nobody', password: 'x' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException on wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashed,
      });

      await expect(
        service.login({ username: 'testuser', password: 'wrong' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
