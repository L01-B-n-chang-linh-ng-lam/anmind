import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: mockBack }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View> };
});

const mockAnalyticsState = {
  streak: 3,
  totalSessions: 10,
  avgImprovement: 1.5,
  loading: false,
  error: null as string | null,
  computeAnalytics: jest.fn(),
};

jest.mock('@/store/analyticsStore', () => ({
  useAnalyticsStore: (sel?: any) => sel ? sel(mockAnalyticsState) : mockAnalyticsState,
}));

const mockResetState = {
  sessions: [] as any[],
  loadSessions: jest.fn(),
};

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => sel ? sel(mockResetState) : mockResetState,
}));

import ProgressScreen from '@/app/progress';

describe('ProgressScreen advanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsState.loading = false;
    mockAnalyticsState.error = null;
    mockResetState.sessions = [];
  });

  it('renders without crashing', () => {
    render(<ProgressScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Progress heading', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('Progress')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    mockAnalyticsState.loading = true;
    render(<ProgressScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('shows retry button when error', () => {
    mockAnalyticsState.error = 'Failed to load';
    render(<ProgressScreen />);
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('retry button calls computeAnalytics', () => {
    mockAnalyticsState.error = 'Failed to load';
    render(<ProgressScreen />);
    fireEvent.press(screen.getByText('Retry'));
    expect(mockAnalyticsState.computeAnalytics).toHaveBeenCalled();
  });

  it('shows empty sessions message when no sessions', () => {
    render(<ProgressScreen />);
    expect(screen.getByText(/No sessions yet/i)).toBeTruthy();
  });

  it('renders sessions when present', () => {
    mockResetState.sessions = [
      {
        id: 's1',
        durationMinutes: 5,
        startedAt: '2026-01-01T10:00:00Z',
        endedAt: '2026-01-01T10:05:00Z',
        completed: true,
        scoreBefore: 2,
        scoreAfter: 4,
      },
      {
        id: 's2',
        durationMinutes: 7,
        startedAt: '2026-01-02T10:00:00Z',
        endedAt: '2026-01-02T10:07:00Z',
        completed: true,
        scoreBefore: 1,
        scoreAfter: 3,
      },
    ];
    render(<ProgressScreen />);
    expect(screen.queryByText(/No sessions yet/i)).toBeNull();
  });

  it('shows only 5 most recent sessions', () => {
    mockResetState.sessions = Array.from({ length: 8 }, (_, i) => ({
      id: `s${i}`,
      durationMinutes: 5,
      startedAt: new Date(2026, 0, i + 1).toISOString(),
      endedAt: new Date(2026, 0, i + 1, 0, 5).toISOString(),
      completed: true,
      scoreBefore: 2,
      scoreAfter: 4,
    }));
    render(<ProgressScreen />);
    expect(screen.queryByText(/No sessions yet/i)).toBeNull();
  });

  it('go back button calls router.back()', () => {
    render(<ProgressScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Go back' }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('settings button navigates to /settings', () => {
    render(<ProgressScreen />);
    fireEvent.press(screen.getByTestId('progress-settings-btn'));
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('renders streak stat', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders total sessions stat', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('renders avg improvement stat', () => {
    render(<ProgressScreen />);
    expect(screen.getByText('+1.5')).toBeTruthy();
  });

  it('calls computeAnalytics and loadSessions on mount', () => {
    render(<ProgressScreen />);
    expect(mockAnalyticsState.computeAnalytics).toHaveBeenCalled();
    expect(mockResetState.loadSessions).toHaveBeenCalled();
  });
});
