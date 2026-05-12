import type { User } from '@/types';
import { generateId } from '@/utils/uuid';
import { getItem, removeItem, setItem, STORAGE_KEYS } from './storage.service';

const MOCK_TOKEN = 'mock-jwt-token-anmind-2026';

const ADMIN_USER: User = {
  id: '11111111-1111-1111-1111-111111111111',
  username: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};

export async function login(
  _email: string,
  _password: string,
): Promise<{ user: User; token: string }> {
  const result = { user: ADMIN_USER, token: MOCK_TOKEN };
  await setItem(STORAGE_KEYS.TOKEN, result.token);
  await setItem(STORAGE_KEYS.USER, result.user);
  return result;
}

export async function signup(
  username: string,
  _email: string,
  _password: string,
): Promise<{ user: User; token: string }> {
  const user: User = {
    id: generateId(),
    username,
    createdAt: new Date().toISOString(),
  };
  const result = { user, token: MOCK_TOKEN };
  await setItem(STORAGE_KEYS.TOKEN, result.token);
  await setItem(STORAGE_KEYS.USER, result.user);
  return result;
}

export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.TOKEN);
  await removeItem(STORAGE_KEYS.USER);
}

export async function getCurrentUser(): Promise<{ user: User; token: string } | null> {
  const token = await getItem<string>(STORAGE_KEYS.TOKEN);
  const user = await getItem<User>(STORAGE_KEYS.USER);
  if (!token || !user) return null;
  return { user, token };
}
