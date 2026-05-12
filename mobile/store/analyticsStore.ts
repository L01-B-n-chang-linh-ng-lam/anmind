import { create } from 'zustand';
import * as analyticsService from '@/services/analytics.service';

interface AnalyticsState {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  weeklyData: number[];
  computeAnalytics(): Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  streak: 0,
  totalSessions: 0,
  avgImprovement: 0,
  weeklyData: [0, 0, 0, 0, 0, 0, 0],

  computeAnalytics: async () => {
    const result = await analyticsService.getAnalytics();
    set(result);
  },
}));
