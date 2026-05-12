import type { ResetSession } from '@/types';

export function calculateStreak(sessions: ResetSession[]): number {
  const completed = sessions.filter((s) => s.completed);
  if (completed.length === 0) return 0;

  const daySet = new Set(
    completed.map((s) => {
      const d = new Date(s.startedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (daySet.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateAvgImprovement(sessions: ResetSession[]): number {
  const eligible = sessions.filter(
    (s) => s.completed && s.scoreBefore != null && s.scoreAfter != null,
  );
  if (eligible.length === 0) return 0;
  const total = eligible.reduce(
    (sum, s) => sum + (s.scoreAfter! - s.scoreBefore!),
    0,
  );
  return total / eligible.length;
}

export function getWeeklyData(sessions: ResetSession[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0]; // Mon–Sun

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  // Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  sessions
    .filter((s) => s.completed)
    .forEach((s) => {
      const d = new Date(s.startedAt);
      if (d >= monday && d <= sunday) {
        const idx = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
        counts[idx]++;
      }
    });

  return counts;
}
