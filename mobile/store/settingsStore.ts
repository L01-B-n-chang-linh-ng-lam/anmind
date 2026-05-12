import { create } from 'zustand';
import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import * as settingsService from '@/services/settings.service';

interface SettingsState {
  settings: AppSettings;
  loadSettings(): Promise<void>;
  updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void>;
  resetToDefaults(): Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettings: async () => {
    const settings = await settingsService.loadSettings();
    set({ settings });
  },

  updateSetting: async (key, value) => {
    const updated = await settingsService.updateSetting(key, value);
    set({ settings: updated });
  },

  resetToDefaults: async () => {
    await settingsService.saveSettings({ ...DEFAULT_SETTINGS });
    set({ settings: { ...DEFAULT_SETTINGS } });
  },
}));
