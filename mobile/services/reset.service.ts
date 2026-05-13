import * as Sentry from '@sentry/react-native';
import type { ResetSession } from '@/types';
import { api, getUserFriendlyError } from './api';
import type {
  HistoryItemResponse,
  ResetResponse,
} from './api.types';
import { fromHistoryItem, toResetRequest } from './api.types';
import { getItem, setItem, STORAGE_KEYS } from './storage.service';

export async function getSessions(): Promise<ResetSession[]> {
  const local = (await getItem<ResetSession[]>(STORAGE_KEYS.SESSIONS)) ?? [];
  try {
    const { data } = await api.get<HistoryItemResponse[]>('/history');
    const remote = data.map(fromHistoryItem);
    const merged = mergeSessions(local, remote);
    await setItem(STORAGE_KEYS.SESSIONS, merged);
    return merged;
  } catch {
    return local;
  }
}

export async function addSession(session: ResetSession): Promise<ResetSession> {
  return Sentry.startSpan({ name: 'storage.addSession', op: 'db' }, async () => {
    const draft = {
      ...session,
      externalId: session.externalId ?? session.id,
      synced: false,
    };
    const sessions = await getLocalSessions();
    await setItem(STORAGE_KEYS.SESSIONS, upsertSession(sessions, draft));

    try {
      const synced = await submitSession(draft);
      await setItem(STORAGE_KEYS.SESSIONS, upsertSession(await getLocalSessions(), synced));
      return synced;
    } catch (error) {
      const failed = { ...draft, syncError: getUserFriendlyError(error) };
      await setItem(STORAGE_KEYS.SESSIONS, upsertSession(await getLocalSessions(), failed));
      return failed;
    }
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

export async function getLocalSessions(): Promise<ResetSession[]> {
  return (await getItem<ResetSession[]>(STORAGE_KEYS.SESSIONS)) ?? [];
}

export async function submitSession(session: ResetSession): Promise<ResetSession> {
  const request = toResetRequest(session);
  if (!request) {
    throw new Error('Reset session is incomplete or invalid.');
  }

  const { data } = await api.post<ResetResponse>('/reset', request);
  return {
    ...session,
    id: data.session_id,
    externalId: request.external_id,
    synced: true,
    syncError: undefined,
  };
}

export async function loadHistory(): Promise<ResetSession[]> {
  const { data } = await api.get<HistoryItemResponse[]>('/history');
  const sessions = data.map(fromHistoryItem);
  await setItem(STORAGE_KEYS.SESSIONS, mergeSessions(await getLocalSessions(), sessions));
  return sessions;
}

export function upsertSession(
  sessions: ResetSession[],
  session: ResetSession,
): ResetSession[] {
  const key = session.externalId ?? session.id;
  const idx = sessions.findIndex((s) => s.id === session.id || s.externalId === key);
  if (idx === -1) return [...sessions, session];
  const next = [...sessions];
  next[idx] = { ...next[idx], ...session };
  return next;
}

function mergeSessions(local: ResetSession[], remote: ResetSession[]): ResetSession[] {
  return [...local, ...remote].reduce<ResetSession[]>((acc, session) => {
    return upsertSession(acc, session);
  }, []);
}
