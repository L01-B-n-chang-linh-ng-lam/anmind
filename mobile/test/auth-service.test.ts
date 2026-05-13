import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('react-native-get-random-values', () => {});
jest.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api';
import * as authService from '@/services/auth.service';

const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;
const mockPost = api.post as jest.MockedFunction<typeof api.post>;

const authResponse = (username = 'admin') => ({
  access_token: 'real-token',
  user: { id: '111', username, createdAt: '2026-01-01T00:00:00Z' },
});

describe('authService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockResolvedValue({ data: authResponse() });
  });

  it('returns user and token', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.user).toBeTruthy();
    expect(result.token).toBe('real-token');
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

  it('posts username and password to /auth/login', async () => {
    await authService.login('admin', 'password');
    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      username: 'admin',
      password: 'password',
    });
  });
});

describe('authService.signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPost
      .mockResolvedValueOnce({ data: { id: '222', username: 'newuser' } })
      .mockResolvedValueOnce({ data: authResponse('newuser') });
  });

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

  it('signs up then logs in using the OpenAPI contract', async () => {
    await authService.signup('newuser', 'new@example.com', 'pass');
    expect(mockPost).toHaveBeenNthCalledWith(1, '/auth/signup', {
      username: 'newuser',
      password: 'pass',
    });
    expect(mockPost).toHaveBeenNthCalledWith(2, '/auth/login', {
      username: 'newuser',
      password: 'pass',
    });
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
