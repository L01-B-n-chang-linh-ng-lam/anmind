import type { ResetSession } from '@/types';
import { api } from './api';
import type { AnalyticsResponse } from './api.types';
import { fromHistoryItem } from './api.types';

export interface AnalyticsResult {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  averageMoodImprovement: number;
  currentStreak: number;
  weeklyData: number[];
  recentSessions: ResetSession[];
}

export async function getAnalytics(): Promise<AnalyticsResult> {
  const { data } = await api.get<AnalyticsResponse>('/analytics');
  const avgImprovement = data.avgImprovement ?? 0;
  const streak = data.streak ?? 0;
  return {
    streak,
    currentStreak: streak,
    totalSessions: data.totalSessions ?? 0,
    avgImprovement,
    averageMoodImprovement: avgImprovement,
    weeklyData: Array.isArray(data.weeklyData) ? data.weeklyData : [0, 0, 0, 0, 0, 0, 0],
    recentSessions: data.recentSessions?.map(fromHistoryItem) ?? [],
  };
}
