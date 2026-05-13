import * as Sentry from '@sentry/react-native';
import type { User } from '@/types';
import { api } from './api';
import type {
  ApiAuthResponse,
  LoginRequest,
  SignupRequest,
  SignupResponse,
} from './api.types';
import { getItem, removeItem, setItem, STORAGE_KEYS } from './storage.service';

export async function login(
  username: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const { data } = await api.post<ApiAuthResponse, { data: ApiAuthResponse }, LoginRequest>(
    '/auth/login',
    { username, password },
  );
  const result = { user: data.user, token: data.access_token };
  await setItem(STORAGE_KEYS.TOKEN, result.token);
  await setItem(STORAGE_KEYS.USER, result.user);
  Sentry.setUser({ id: result.user.id, username: result.user.username });
  return result;
}

export async function signup(
  username: string,
  _email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  await api.post<SignupResponse, { data: SignupResponse }, SignupRequest>(
    '/auth/signup',
    { username, password },
  );
  return login(username, password);
}

export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.TOKEN);
  await removeItem(STORAGE_KEYS.USER);
  Sentry.setUser(null);
}

export async function getCurrentUser(): Promise<{ user: User; token: string } | null> {
  const token = await getItem<string>(STORAGE_KEYS.TOKEN);
  const user = await getItem<User>(STORAGE_KEYS.USER);
  if (!token || !user) return null;
  return { user, token };
}
