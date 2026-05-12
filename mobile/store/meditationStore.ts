import { create } from 'zustand';
import type { MeditationSession } from '@/types';
import * as meditationService from '@/services/meditation.service';

interface MeditationState {
  sessions: MeditationSession[];
  currentSession: MeditationSession | null;
  loadSessions(): Promise<void>;
  setCurrentSession(session: MeditationSession | null): void;
}

export const useMeditationStore = create<MeditationState>((set) => ({
  sessions: [],
  currentSession: null,

  loadSessions: async () => {
    const sessions = await meditationService.getMeditationSessions();
    set({ sessions });
  },

  setCurrentSession: (session) => set({ currentSession: session }),
}));
