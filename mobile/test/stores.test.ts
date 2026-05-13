import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-get-random-values', () => {});
jest.mock('uuid', () => ({ v4: () => 'test-uuid-store' }));

// Mock all services
jest.mock('@/services/auth.service', () => ({
  login: jest.fn().mockResolvedValue({
    user: { id: '111', username: 'testuser', createdAt: '2026-01-01T00:00:00Z' },
    token: 'mock-token',
  }),
  signup: jest.fn().mockResolvedValue({
    user: { id: '111', username: 'testuser', createdAt: '2026-01-01T00:00:00Z' },
    token: 'mock-token',
  }),
  logout: jest.fn().mockResolvedValue(undefined),
  getCurrentUser: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/services/profile.service', () => ({
  getProfile: jest.fn().mockResolvedValue({
    id: '111',
    username: 'testuser',
    createdAt: '2026-01-01T00:00:00Z',
  }),
}));

jest.mock('@/services/reset.service', () => ({
  getSessions: jest.fn().mockResolvedValue([]),
  addSession: jest.fn().mockImplementation(async (session) => session),
  upsertSession: jest.fn().mockImplementation((sessions, session) => [...sessions, session]),
  updateSession: jest.fn().mockResolvedValue(undefined),
  deleteSession: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/settings.service', () => ({
  loadSettings: jest.fn().mockResolvedValue({
    resetSoundEnabled: false,
    hapticFeedbackEnabled: true,
    reminderEnabled: false,
    reminderTime: '08:00',
    defaultResetDuration: 5,
    suggestUsualMood: true,
    darkMode: true,
    breathingSpeed: 'Normal',
    ambientSound: 'None',
  }),
  saveSettings: jest.fn().mockResolvedValue(undefined),
  updateSetting: jest.fn().mockImplementation(async (key: string, value: any) => ({
    resetSoundEnabled: false,
    hapticFeedbackEnabled: true,
    reminderEnabled: false,
    reminderTime: '08:00',
    defaultResetDuration: 5,
    suggestUsualMood: true,
    darkMode: true,
    breathingSpeed: 'Normal',
    ambientSound: 'None',
    [key]: value,
  })),
}));

jest.mock('@/services/analytics.service', () => ({
  getAnalytics: jest.fn().mockResolvedValue({
    streak: 3,
    totalSessions: 10,
    avgImprovement: 1.5,
    weeklyData: [1, 2, 0, 1, 3, 0, 0],
  }),
}));

jest.mock('@/services/meditation.service', () => ({
  getMeditationSessions: jest.fn().mockResolvedValue([
    {
      id: 'session-001',
      title: 'Deep Breath Collective',
      description: 'Join thousands',
      startTime: new Date().toISOString(),
      durationMinutes: 15,
      participantCount: 4200,
      isLive: true,
    },
  ]),
  getMeditationSession: jest.fn().mockResolvedValue(null),
}));

import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '@/store/authStore';
import { useResetStore } from '@/store/resetStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useMeditationStore } from '@/store/meditationStore';
import type { ResetSession } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

// Reset stores between tests
beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  useResetStore.setState({ sessions: [], currentSession: null });
  useSettingsStore.setState({ settings: { ...DEFAULT_SETTINGS } });
  useAnalyticsStore.setState({ streak: 0, totalSessions: 0, avgImprovement: 0, weeklyData: [0,0,0,0,0,0,0] });
  useMeditationStore.setState({ sessions: [], currentSession: null });
  jest.clearAllMocks();
});

// ── Auth Store ────────────────────────────────────────────────────────────────
describe('authStore', () => {
  it('initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('login sets user, token, and isAuthenticated', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('testuser');
    expect(result.current.token).toBe('mock-token');
  });

  it('logout resets auth state', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('loadAuth does nothing when no stored data', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.loadAuth();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});

// ── Reset Store ───────────────────────────────────────────────────────────────
describe('resetStore', () => {
  const sampleSession: ResetSession = {
    id: 'sess-1',
    durationMinutes: 5,
    startedAt: '2026-01-01T10:00:00Z',
    completed: true,
    scoreBefore: 2,
    scoreAfter: 4,
  };

  it('initial state has empty sessions', () => {
    const { result } = renderHook(() => useResetStore());
    expect(result.current.sessions).toHaveLength(0);
    expect(result.current.currentSession).toBeNull();
  });

  it('loadSessions populates sessions array', async () => {
    const mockResetService = jest.requireMock('@/services/reset.service') as any;
    mockResetService.getSessions.mockResolvedValue([sampleSession]);

    const { result } = renderHook(() => useResetStore());
    await act(async () => {
      await result.current.loadSessions();
    });
    expect(result.current.sessions).toHaveLength(1);
  });

  it('addSession appends to sessions', async () => {
    const { result } = renderHook(() => useResetStore());
    await act(async () => {
      await result.current.addSession(sampleSession);
    });
    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].id).toBe('sess-1');
  });

  it('setCurrentSession updates currentSession', () => {
    const { result } = renderHook(() => useResetStore());
    act(() => {
      result.current.setCurrentSession({ id: 'draft', durationMinutes: 5 });
    });
    expect(result.current.currentSession?.id).toBe('draft');
  });

  it('updateCurrentSession merges updates', () => {
    const { result } = renderHook(() => useResetStore());
    act(() => {
      result.current.setCurrentSession({ id: 'draft', durationMinutes: 5 });
      result.current.updateCurrentSession({ durationMinutes: 10 });
    });
    expect(result.current.currentSession?.durationMinutes).toBe(10);
    expect(result.current.currentSession?.id).toBe('draft');
  });

  it('setCurrentSession(null) clears current session', () => {
    const { result } = renderHook(() => useResetStore());
    act(() => {
      result.current.setCurrentSession({ id: 'draft' });
      result.current.setCurrentSession(null);
    });
    expect(result.current.currentSession).toBeNull();
  });
});

// ── Settings Store ────────────────────────────────────────────────────────────
describe('settingsStore', () => {
  it('has default settings initially', () => {
    const { result } = renderHook(() => useSettingsStore());
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('loadSettings fetches and stores settings', async () => {
    const { result } = renderHook(() => useSettingsStore());
    await act(async () => {
      await result.current.loadSettings();
    });
    expect(result.current.settings.defaultResetDuration).toBe(5);
  });

  it('updateSetting patches a single key', async () => {
    const { result } = renderHook(() => useSettingsStore());
    await act(async () => {
      await result.current.updateSetting('hapticFeedbackEnabled', false);
    });
    expect(result.current.settings.hapticFeedbackEnabled).toBe(false);
  });

  it('resetToDefaults restores default settings', async () => {
    const { result } = renderHook(() => useSettingsStore());
    await act(async () => {
      await result.current.updateSetting('hapticFeedbackEnabled', false);
      await result.current.resetToDefaults();
    });
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });
});

// ── Analytics Store ───────────────────────────────────────────────────────────
describe('analyticsStore', () => {
  it('initial state has zero values', () => {
    const { result } = renderHook(() => useAnalyticsStore());
    expect(result.current.streak).toBe(0);
    expect(result.current.totalSessions).toBe(0);
  });

  it('computeAnalytics populates all fields', async () => {
    const { result } = renderHook(() => useAnalyticsStore());
    await act(async () => {
      await result.current.computeAnalytics();
    });
    expect(result.current.streak).toBe(3);
    expect(result.current.totalSessions).toBe(10);
    expect(result.current.avgImprovement).toBe(1.5);
    expect(result.current.weeklyData).toHaveLength(7);
  });
});

// ── Meditation Store ──────────────────────────────────────────────────────────
describe('meditationStore', () => {
  it('initial state has empty sessions', () => {
    const { result } = renderHook(() => useMeditationStore());
    expect(result.current.sessions).toHaveLength(0);
    expect(result.current.currentSession).toBeNull();
  });

  it('loadSessions fetches mock sessions', async () => {
    const { result } = renderHook(() => useMeditationStore());
    await act(async () => {
      await result.current.loadSessions();
    });
    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].title).toBe('Deep Breath Collective');
  });

  it('setCurrentSession updates currentSession', () => {
    const { result } = renderHook(() => useMeditationStore());
    const session = { id: 'sess-1', title: 'Test', description: '', startTime: '', durationMinutes: 15, participantCount: 100, isLive: true };
    act(() => {
      result.current.setCurrentSession(session);
    });
    expect(result.current.currentSession?.id).toBe('sess-1');
  });

  it('setCurrentSession(null) clears session', () => {
    const { result } = renderHook(() => useMeditationStore());
    act(() => {
      result.current.setCurrentSession(null);
    });
    expect(result.current.currentSession).toBeNull();
  });
});
