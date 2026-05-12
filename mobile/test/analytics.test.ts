import { describe, expect, it } from '@jest/globals';
import {
  calculateAvgImprovement,
  calculateStreak,
  getWeeklyData,
} from '@/utils/analytics';
import type { ResetSession } from '@/types';

function makeSession(
  overrides: Partial<ResetSession> & { daysAgo?: number },
): ResetSession {
  const d = new Date();
  if (overrides.daysAgo !== undefined) {
    d.setDate(d.getDate() - overrides.daysAgo);
  }
  return {
    id: `s-${Math.random()}`,
    durationMinutes: 5,
    startedAt: d.toISOString(),
    completed: true,
    ...overrides,
  };
}

describe('calculateStreak', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 0 when no completed sessions', () => {
    const sessions = [makeSession({ completed: false, daysAgo: 0 })];
    expect(calculateStreak(sessions)).toBe(0);
  });

  it('returns 1 for a single session today', () => {
    const sessions = [makeSession({ daysAgo: 0 })];
    expect(calculateStreak(sessions)).toBe(1);
  });

  it('counts consecutive days correctly', () => {
    const sessions = [
      makeSession({ daysAgo: 0 }),
      makeSession({ daysAgo: 1 }),
      makeSession({ daysAgo: 2 }),
    ];
    expect(calculateStreak(sessions)).toBe(3);
  });

  it('breaks streak when there is a gap', () => {
    // Days 0, 1, then skip 2, then 3
    const sessions = [
      makeSession({ daysAgo: 0 }),
      makeSession({ daysAgo: 1 }),
      makeSession({ daysAgo: 3 }),
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it('ignores incomplete sessions', () => {
    const sessions = [
      makeSession({ daysAgo: 0 }),
      makeSession({ daysAgo: 1, completed: false }),
    ];
    // Only today counts (yesterday was incomplete, breaking the streak at day 1)
    expect(calculateStreak(sessions)).toBe(1);
  });
});

describe('calculateAvgImprovement', () => {
  it('returns 0 for empty sessions', () => {
    expect(calculateAvgImprovement([])).toBe(0);
  });

  it('returns 0 when no sessions have both scores', () => {
    const sessions = [makeSession({ scoreBefore: 2 })]; // no scoreAfter
    expect(calculateAvgImprovement(sessions)).toBe(0);
  });

  it('calculates average improvement correctly', () => {
    const sessions = [
      makeSession({ scoreBefore: 2, scoreAfter: 4 }), // +2
      makeSession({ scoreBefore: 3, scoreAfter: 5 }), // +2
    ];
    expect(calculateAvgImprovement(sessions)).toBe(2);
  });

  it('handles negative improvement', () => {
    const sessions = [
      makeSession({ scoreBefore: 4, scoreAfter: 2 }), // -2
      makeSession({ scoreBefore: 3, scoreAfter: 5 }), // +2
    ];
    expect(calculateAvgImprovement(sessions)).toBe(0);
  });

  it('excludes sessions without scoreAfter', () => {
    const sessions = [
      makeSession({ scoreBefore: 2, scoreAfter: 4 }), // +2
      makeSession({ scoreBefore: 2 }), // excluded
    ];
    expect(calculateAvgImprovement(sessions)).toBe(2);
  });

  it('excludes incomplete sessions without scores', () => {
    const sessions = [
      makeSession({ scoreBefore: 1, scoreAfter: 5 }), // +4
      makeSession({ completed: false }),               // no scores, excluded
    ];
    expect(calculateAvgImprovement(sessions)).toBe(4);
  });
});

describe('getWeeklyData', () => {
  it('returns a 7-element array', () => {
    expect(getWeeklyData([])).toHaveLength(7);
  });

  it('returns all zeros for empty sessions', () => {
    expect(getWeeklyData([])).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('counts sessions that fall in the current ISO week', () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = (dayOfWeek + 6) % 7;

    const sessions = [
      makeSession({ daysAgo: daysFromMonday }), // Monday of current week
    ];
    const result = getWeeklyData(sessions);
    expect(result[0]).toBe(1); // Monday slot
  });

  it('does not count sessions outside the current week', () => {
    const sessions = [makeSession({ daysAgo: 8 })]; // last week
    const result = getWeeklyData(sessions);
    expect(result.reduce((a, b) => a + b, 0)).toBe(0);
  });

  it('counts multiple sessions on the same day', () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = (dayOfWeek + 6) % 7;
    const sessions = [
      makeSession({ daysAgo: daysFromMonday }),
      makeSession({ daysAgo: daysFromMonday }),
    ];
    const result = getWeeklyData(sessions);
    expect(result[0]).toBe(2);
  });

  it('excludes incomplete sessions', () => {
    const sessions = [makeSession({ daysAgo: 0, completed: false })];
    const result = getWeeklyData(sessions);
    expect(result.reduce((a, b) => a + b, 0)).toBe(0);
  });
});
