import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View> };
});

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ play: jest.fn(), seekTo: jest.fn().mockResolvedValue(undefined), volume: 1 }),
  useAudioPlayerStatus: () => ({}),
}));

jest.mock('@/hooks/useBreathingEngine', () => ({
  useBreathingEngine: () => ({
    currentPhase: 'inhale',
    progress: 0,
    phaseDurations: [4000, 2000, 6000],
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

jest.mock('react-native-get-random-values', () => {});
jest.mock('uuid', () => ({ v4: () => 'test-reset-uuid' }));

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => {
    const s = {
      sessions: [],
      currentSession: { id: 'test-reset-uuid', durationMinutes: 5, startedAt: '2026-01-01T10:00:00Z', scoreBefore: 2 },
      setCurrentSession: jest.fn(),
      updateCurrentSession: jest.fn(),
      addSession: jest.fn().mockResolvedValue(undefined),
      loadSessions: jest.fn(),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = {
      settings: { resetSoundEnabled: false, hapticFeedbackEnabled: true, reminderEnabled: false, reminderTime: '08:00', defaultResetDuration: 5, suggestUsualMood: true, darkMode: true, breathingSpeed: 'Normal', ambientSound: 'None' },
      loadSettings: jest.fn(), updateSetting: jest.fn(),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/components/BreathingOrb', () => {
  const { View } = require('react-native');
  return ({ testID }: any) => <View testID={testID ?? 'breathing-orb'} />;
});

// ── Reset End Screen ──────────────────────────────────────────────────────────
import ResetEndScreen from '@/app/reset/end';

describe('ResetEndScreen', () => {
  beforeEach(() => { mockReplace.mockClear(); });

  it('renders without crashing', () => {
    render(<ResetEndScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders completion heading', () => {
    render(<ResetEndScreen />);
    expect(screen.getByText(/You are back/i)).toBeTruthy();
  });

  it('renders mood selector', () => {
    render(<ResetEndScreen />);
    expect(screen.getByTestId('mood-calm')).toBeTruthy();
  });

  it('renders End Reset button', () => {
    render(<ResetEndScreen />);
    expect(screen.getByTestId('end-reset-btn')).toBeTruthy();
  });

  it('End Reset button is disabled when no mood selected', () => {
    render(<ResetEndScreen />);
    const btn = screen.getByTestId('end-reset-btn');
    expect(btn.props.accessibilityState?.disabled).toBeTruthy();
  });

  it('shows improvement card when scoreBefore is set', () => {
    render(<ResetEndScreen />);
    // Select a mood after
    fireEvent.press(screen.getByTestId('mood-calm')); // score 5, before=2, improvement=+3
    expect(screen.getByText(/Mood change/i)).toBeTruthy();
  });

  it('End Reset button enabled after mood selection', () => {
    render(<ResetEndScreen />);
    fireEvent.press(screen.getByTestId('mood-calm'));
    const btn = screen.getByTestId('end-reset-btn');
    expect(btn.props.accessibilityState?.disabled).toBeFalsy();
  });
});

// ── Reset In Progress Screen ──────────────────────────────────────────────────
import ResetInProgressScreen from '@/app/reset/in-progress';

describe('ResetInProgressScreen', () => {
  beforeEach(() => { mockBack.mockClear(); mockReplace.mockClear(); });

  it('renders without crashing', () => {
    render(<ResetInProgressScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders close button', () => {
    render(<ResetInProgressScreen />);
    expect(screen.getByTestId('close-btn')).toBeTruthy();
  });

  it('renders timer display', () => {
    render(<ResetInProgressScreen />);
    expect(screen.getByTestId('timer-display')).toBeTruthy();
  });

  it('timer shows correct initial value for 5 min session', () => {
    render(<ResetInProgressScreen />);
    const timer = screen.getByTestId('timer-display');
    expect(timer.props.children).toBe('05:00');
  });

  it('renders phase label', () => {
    render(<ResetInProgressScreen />);
    expect(screen.getByTestId('phase-label')).toBeTruthy();
  });

  it('renders Inhale as initial phase', () => {
    render(<ResetInProgressScreen />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
  });
});
