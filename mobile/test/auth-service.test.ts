import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-native-get-random-values', () => {});
jest.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '@/services/auth.service';

const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns user and token', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.user).toBeTruthy();
    expect(result.token).toBeTruthy();
    expect(result.user.username).toBe('admin');
  });

  it('saves token to AsyncStorage', async () => {
    await authService.login('test@example.com', 'password');
    expect(mockSetItem).toHaveBeenCalledWith('authToken', expect.any(String));
  });

  it('saves user to AsyncStorage', async () => {
    await authService.login('test@example.com', 'password');
    expect(mockSetItem).toHaveBeenCalledWith('currentUser', expect.any(String));
  });

  it('accepts any non-empty credentials', async () => {
    const result = await authService.login('anyone@test.com', 'anything');
    expect(result).toBeTruthy();
  });
});

describe('authService.signup', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a new user with the given username', async () => {
    const result = await authService.signup('newuser', 'new@example.com', 'pass');
    expect(result.user.username).toBe('newuser');
  });

  it('saves user and token to AsyncStorage', async () => {
    await authService.signup('newuser', 'new@example.com', 'pass');
    expect(mockSetItem).toHaveBeenCalledWith('authToken', expect.any(String));
    expect(mockSetItem).toHaveBeenCalledWith('currentUser', expect.any(String));
  });

  it('returns a token', async () => {
    const result = await authService.signup('newuser', 'new@example.com', 'pass');
    expect(result.token).toBeTruthy();
  });
});

describe('authService.logout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('removes authToken from AsyncStorage', async () => {
    await authService.logout();
    expect(mockRemoveItem).toHaveBeenCalledWith('authToken');
  });

  it('removes currentUser from AsyncStorage', async () => {
    await authService.logout();
    expect(mockRemoveItem).toHaveBeenCalledWith('currentUser');
  });
});

describe('authService.getCurrentUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns null when no stored data', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await authService.getCurrentUser();
    expect(result).toBeNull();
  });

  it('returns user and token when both are stored', async () => {
    const mockUser = { id: '1', username: 'admin', createdAt: '2026-01-01T00:00:00Z' };
    const mockToken = 'mock-token';
    mockGetItem
      .mockResolvedValueOnce(JSON.stringify(mockToken))
      .mockResolvedValueOnce(JSON.stringify(mockUser));
    const result = await authService.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result?.user.username).toBe('admin');
    expect(result?.token).toBe(mockToken);
  });
});
