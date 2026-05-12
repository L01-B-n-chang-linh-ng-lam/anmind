import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProfileService } from './profile.service.js';

const mockUser = {
  id: 'user-uuid-1',
  username: 'testuser',
  createdAt: new Date('2024-01-01'),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns mapped user profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        createdAt: mockUser.createdAt,
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('bad-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('calls prisma update and returns mapped result', async () => {
      const updated = { ...mockUser, username: 'newname' };
      mockPrisma.user.update.mockResolvedValue(updated);

      const result = await service.updateProfile(mockUser.id, {
        username: 'newname',
      });

      expect(result).toEqual({
        id: updated.id,
        username: 'newname',
        createdAt: updated.createdAt,
      });
      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
    });
  });
});
