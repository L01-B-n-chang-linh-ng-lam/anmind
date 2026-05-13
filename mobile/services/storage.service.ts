import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  ONBOARDING: 'onboardingCompleted',
  TOPICS: 'selectedTopics',
  TOKEN: 'authToken',
  USER: 'currentUser',
  SESSIONS: 'resetSessions',
  LAST_SYNCED_AT: 'lastSyncedAt',
  SETTINGS: 'appSettings',
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  return JSON.parse(raw) as T;
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
