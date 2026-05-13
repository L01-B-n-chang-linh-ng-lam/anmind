import { create } from 'zustand';
import type { MeditationSession } from '@/types';
import * as meditationService from '@/services/meditation.service';

interface MeditationState {
  sessions: MeditationSession[];
  currentSession: MeditationSession | null;
  loading: boolean;
  error: string | null;
  loadSessions(): Promise<void>;
  loadSession(id: string): Promise<MeditationSession | null>;
  setCurrentSession(session: MeditationSession | null): void;
}

export const useMeditationStore = create<MeditationState>((set) => ({
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,

  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await meditationService.getMeditationSessions();
      set({ sessions, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load sessions.',
      });
    }
  },

  loadSession: async (id) => {
    set({ loading: true, error: null });
    try {
      const session = await meditationService.getMeditationSession(id);
      set((state) => ({
        currentSession: session,
        sessions: state.sessions.some((s) => s.id === session.id)
          ? state.sessions.map((s) => (s.id === session.id ? session : s))
          : [...state.sessions, session],
        loading: false,
      }));
      return session;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load session.',
      });
      return null;
    }
  },

  setCurrentSession: (session) => set({ currentSession: session }),
}));
