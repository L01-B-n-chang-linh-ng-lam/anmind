import {
  calculateAvgImprovement,
  calculateStreak,
  getWeeklyData,
} from '@/utils/analytics';
import { getSessions } from './reset.service';

export interface AnalyticsResult {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  weeklyData: number[];
}

export async function getAnalytics(): Promise<AnalyticsResult> {
  const sessions = await getSessions();
  const completed = sessions.filter((s) => s.completed);
  return {
    streak: calculateStreak(sessions),
    totalSessions: completed.length,
    avgImprovement: calculateAvgImprovement(sessions),
    weeklyData: getWeeklyData(sessions),
  };
}
