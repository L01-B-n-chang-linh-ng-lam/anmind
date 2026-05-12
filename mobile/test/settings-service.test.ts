import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as settingsService from '@/services/settings.service';
import { DEFAULT_SETTINGS } from '@/types';

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

describe('settingsService.loadSettings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns DEFAULT_SETTINGS when storage is empty', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await settingsService.loadSettings();
    expect(result).toEqual(DEFAULT_SETTINGS);
  });

  it('returns parsed settings from storage', async () => {
    const stored = { ...DEFAULT_SETTINGS, hapticFeedbackEnabled: false };
    mockGetItem.mockResolvedValue(JSON.stringify(stored));
    const result = await settingsService.loadSettings();
    expect(result.hapticFeedbackEnabled).toBe(false);
  });
});

describe('settingsService.saveSettings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('saves settings to appSettings key', async () => {
    await settingsService.saveSettings(DEFAULT_SETTINGS);
    expect(mockSetItem).toHaveBeenCalledWith(
      'appSettings',
      JSON.stringify(DEFAULT_SETTINGS),
    );
  });
});

describe('settingsService.updateSetting', () => {
  beforeEach(() => jest.clearAllMocks());

  it('patches the specified key and returns updated settings', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify(DEFAULT_SETTINGS));
    const result = await settingsService.updateSetting('hapticFeedbackEnabled', false);
    expect(result.hapticFeedbackEnabled).toBe(false);
    // Other settings unchanged
    expect(result.reminderEnabled).toBe(DEFAULT_SETTINGS.reminderEnabled);
  });

  it('persists the updated settings', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify(DEFAULT_SETTINGS));
    await settingsService.updateSetting('defaultResetDuration', 10);
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved.defaultResetDuration).toBe(10);
  });
});
