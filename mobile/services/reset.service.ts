import * as Sentry from '@sentry/react-native';
import type { ResetSession } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from './storage.service';

export async function getSessions(): Promise<ResetSession[]> {
  return (await getItem<ResetSession[]>(STORAGE_KEYS.SESSIONS)) ?? [];
}

export async function addSession(session: ResetSession): Promise<void> {
  return Sentry.startSpan({ name: 'storage.addSession', op: 'db' }, async () => {
    const sessions = await getSessions();
    sessions.push(session);
    await setItem(STORAGE_KEYS.SESSIONS, sessions);
  });
}

export async function updateSession(
  id: string,
  updates: Partial<ResetSession>,
): Promise<void> {
  const sessions = await getSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    sessions[idx] = { ...sessions[idx], ...updates };
    await setItem(STORAGE_KEYS.SESSIONS, sessions);
  }
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  await setItem(
    STORAGE_KEYS.SESSIONS,
    sessions.filter((s) => s.id !== id),
  );
}

export async function clearSessions(): Promise<void> {
  await setItem(STORAGE_KEYS.SESSIONS, []);
}
