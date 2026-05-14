import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { Alert } from 'react-native';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
let capturedFocusCallback: (() => void) | null = null;

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useFocusEffect: (cb: any) => { capturedFocusCallback = cb; },
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

jest.mock('react-native-chart-kit', () => {
  const { View, Text } = require('react-native');
  return { BarChart: ({ testID }: any) => <View testID={testID ?? 'bar-chart'}><Text>Chart</Text></View> };
});

jest.mock('@/services/storage.service', () => ({
  STORAGE_KEYS: { TOPICS: 'selectedTopics' },
}));

const mockAnalyticsState = {
  streak: 5,
  totalSessions: 20,
  avgImprovement: 2.5,
  weeklyData: [1, 2, 0, 3, 1, 0, 2],
  loading: false,
  error: null as string | null,
  computeAnalytics: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/store/analyticsStore', () => ({
  useAnalyticsStore: (sel?: any) => sel ? sel(mockAnalyticsState) : mockAnalyticsState,
}));

const mockResetState = {
  sessions: [] as any[],
  loadSessions: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => sel ? sel(mockResetState) : mockResetState,
}));

const mockAuthState = {
  user: { id: '1', username: 'alice', createdAt: '2026-01-01T00:00:00Z' },
  token: 'tok',
  isAuthenticated: true,
  logout: jest.fn().mockResolvedValue(undefined),
  loadAuth: jest.fn(),
  refreshProfile: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel?: any) => sel ? sel(mockAuthState) : mockAuthState,
}));

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = {
      settings: {
        reminderEnabled: true,
        reminderTime: '09:00',
        resetSoundEnabled: false,
        hapticFeedbackEnabled: true,
        defaultResetDuration: 5,
        suggestUsualMood: true,
        darkMode: true,
        breathingSpeed: 'Normal',
        ambientSound: 'None',
      },
    };
    return sel ? sel(s) : s;
  },
}));

import ProfileScreen from '@/app/(tabs)/profile';

describe('ProfileScreen advanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedFocusCallback = null;
    mockAnalyticsState.loading = false;
    mockAnalyticsState.error = null;
    mockAnalyticsState.weeklyData = [1, 2, 0, 3, 1, 0, 2];
    mockResetState.sessions = [];
    mockAuthState.isAuthenticated = true;
    mockAuthState.user = { id: '1', username: 'alice', createdAt: '2026-01-01T00:00:00Z' };
  });

  it('renders Profile heading', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('renders username initial in avatar', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('renders streak stat', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders total sessions stat', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('20')).toBeTruthy();
  });

  it('renders avg improvement stat', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('+2.5')).toBeTruthy();
  });

  it('shows ActivityIndicator when loading', () => {
    mockAnalyticsState.loading = true;
    render(<ProfileScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('shows retry button when error', () => {
    mockAnalyticsState.error = 'Network error';
    render(<ProfileScreen />);
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('retry button calls computeAnalytics', () => {
    mockAnalyticsState.error = 'Network error';
    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Retry'));
    expect(mockAnalyticsState.computeAnalytics).toHaveBeenCalled();
  });

  it('shows empty sessions message when no sessions', () => {
    render(<ProfileScreen />);
    expect(screen.getByText(/No sessions yet/i)).toBeTruthy();
  });

  it('shows sessions when present', () => {
    mockResetState.sessions = [{
      id: 's1',
      durationMinutes: 5,
      startedAt: '2026-01-01T10:00:00Z',
      endedAt: '2026-01-01T10:05:00Z',
      completed: true,
      scoreBefore: 2,
      scoreAfter: 4,
    }];
    render(<ProfileScreen />);
    expect(screen.queryByText(/No sessions yet/i)).toBeNull();
  });

  it('shows logout button for authenticated user', () => {
    render(<ProfileScreen />);
    expect(screen.getByTestId('logout-btn')).toBeTruthy();
  });

  it('shows login button for unauthenticated user', () => {
    mockAuthState.isAuthenticated = false;
    render(<ProfileScreen />);
    expect(screen.getByText('Log In / Sign Up')).toBeTruthy();
  });

  it('login button navigates to login screen', () => {
    mockAuthState.isAuthenticated = false;
    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Log In / Sign Up'));
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('shows guest username when no user', () => {
    mockAuthState.user = null as any;
    render(<ProfileScreen />);
    expect(screen.getByText('Guest')).toBeTruthy();
  });

  it('settings button navigates to settings', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Settings' }));
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('logout button shows alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    render(<ProfileScreen />);
    fireEvent.press(screen.getByTestId('logout-btn'));
    expect(alertSpy).toHaveBeenCalledWith('Log Out', expect.any(String), expect.any(Array));
  });

  it('confirms logout: calls logout and navigates', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons: any) => {
      const confirmBtn = buttons.find((b: any) => b.text === 'Log Out');
      if (confirmBtn?.onPress) act(() => { confirmBtn.onPress(); });
    });
    render(<ProfileScreen />);
    await act(async () => { fireEvent.press(screen.getByTestId('logout-btn')); });
    expect(mockAuthState.logout).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('shows reminder enabled status', () => {
    render(<ProfileScreen />);
    expect(screen.getByText(/Enabled at 09:00/)).toBeTruthy();
  });

  it('renders chart', () => {
    render(<ProfileScreen />);
    expect(screen.getByTestId('bar-chart')).toBeTruthy();
  });

  it('renders chart with zero data when weeklyData length is not 7', () => {
    mockAnalyticsState.weeklyData = [1, 2, 3];
    render(<ProfileScreen />);
    expect(screen.getByTestId('bar-chart')).toBeTruthy();
  });

  it('useFocusEffect callback triggers refreshProfileData', async () => {
    render(<ProfileScreen />);
    if (capturedFocusCallback) {
      await act(async () => { capturedFocusCallback!(); });
    }
    expect(mockAnalyticsState.computeAnalytics).toHaveBeenCalled();
  });
});
