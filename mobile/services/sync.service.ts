import type { ResetSession } from '@/types';
import { api } from './api';
import type { SyncRequest, SyncResponse } from './api.types';
import { toResetRequest } from './api.types';
import { getLocalSessions, upsertSession } from './reset.service';
import { setItem, STORAGE_KEYS } from './storage.service';

export interface SyncResult extends SyncResponse {
  uploaded: ResetSession[];
  skipped: ResetSession[];
  lastSyncedAt: string;
}

export async function syncResetSessions(): Promise<SyncResult> {
  const sessions = await getLocalSessions();
  const unsynced = sessions.filter((s) => s.completed && !s.synced);
  const validItems = unsynced
    .map((session) => ({ session, request: toResetRequest(session) }))
    .filter((item): item is { session: ResetSession; request: NonNullable<ReturnType<typeof toResetRequest>> } =>
      item.request != null,
    );

  const request: SyncRequest = {
    sessions: validItems.map((item) => item.request),
  };
  const { data } = await api.post<SyncResponse>('/sync', request);
  const uploaded = validItems.map(({ session }) => ({
    ...session,
    synced: true,
    syncError: undefined,
  }));
  const merged = uploaded.reduce(upsertSession, sessions);
  const lastSyncedAt = new Date().toISOString();

  await setItem(STORAGE_KEYS.SESSIONS, merged);
  await setItem(STORAGE_KEYS.LAST_SYNCED_AT, lastSyncedAt);

  return {
    ...data,
    uploaded,
    skipped: unsynced.filter((s) => !validItems.some((item) => item.session.id === s.id)),
    lastSyncedAt,
  };
}
