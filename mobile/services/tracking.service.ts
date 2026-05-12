import * as Sentry from '@sentry/react-native';

export function trackResetStarted(durationMinutes: number, scoreBefore?: number) {
  Sentry.captureMessage('reset_started', {
    level: 'info',
    tags: { feature: 'reset' },
    extra: { durationMinutes, scoreBefore },
  });
}

export function trackResetCompleted(
  durationMinutes: number,
  scoreBefore?: number,
  scoreAfter?: number,
) {
  const moodImprovement =
    scoreAfter != null && scoreBefore != null ? scoreAfter - scoreBefore : undefined;
  Sentry.captureMessage('reset_completed', {
    level: 'info',
    tags: { feature: 'reset' },
    extra: { durationMinutes, scoreBefore, scoreAfter, moodImprovement },
  });
}

export function trackResetAbandoned(timeRemainingSeconds: number) {
  Sentry.captureMessage('reset_abandoned', {
    level: 'info',
    tags: { feature: 'reset' },
    extra: { timeRemainingSeconds },
  });
}

export function trackReminderEnabled(reminderTime: string) {
  Sentry.captureMessage('reminder_enabled', {
    level: 'info',
    tags: { feature: 'reminder' },
    extra: { enabled: true, reminderTime },
  });
}

export function trackReminderDisabled() {
  Sentry.captureMessage('reminder_disabled', {
    level: 'info',
    tags: { feature: 'reminder' },
  });
}

export function trackSatisfactionSubmitted(score: number, feedback?: string) {
  Sentry.captureMessage('satisfaction_submitted', {
    level: 'info',
    tags: { feature: 'survey' },
    extra: { score, feedback },
  });
}

export function trackSettingsOpened() {
  Sentry.captureMessage('settings_opened', { level: 'info' });
}

export function trackMeditationSessionJoined(sessionId: string) {
  Sentry.captureMessage('meditation_session_joined', {
    level: 'info',
    tags: { feature: 'community' },
    extra: { sessionId },
  });
}
