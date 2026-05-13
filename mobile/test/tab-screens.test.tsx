import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// ── Shared mocks ──────────────────────────────────────────────────────────────
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({ sessionId: 'session-001' }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-get-random-values', () => {});
jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

// Store mocks — each hook handles both selector and full-state usage
jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = {
      settings: { resetSoundEnabled: false, hapticFeedbackEnabled: true, reminderEnabled: false, reminderTime: '08:00', defaultResetDuration: 5, suggestUsualMood: true, darkMode: true, breathingSpeed: 'Normal', ambientSound: 'None' },
      loadSettings: jest.fn(), updateSetting: jest.fn(), resetToDefaults: jest.fn(),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => {
    const s = {
      sessions: [],
      currentSession: { id: 'mock-uuid', durationMinutes: 5, startedAt: '2026-01-01T10:00:00Z' },
      setCurrentSession: jest.fn(), updateCurrentSession: jest.fn(),
      addSession: jest.fn().mockResolvedValue(undefined), loadSessions: jest.fn(),
      loading: false, error: null,
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel?: any) => {
    const s = {
      user: { id: '111', username: 'testuser', createdAt: '2026-01-01T00:00:00Z' },
      token: 'mock-token', isAuthenticated: true,
      logout: jest.fn().mockResolvedValue(undefined), loadAuth: jest.fn(),
      refreshProfile: jest.fn().mockResolvedValue(undefined),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/meditationStore', () => ({
  useMeditationStore: (sel?: any) => {
    const s = {
      sessions: [
        { id: 'session-001', title: 'Deep Breath Collective', description: 'Join thousands', startTime: new Date().toISOString(), durationMinutes: 15, participantCount: 4200, isLive: true },
        { id: 'session-002', title: 'Silent Reset', description: 'Guided stillness', startTime: new Date().toISOString(), durationMinutes: 20, participantCount: 0, isLive: false },
      ],
      currentSession: null, loadSessions: jest.fn(), loadSession: jest.fn().mockResolvedValue(null), setCurrentSession: jest.fn(),
      loading: false, error: null,
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/analyticsStore', () => ({
  useAnalyticsStore: (sel?: any) => {
    const s = { streak: 3, totalSessions: 10, avgImprovement: 1.5, weeklyData: [1,2,0,1,3,0,0], loading: false, error: null, computeAnalytics: jest.fn() };
    return sel ? sel(s) : s;
  },
}));

jest.mock('react-native-chart-kit', () => {
  const { View, Text } = require('react-native');
  return { BarChart: ({ testID }: any) => <View testID={testID ?? 'bar-chart'}><Text>Chart</Text></View> };
});

// ── Reset Tab Screen ──────────────────────────────────────────────────────────
import ResetStartScreen from '@/app/(tabs)/reset';

describe('ResetStartScreen', () => {
  beforeEach(() => { mockPush.mockClear(); mockReplace.mockClear(); });

  it('renders without crashing', () => {
    render(<ResetStartScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders heading', () => {
    render(<ResetStartScreen />);
    expect(screen.getByText('Quick Check-in')).toBeTruthy();
  });

  it('renders Start Reset button', () => {
    render(<ResetStartScreen />);
    expect(screen.getByTestId('start-reset-btn')).toBeTruthy();
  });

  it('Start Reset is disabled when no mood selected', () => {
    render(<ResetStartScreen />);
    const btn = screen.getByTestId('start-reset-btn');
    expect(btn.props.accessibilityState?.disabled).toBeTruthy();
  });

  it('renders Go With Others button', () => {
    render(<ResetStartScreen />);
    expect(screen.getByTestId('go-with-others-btn')).toBeTruthy();
  });

  it('Go With Others navigates to community', () => {
    render(<ResetStartScreen />);
    fireEvent.press(screen.getByTestId('go-with-others-btn'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/community');
  });

  it('renders mood selector options', () => {
    render(<ResetStartScreen />);
    expect(screen.getByTestId('mood-stressed')).toBeTruthy();
    expect(screen.getByTestId('mood-calm')).toBeTruthy();
  });

  it('renders duration selector options', () => {
    render(<ResetStartScreen />);
    expect(screen.getByTestId('duration-5')).toBeTruthy();
  });
});

// ── Community Screen ──────────────────────────────────────────────────────────
import CommunityScreen from '@/app/(tabs)/community';

describe('CommunityScreen', () => {
  beforeEach(() => { mockPush.mockClear(); });

  it('renders without crashing', () => {
    render(<CommunityScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders The Station heading', () => {
    render(<CommunityScreen />);
    expect(screen.getByText('The Station')).toBeTruthy();
  });

  it('renders live session title', () => {
    render(<CommunityScreen />);
    expect(screen.getByText('Deep Breath Collective')).toBeTruthy();
  });

  it('renders Live Now badge', () => {
    render(<CommunityScreen />);
    expect(screen.getByText('Live Now')).toBeTruthy();
  });

  it('renders Join Session button', () => {
    render(<CommunityScreen />);
    expect(screen.getByRole('button', { name: 'Join Session' })).toBeTruthy();
  });

  it('Join Session navigates to meditation-room', () => {
    render(<CommunityScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Join Session' }));
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/meditation-room' }),
    );
  });

  it('renders upcoming sessions', () => {
    render(<CommunityScreen />);
    expect(screen.getByText('Silent Reset')).toBeTruthy();
  });
});

// ── Profile Screen ────────────────────────────────────────────────────────────
import ProfileScreen from '@/app/(tabs)/profile';

describe('ProfileScreen', () => {
  beforeEach(() => { mockReplace.mockClear(); });

  it('renders without crashing', () => {
    render(<ProfileScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Profile heading', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('renders username', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('testuser')).toBeTruthy();
  });

  it('renders Log Out button when authenticated', () => {
    render(<ProfileScreen />);
    expect(screen.getByTestId('logout-btn')).toBeTruthy();
  });
});

// ── Progress Screen ───────────────────────────────────────────────────────────
import ProgressScreen from '@/app/progress';

describe('ProgressScreen', () => {
  beforeEach(() => { mockPush.mockClear(); mockBack.mockClear(); });

  it('renders without crashing', () => {
    render(<ProgressScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Progress heading', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('Progress')).toBeTruthy();
  });

  it('renders streak stat', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders total sessions stat', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('renders settings button', () => {
    render(<ProgressScreen />);
    expect(screen.getByTestId('progress-settings-btn')).toBeTruthy();
  });

  it('settings button navigates to /settings', () => {
    render(<ProgressScreen />);
    fireEvent.press(screen.getByTestId('progress-settings-btn'));
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('renders empty sessions message when no sessions', () => {
    render(<ProgressScreen />);
    expect(screen.getByText(/No sessions yet/i)).toBeTruthy();
  });
});
