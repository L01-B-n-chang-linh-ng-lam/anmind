import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/reset.service', () => ({
  getSessions: jest.fn().mockResolvedValue([
    {
      id: 's1',
      durationMinutes: 5,
      startedAt: new Date().toISOString(),
      completed: true,
      scoreBefore: 2,
      scoreAfter: 4,
    },
  ]),
  getLocalSessions: jest.fn().mockResolvedValue([
    {
      id: 'local-1',
      durationMinutes: 5,
      startedAt: new Date().toISOString(),
      completed: true,
      scoreBefore: 2,
      scoreAfter: 4,
    },
  ]),
}));

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import * as analyticsService from '@/services/analytics.service';
import { api } from '@/services/api';
import * as meditationService from '@/services/meditation.service';
import * as storageService from '@/services/storage.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;
const mockMultiRemove = AsyncStorage.multiRemove as jest.MockedFunction<typeof AsyncStorage.multiRemove>;
const mockGet = api.get as jest.MockedFunction<typeof api.get>;

// ── Storage Service ───────────────────────────────────────────────────────────
describe('storageService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getItem returns null when storage is empty', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await storageService.getItem('someKey');
    expect(result).toBeNull();
  });

  it('getItem parses JSON value', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ foo: 'bar' }));
    const result = await storageService.getItem<{ foo: string }>('someKey');
    expect(result?.foo).toBe('bar');
  });

  it('setItem stringifies and saves value', async () => {
    await storageService.setItem('myKey', { a: 1 });
    expect(mockSetItem).toHaveBeenCalledWith('myKey', JSON.stringify({ a: 1 }));
  });

  it('removeItem delegates to AsyncStorage', async () => {
    await storageService.removeItem('myKey');
    expect(mockRemoveItem).toHaveBeenCalledWith('myKey');
  });

  it('clearAll removes all storage keys', async () => {
    await storageService.clearAll();
    expect(mockMultiRemove).toHaveBeenCalledWith(
      expect.arrayContaining(['onboardingCompleted', 'authToken', 'currentUser']),
    );
  });

  it('STORAGE_KEYS contains expected keys', () => {
    expect(storageService.STORAGE_KEYS.ONBOARDING).toBe('onboardingCompleted');
    expect(storageService.STORAGE_KEYS.TOKEN).toBe('authToken');
    expect(storageService.STORAGE_KEYS.USER).toBe('currentUser');
    expect(storageService.STORAGE_KEYS.SESSIONS).toBe('resetSessions');
    expect(storageService.STORAGE_KEYS.SETTINGS).toBe('appSettings');
  });
});

// ── Analytics Service ─────────────────────────────────────────────────────────
describe('analyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockGet.mockResolvedValue({
      data: {
        streak: 3,
        totalSessions: 12,
        avgImprovement: 1.75,
        weeklyData: [0, 2, 1, 0, 3, 1, 2],
      },
    });
  });

  it('getAnalytics returns a complete result object', async () => {
    const result = await analyticsService.getAnalytics();
    expect(result).toHaveProperty('streak');
    expect(result).toHaveProperty('totalSessions');
    expect(result).toHaveProperty('avgImprovement');
    expect(result).toHaveProperty('weeklyData');
    expect(result.weeklyData).toHaveLength(7);
  });

  it('totalSessions counts completed sessions', async () => {
    const result = await analyticsService.getAnalytics();
    expect(result.totalSessions).toBe(1);
  });

  it('avgImprovement is a number', async () => {
    const result = await analyticsService.getAnalytics();
    expect(typeof result.avgImprovement).toBe('number');
  });

  it('getLocalAnalytics calculates metrics from stored reset sessions', async () => {
    const result = await analyticsService.getLocalAnalytics();
    expect(result.totalSessions).toBe(1);
    expect(result.avgImprovement).toBe(2);
  });

  it('getRemoteAnalytics retrieves analytics from /analytics', async () => {
    const result = await analyticsService.getRemoteAnalytics();
    expect(mockGet).toHaveBeenCalledWith('/analytics');
    expect(result.totalSessions).toBe(12);
    expect(result.avgImprovement).toBe(1.75);
  });

  it('getAnalytics uses remote analytics when authenticated', async () => {
    const result = await analyticsService.getAnalytics(true);
    expect(mockGet).toHaveBeenCalledWith('/analytics');
    expect(result.streak).toBe(3);
  });
});

// ── Meditation Service ────────────────────────────────────────────────────────
describe('meditationService', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue({
      data: [
        {
          id: 'session-001',
          title: 'Deep Breath Collective',
          description: 'Join thousands in synchronized breathing.',
          start_time: new Date().toISOString(),
          duration_minutes: 15,
          channel_name: 'deep-breath',
          status: 'LIVE',
          max_participants: 100,
          participant_count: 42,
        },
        {
          id: 'session-002',
          title: 'Silent Reset',
          description: 'Guided stillness',
          start_time: new Date().toISOString(),
          duration_minutes: 20,
          channel_name: 'silent-reset',
          status: 'SCHEDULED',
          max_participants: 100,
        },
      ],
    });
  });

  it('getMeditationSessions returns a non-empty array', async () => {
    const sessions = await meditationService.getMeditationSessions();
    expect(sessions.length).toBeGreaterThan(0);
  });

  it('returns a live session', async () => {
    const sessions = await meditationService.getMeditationSessions();
    const live = sessions.find((s) => s.isLive);
    expect(live).toBeTruthy();
    expect(live?.title).toBe('Deep Breath Collective');
  });

  it('retrieves an Agora token for a session', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        appId: 'agora-app-id',
        channelName: 'deep-breath',
        token: 'rtc-token',
        uid: 0,
        expiresAt: '2026-05-13T09:00:00.000Z',
      },
    });
    const token = await meditationService.getMeditationToken('session-001');
    expect(mockGet).toHaveBeenCalledWith('/meditation-sessions/session-001/token');
    expect(token.token).toBe('rtc-token');
  });

  it('returns upcoming sessions', async () => {
    const sessions = await meditationService.getMeditationSessions();
    const upcoming = sessions.filter((s) => !s.isLive);
    expect(upcoming.length).toBeGreaterThan(0);
  });

  it('sessions have required fields', async () => {
    const sessions = await meditationService.getMeditationSessions();
    sessions.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(typeof s.durationMinutes).toBe('number');
      expect(typeof s.participantCount).toBe('number');
    });
  });
});
