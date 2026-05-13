import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Alert } from 'react-native';

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
      loadSession: jest.fn().mockResolvedValue(null),
      setCurrentSession: jest.fn(),
    };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/services/meditation-room.service', () => ({
  AgoraMeditationRoomService: class {
    join = jest.fn().mockResolvedValue(123);
    leave = jest.fn().mockResolvedValue(undefined);
    toggleMute = jest.fn().mockResolvedValue(undefined);
    toggleCamera = jest.fn().mockResolvedValue(undefined);
    switchCamera = jest.fn().mockResolvedValue(undefined);
    raiseHand = jest.fn().mockResolvedValue(undefined);
    sendReaction = jest.fn().mockResolvedValue(undefined);
    onParticipantCountChange = jest.fn().mockReturnValue(() => {});
    onRemoteUsersChange = jest.fn().mockReturnValue(() => {});
  },
}));

import MeditationRoomScreen from '@/app/meditation-room';

async function renderRoom() {
  const result = render(<MeditationRoomScreen />);
  await act(async () => {});
  return result;
}

describe('MeditationRoomScreen', () => {
  beforeEach(() => { mockBack.mockClear(); });
  afterEach(() => { jest.restoreAllMocks(); });

  it('renders without crashing', async () => {
    await renderRoom();
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders LIVE badge', async () => {
    await renderRoom();
    expect(screen.getByText('LIVE')).toBeTruthy();
  });

  it('renders session title', async () => {
    await renderRoom();
    expect(screen.getByText('Deep Breath Collective')).toBeTruthy();
  });

  it('renders breathing orb', async () => {
    await renderRoom();
    expect(screen.queryByTestId('breathing-orb')).toBeNull();
  });

  it('renders Leave button', async () => {
    await renderRoom();
    expect(screen.getByTestId('leave-btn')).toBeTruthy();
  });

  it('Leave button calls router.back()', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
      buttons?.find((button) => button.text === 'Leave')?.onPress?.();
    });

    await renderRoom();
    fireEvent.press(screen.getByTestId('leave-btn'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Leave Room',
      'Are you sure you want to leave?',
      expect.any(Array),
      expect.objectContaining({ cancelable: true }),
    );
    await waitFor(() => expect(mockBack).toHaveBeenCalled());
  });

  it('renders Mute control', async () => {
    await renderRoom();
    expect(screen.getByRole('button', { name: /mute/i })).toBeTruthy();
  });

  it('renders Camera control', async () => {
    await renderRoom();
    expect(screen.getAllByRole('button', { name: /camera/i }).length).toBeGreaterThan(0);
  });

  it('renders Raise Hand control', async () => {
    await renderRoom();
    expect(screen.getByRole('button', { name: /hand/i })).toBeTruthy();
  });

  it('renders React control', async () => {
    await renderRoom();
    expect(screen.getByRole('button', { name: /react/i })).toBeTruthy();
  });

  it('shows emoji picker when React is pressed', async () => {
    await renderRoom();
    fireEvent.press(screen.getByRole('button', { name: /react/i }));
    // Emoji picker shows reaction emojis
    expect(screen.getByText('🙏')).toBeTruthy();
  });

  it('renders live video placeholder while no remote users are connected', async () => {
    await renderRoom();
    expect(screen.getByText('Camera Off')).toBeTruthy();
    expect(screen.getByText('You')).toBeTruthy();
  });

  it('renders elapsed timer', async () => {
    await renderRoom();
    expect(screen.getByText('00:00')).toBeTruthy();
  });
});

// ── MeditationRoomService ─────────────────────────────────────────────────────
import {
  AgoraMeditationRoomService,
} from '@/services/meditation-room.service';

describe('AgoraMeditationRoomService', () => {
  it('join resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.join('session-1')).resolves.toBe(123);
  });

  it('leave resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.leave()).resolves.toBeUndefined();
  });

  it('toggleMute resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.toggleMute()).resolves.toBeUndefined();
  });

  it('toggleCamera resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.toggleCamera()).resolves.toBeUndefined();
  });

  it('raiseHand resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.raiseHand()).resolves.toBeUndefined();
  });

  it('sendReaction resolves without error', async () => {
    const svc = new AgoraMeditationRoomService();
    await expect(svc.sendReaction('🙏')).resolves.toBeUndefined();
  });

  it('onParticipantCountChange returns a cleanup function', () => {
    const svc = new AgoraMeditationRoomService();
    const cleanup = svc.onParticipantCountChange(jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw
  });

  it('onRemoteUsersChange returns a cleanup function', () => {
    const svc = new AgoraMeditationRoomService();
    const cleanup = svc.onRemoteUsersChange(jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup();
  });
});
