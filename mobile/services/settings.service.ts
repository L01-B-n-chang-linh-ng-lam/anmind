import { AppSettings, DEFAULT_SETTINGS } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from './storage.service';

export async function loadSettings(): Promise<AppSettings> {
  return (await getItem<AppSettings>(STORAGE_KEYS.SETTINGS)) ?? { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setItem(STORAGE_KEYS.SETTINGS, settings);
}

export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<AppSettings> {
  const settings = await loadSettings();
  const updated: AppSettings = { ...settings, [key]: value };
  await saveSettings(updated);
  return updated;
}
