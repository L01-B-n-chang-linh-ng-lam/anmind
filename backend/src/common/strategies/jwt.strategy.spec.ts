import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
};

const mockConfig = {
  get: jest.fn().mockReturnValue('test_secret'),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    jest.clearAllMocks();
  });

  it('returns user payload when user exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'uid',
      username: 'user',
    });

    const result = await strategy.validate({ sub: 'uid', username: 'user' });

    expect(result).toEqual({ id: 'uid', username: 'user' });
  });

  it('throws UnauthorizedException when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({ sub: 'uid', username: 'user' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
