import type { User } from '@/types';
import { api } from './api';
import type { ProfileResponse } from './api.types';
import { setItem, STORAGE_KEYS } from './storage.service';

export async function getProfile(): Promise<User> {
  const { data } = await api.get<ProfileResponse>('/profile');
  await setItem(STORAGE_KEYS.USER, data);
  return data;
}
