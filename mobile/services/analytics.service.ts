import type { ResetSession } from '@/types';
import {
  calculateAvgImprovement,
  calculateStreak,
  getWeeklyData,
} from '@/utils/analytics';
import { api } from './api';
import type { AnalyticsResponse } from './api.types';
import { fromHistoryItem } from './api.types';
import { getItem, STORAGE_KEYS } from './storage.service';
import { getLocalSessions } from './reset.service';

export interface AnalyticsResult {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  averageMoodImprovement: number;
  currentStreak: number;
  weeklyData: number[];
  recentSessions: ResetSession[];
}

export async function getRemoteAnalytics(): Promise<AnalyticsResult> {
  const { data } = await api.get<AnalyticsResponse>('/analytics');
  return normalizeRemoteAnalytics(data);
}

export async function getLocalAnalytics(): Promise<AnalyticsResult> {
  const sessions = await getLocalSessions();
  return buildAnalyticsFromSessions(sessions);
}

export async function getAnalytics(isAuthenticated?: boolean): Promise<AnalyticsResult> {
  const hasAuth = isAuthenticated ?? Boolean(await getItem<string>(STORAGE_KEYS.TOKEN));
  return hasAuth ? getRemoteAnalytics() : getLocalAnalytics();
}

export function buildAnalyticsFromSessions(sessions: ResetSession[]): AnalyticsResult {
  const completed = sessions.filter((session) => session.completed);
  const avgImprovement = calculateAvgImprovement(completed);
  const streak = calculateStreak(completed);
  return {
    streak,
    currentStreak: streak,
    totalSessions: completed.length,
    avgImprovement,
    averageMoodImprovement: avgImprovement,
    weeklyData: getWeeklyData(completed),
    recentSessions: [...completed]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, 5),
  };
}

function normalizeRemoteAnalytics(data: AnalyticsResponse): AnalyticsResult {
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
