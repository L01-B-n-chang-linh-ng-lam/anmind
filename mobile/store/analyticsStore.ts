import { create } from 'zustand';
import * as analyticsService from '@/services/analytics.service';

interface AnalyticsState {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  weeklyData: number[];
  loading: boolean;
  error: string | null;
  computeAnalytics(isAuthenticated?: boolean): Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  streak: 0,
  totalSessions: 0,
  avgImprovement: 0,
  weeklyData: [0, 0, 0, 0, 0, 0, 0],
  loading: false,
  error: null,

  computeAnalytics: async (isAuthenticated) => {
    set({ loading: true, error: null });
    try {
      const result = await analyticsService.getAnalytics(isAuthenticated);
      set({ ...result, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load analytics.',
      });
    }
  },
}));
