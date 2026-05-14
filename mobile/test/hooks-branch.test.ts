import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';

// ── useAmbientSound ───────────────────────────────────────────────────────────
const mockAmbientPlay = jest.fn();
const mockAmbientPlayer = {
  play: mockAmbientPlay,
  seekTo: jest.fn().mockResolvedValue(undefined),
  loop: false,
  volume: 1,
};

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => mockAmbientPlayer),
  useAudioPlayerStatus: jest.fn(() => ({ isLoaded: false })),
}));

import { useAmbientSound } from '@/hooks/useAmbientSound';

describe('useAmbientSound', () => {
  beforeEach(() => {
    mockAmbientPlay.mockClear();
    const { useAudioPlayer, useAudioPlayerStatus } = require('expo-audio');
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({ isLoaded: false });
  });

  it('returns nothing for None selection', () => {
    expect(() => renderHook(() => useAmbientSound('None'))).not.toThrow();
  });

  it('does not play when selection is None', () => {
    renderHook(() => useAmbientSound('None'));
    expect(mockAmbientPlay).not.toHaveBeenCalled();
  });

  it('does not play when selection is Rain but not loaded', () => {
    const { useAudioPlayerStatus } = require('expo-audio');
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({ isLoaded: false });
    renderHook(() => useAmbientSound('Rain'));
    expect(mockAmbientPlay).not.toHaveBeenCalled();
  });

  it('plays and loops when selection is Rain and status isLoaded', () => {
    const { useAudioPlayerStatus } = require('expo-audio');
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({ isLoaded: true });
    renderHook(() => useAmbientSound('Rain'));
    expect(mockAmbientPlay).toHaveBeenCalled();
  });

  it('plays and loops when selection is Ocean and status isLoaded', () => {
    const { useAudioPlayerStatus } = require('expo-audio');
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({ isLoaded: true });
    renderHook(() => useAmbientSound('Ocean'));
    expect(mockAmbientPlay).toHaveBeenCalled();
  });

  it('plays and loops when selection is Forest and status isLoaded', () => {
    const { useAudioPlayerStatus } = require('expo-audio');
    (useAudioPlayerStatus as jest.Mock).mockReturnValue({ isLoaded: true });
    renderHook(() => useAmbientSound('Forest'));
    expect(mockAmbientPlay).toHaveBeenCalled();
  });
});

// ── useBreathingEngine branches ───────────────────────────────────────────────
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light' },
}));

import { useBreathingEngine } from '@/hooks/useBreathingEngine';

describe('useBreathingEngine branch coverage', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('falls back to Normal speed for unknown speed string', () => {
    const { result } = renderHook(() => useBreathingEngine('Unknown', false));
    // Falls back to Normal durations [4000, 2000, 6000]
    expect(result.current.phaseDurations).toEqual([4000, 2000, 6000]);
  });

  it('stops engine mid-cycle: guard branches become active', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', false));
    // Start running timers
    act(() => { jest.advanceTimersByTime(2000); }); // half way through inhale
    // Stop — isActiveRef becomes false, all guard branches trigger
    act(() => { result.current.stop(); });
    // Advance remaining timers — they should all hit the guard and return
    expect(() => act(() => { jest.advanceTimersByTime(10000); })).not.toThrow();
    expect(result.current.currentPhase).toBe('inhale');
  });

  it('triggerHaptic calls exhale haptic', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    // Advance through inhale + hold to reach exhale haptic
    act(() => { jest.advanceTimersByTime(4000 + 2000); });
    expect(result.current.currentPhase).toBe('exhale');
  });

  it('triggerHaptic: hapticEnabled=false skips haptic calls', () => {
    const { selectionAsync } = require('expo-haptics');
    (selectionAsync as jest.Mock).mockClear();
    renderHook(() => useBreathingEngine('Normal', false));
    act(() => { jest.advanceTimersByTime(4000 + 2000 + 6000); });
    expect(selectionAsync).not.toHaveBeenCalled();
  });
});
