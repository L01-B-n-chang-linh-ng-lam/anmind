import { create } from 'zustand';
import type { ResetSession } from '@/types';
import * as resetService from '@/services/reset.service';

interface ResetState {
  sessions: ResetSession[];
  currentSession: Partial<ResetSession> | null;
  loading: boolean;
  error: string | null;
  loadSessions(): Promise<void>;
  addSession(session: ResetSession): Promise<void>;
  setCurrentSession(draft: Partial<ResetSession> | null): void;
  updateCurrentSession(updates: Partial<ResetSession>): void;
}

export const useResetStore = create<ResetState>((set, get) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,

  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await resetService.getSessions();
      set({ sessions, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unable to load sessions.', loading: false });
    }
  },

  addSession: async (session) => {
    const saved = await resetService.addSession(session);
    set((state) => ({ sessions: resetService.upsertSession(state.sessions, saved) }));
  },

  setCurrentSession: (draft) => set({ currentSession: draft }),

  updateCurrentSession: (updates) => {
    const current = get().currentSession;
    if (current) {
      set({ currentSession: { ...current, ...updates } });
    }
  },
}));
