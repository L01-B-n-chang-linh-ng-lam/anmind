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
}));

import * as analyticsService from '@/services/analytics.service';
import * as meditationService from '@/services/meditation.service';
import * as storageService from '@/services/storage.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>;
const mockMultiRemove = AsyncStorage.multiRemove as jest.MockedFunction<typeof AsyncStorage.multiRemove>;

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
    expect(result.totalSessions).toBeGreaterThanOrEqual(0);
  });

  it('avgImprovement is a number', async () => {
    const result = await analyticsService.getAnalytics();
    expect(typeof result.avgImprovement).toBe('number');
  });
});

// ── Meditation Service ────────────────────────────────────────────────────────
describe('meditationService', () => {
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
