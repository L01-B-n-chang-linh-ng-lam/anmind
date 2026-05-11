import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const sessions = await this.prisma.resetSession.findMany({
      where: { userId },
      include: { moodEntry: true },
      orderBy: { startedAt: 'desc' },
    });

    const total_sessions = sessions.length;
    const withMood = sessions.filter(
      (s) =>
        s.moodEntry?.scoreBefore != null && s.moodEntry?.scoreAfter != null,
    );
    const improvements = withMood.map(
      (s) => s.moodEntry!.scoreBefore! - s.moodEntry!.scoreAfter!,
    );
    const avg_improvement =
      improvements.length > 0
        ? improvements.reduce((a, b) => a + b, 0) / improvements.length
        : 0;
    const success_rate =
      improvements.length > 0
        ? improvements.filter((i) => i > 0).length / improvements.length
        : 0;
    const streak_days = this.calcStreak(sessions.map((s) => s.startedAt));

    return {
      total_sessions,
      avg_improvement: Math.round(avg_improvement * 100) / 100,
      success_rate: Math.round(success_rate * 100) / 100,
      streak_days,
    };
  }

  async getTrend(userId: string) {
    const sessions = await this.prisma.resetSession.findMany({
      where: { userId },
      include: { moodEntry: true },
      orderBy: { startedAt: 'asc' },
    });

    const byDate = new Map<string, { improvements: number[]; count: number }>();

    for (const s of sessions) {
      const date = s.startedAt.toISOString().split('T')[0];
      if (!byDate.has(date)) byDate.set(date, { improvements: [], count: 0 });
      const entry = byDate.get(date)!;
      entry.count++;
      if (s.moodEntry?.scoreBefore != null && s.moodEntry?.scoreAfter != null) {
        entry.improvements.push(
          s.moodEntry.scoreBefore - s.moodEntry.scoreAfter,
        );
      }
    }

    return Array.from(byDate.entries()).map(([date, data]) => ({
      date,
      avg_improvement:
        data.improvements.length > 0
          ? Math.round(
              (data.improvements.reduce((a, b) => a + b, 0) /
                data.improvements.length) *
                100,
            ) / 100
          : 0,
      total_sessions: data.count,
    }));
  }

  private calcStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const unique = [...new Set(dates.map((d) => d.toISOString().split('T')[0]))]
      .sort()
      .reverse();
    const today = new Date().toISOString().split('T')[0];

    let streak = 0;
    let current = today;

    for (const date of unique) {
      if (date === current) {
        streak++;
        const d = new Date(current);
        d.setDate(d.getDate() - 1);
        current = d.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    return streak;
  }
}
