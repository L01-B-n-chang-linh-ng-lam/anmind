import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush, replace: jest.fn() }),
  useLocalSearchParams: () => ({ sessionId: 'session-001' }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View> };
});

jest.mock('@/components/BreathingOrb', () => {
  const { View } = require('react-native');
  return () => <View testID="breathing-orb" />;
});

jest.mock('@/store/meditationStore', () => ({
  useMeditationStore: (sel?: any) => {
    const s = {
      sessions: [
        { id: 'session-001', title: 'Deep Breath Collective', description: 'Join thousands', startTime: new Date().toISOString(), durationMinutes: 15, participantCount: 4200, isLive: true },
      ],
      currentSession: null,
      loadSessions: jest.fn(),
      setCurrentSession: jest.fn(),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/services/meditation-room.service', () => ({
  MockMeditationRoomService: class {
    join = jest.fn().mockResolvedValue(undefined);
    leave = jest.fn().mockResolvedValue(undefined);
    toggleMute = jest.fn().mockResolvedValue(undefined);
    toggleCamera = jest.fn().mockResolvedValue(undefined);
    raiseHand = jest.fn().mockResolvedValue(undefined);
    sendReaction = jest.fn().mockResolvedValue(undefined);
    onParticipantCountChange = jest.fn().mockReturnValue(() => {});
  },
}));

import MeditationRoomScreen from '@/app/meditation-room';

describe('MeditationRoomScreen', () => {
  beforeEach(() => { mockBack.mockClear(); });

  it('renders without crashing', () => {
    render(<MeditationRoomScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders LIVE badge', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByText('LIVE')).toBeTruthy();
  });

  it('renders session title', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByText('Deep Breath Collective')).toBeTruthy();
  });

  it('renders breathing orb', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByTestId('breathing-orb')).toBeTruthy();
  });

  it('renders Leave button', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByTestId('leave-btn')).toBeTruthy();
  });

  it('Leave button calls router.back()', () => {
    render(<MeditationRoomScreen />);
    fireEvent.press(screen.getByTestId('leave-btn'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders Mute control', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByRole('button', { name: /mute/i })).toBeTruthy();
  });

  it('renders Camera control', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByRole('button', { name: /camera/i })).toBeTruthy();
  });

  it('renders Raise Hand control', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByRole('button', { name: /hand/i })).toBeTruthy();
  });

  it('renders React control', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByRole('button', { name: /react/i })).toBeTruthy();
  });

  it('shows emoji picker when React is pressed', () => {
    render(<MeditationRoomScreen />);
    fireEvent.press(screen.getByRole('button', { name: /react/i }));
    // Emoji picker shows reaction emojis
    expect(screen.getByText('🙏')).toBeTruthy();
  });

  it('renders participant avatars', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByText('AK')).toBeTruthy();
    expect(screen.getByText('JL')).toBeTruthy();
    expect(screen.getByText('MR')).toBeTruthy();
  });

  it('renders elapsed timer', () => {
    render(<MeditationRoomScreen />);
    expect(screen.getByText('00:00')).toBeTruthy();
  });
});

// ── MeditationRoomService ─────────────────────────────────────────────────────
import {
  MockMeditationRoomService,
} from '@/services/meditation-room.service';

describe('MockMeditationRoomService', () => {
  it('join resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.join('session-1')).resolves.toBeUndefined();
  });

  it('leave resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.leave()).resolves.toBeUndefined();
  });

  it('toggleMute resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.toggleMute()).resolves.toBeUndefined();
  });

  it('toggleCamera resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.toggleCamera()).resolves.toBeUndefined();
  });

  it('raiseHand resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.raiseHand()).resolves.toBeUndefined();
  });

  it('sendReaction resolves without error', async () => {
    const svc = new MockMeditationRoomService();
    await expect(svc.sendReaction('🙏')).resolves.toBeUndefined();
  });

  it('onParticipantCountChange returns a cleanup function', () => {
    const svc = new MockMeditationRoomService();
    const cleanup = svc.onParticipantCountChange(jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw
  });
});
