export type MoodLabel = 'Stressed' | 'Overwhelmed' | 'Anxious' | 'Neutral' | 'Calm';

export const MOOD_SCORES: Record<MoodLabel, number> = {
  Stressed: 1,
  Overwhelmed: 2,
  Anxious: 3,
  Neutral: 4,
  Calm: 5,
};

export const MOOD_EMOJIS: Record<MoodLabel, string> = {
  Stressed: '😣',
  Overwhelmed: '😰',
  Anxious: '😟',
  Neutral: '😐',
  Calm: '😊',
};

export interface ResetSession {
  id: string;
  externalId?: string;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  completed: boolean;
  scoreBefore?: number;
  scoreAfter?: number;
  synced?: boolean;
  syncError?: string;
}

export interface AppSettings {
  resetSoundEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  defaultResetDuration: 3 | 5 | 7 | 10;
  suggestUsualMood: boolean;
  darkMode: boolean;
  breathingSpeed: 'Slow' | 'Normal' | 'Fast';
  ambientSound: 'None' | 'Rain' | 'Ocean' | 'Forest' | 'White Noise';
}

export const DEFAULT_SETTINGS: AppSettings = {
  resetSoundEnabled: false,
  hapticFeedbackEnabled: true,
  reminderEnabled: false,
  reminderTime: '08:00',
  defaultResetDuration: 5,
  suggestUsualMood: true,
  darkMode: true,
  breathingSpeed: 'Normal',
  ambientSound: 'None',
};

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  participantCount: number;
  isLive: boolean;
  channelName?: string;
  status?: string;
  maxParticipants?: number;
}
