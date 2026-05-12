import type { MeditationSession } from '@/types';

const MOCK_SESSIONS: MeditationSession[] = [
  {
    id: 'session-001',
    title: 'Deep Breath Collective',
    description: 'Join thousands in synchronized breathing.',
    startTime: new Date().toISOString(),
    durationMinutes: 15,
    participantCount: 4200,
    isLive: true,
  },
  {
    id: 'session-002',
    title: 'Silent Reset',
    description: 'Guided stillness for mental clarity.',
    startTime: (() => {
      const d = new Date();
      d.setHours(14, 0, 0, 0);
      return d.toISOString();
    })(),
    durationMinutes: 20,
    participantCount: 0,
    isLive: false,
  },
  {
    id: 'session-003',
    title: 'Ethereal Focus',
    description: 'Sound bath for deep concentration.',
    startTime: (() => {
      const d = new Date();
      d.setHours(15, 30, 0, 0);
      return d.toISOString();
    })(),
    durationMinutes: 10,
    participantCount: 0,
    isLive: false,
  },
];

export async function getMeditationSessions(): Promise<MeditationSession[]> {
  return MOCK_SESSIONS;
}
