import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Alert } from 'react-native';

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
  ImpactFeedbackStyle: { Light: 'light' },
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    seekTo: jest.fn().mockResolvedValue(undefined),
    volume: 1,
  })),
  useAudioPlayerStatus: jest.fn(() => ({ isLoaded: false })),
}));

const mockEngineStop = jest.fn();

// Mutable phase — lets tests change the phase per test
let mockCurrentPhase = 'inhale';
jest.mock('@/hooks/useBreathingEngine', () => ({
  useBreathingEngine: () => ({
    get currentPhase() { return mockCurrentPhase; },
    phaseDurations: [4000, 2000, 6000],
    start: jest.fn(),
    stop: mockEngineStop,
  }),
}));

jest.mock('@/services/tracking.service', () => ({
  trackResetStarted: jest.fn(),
  trackResetAbandoned: jest.fn(),
}));

jest.mock('@/components/BreathingOrb', () => {
  const { View } = require('react-native');
  return ({ testID }: any) => <View testID={testID ?? 'breathing-orb'} />;
});

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = {
      settings: {
        breathingSpeed: 'Normal',
        hapticFeedbackEnabled: true,
        resetSoundEnabled: false,
        ambientSound: 'None',
      },
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => {
    const s = {
      currentSession: { id: 'sess-1', durationMinutes: 5, scoreBefore: 2 },
    };
    return sel ? sel(s) : s;
  },
}));

import ResetInProgressScreen from '@/app/reset/in-progress';

describe('ResetInProgressScreen branches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentPhase = 'inhale';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders Inhale... for inhale phase', () => {
    mockCurrentPhase = 'inhale';
    render(<ResetInProgressScreen />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
  });

  it('renders Hold... for hold phase', () => {
    mockCurrentPhase = 'hold';
    render(<ResetInProgressScreen />);
    expect(screen.getByText('Hold...')).toBeTruthy();
  });

  it('renders Exhale... for exhale phase', () => {
    mockCurrentPhase = 'exhale';
    render(<ResetInProgressScreen />);
    expect(screen.getByText('Exhale...')).toBeTruthy();
  });

  it('close button pressing shows Alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    render(<ResetInProgressScreen />);
    fireEvent.press(screen.getByTestId('close-btn'));
    expect(alertSpy).toHaveBeenCalledWith('End Early?', expect.any(String), expect.any(Array));
    alertSpy.mockRestore();
  });

  it('confirming close calls stopEngine and router.back()', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons: any) => {
      if (!Array.isArray(buttons)) return;
      const endBtn = buttons.find((b: any) => b.text === 'End Session');
      if (endBtn?.onPress) endBtn.onPress();
    });
    render(<ResetInProgressScreen />);
    await act(async () => { fireEvent.press(screen.getByTestId('close-btn')); });
    expect(mockEngineStop).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('timer counts down and navigates on expiry', async () => {
    jest.useFakeTimers();
    render(<ResetInProgressScreen />);
    await act(async () => {
      jest.advanceTimersByTime(301 * 1000); // 5 min + 1 sec
    });
    expect(mockEngineStop).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/reset/end');
  });

  it('timer display shows formatted time', () => {
    render(<ResetInProgressScreen />);
    const timer = screen.getByTestId('timer-display');
    expect(timer.props.children).toBe('05:00');
  });

  it('renders hint text', () => {
    render(<ResetInProgressScreen />);
    expect(screen.getByText(/comfortable position/i)).toBeTruthy();
  });
});
