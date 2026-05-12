import { create } from 'zustand';
import type { ResetSession } from '@/types';
import * as resetService from '@/services/reset.service';

interface ResetState {
  sessions: ResetSession[];
  currentSession: Partial<ResetSession> | null;
  loadSessions(): Promise<void>;
  addSession(session: ResetSession): Promise<void>;
  setCurrentSession(draft: Partial<ResetSession> | null): void;
  updateCurrentSession(updates: Partial<ResetSession>): void;
}

export const useResetStore = create<ResetState>((set, get) => ({
  sessions: [],
  currentSession: null,

  loadSessions: async () => {
    const sessions = await resetService.getSessions();
    set({ sessions });
  },

  addSession: async (session) => {
    await resetService.addSession(session);
    set((state) => ({ sessions: [...state.sessions, session] }));
  },

  setCurrentSession: (draft) => set({ currentSession: draft }),

  updateCurrentSession: (updates) => {
    const current = get().currentSession;
    if (current) {
      set({ currentSession: { ...current, ...updates } });
    }
  },
}));
