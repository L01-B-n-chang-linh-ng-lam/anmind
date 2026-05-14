import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(),
}));

import { useBreathingAudio } from '@/hooks/useBreathingAudio';

function makePlayer() {
  const seekTo = jest.fn().mockResolvedValue(undefined);
  const play = jest.fn();
  return { player: { play, seekTo, volume: 1 }, seekTo, play };
}

describe('useBreathingAudio', () => {
  let inhale: ReturnType<typeof makePlayer>;
  let exhale: ReturnType<typeof makePlayer>;

  beforeEach(() => {
    inhale = makePlayer();
    exhale = makePlayer();
    const { useAudioPlayer } = require('expo-audio');
    (useAudioPlayer as jest.Mock)
      .mockReturnValueOnce(inhale.player)
      .mockReturnValueOnce(exhale.player);
  });

  it('returns playInhale and playExhale functions', () => {
    const { result } = renderHook(() => useBreathingAudio(true));
    expect(typeof result.current.playInhale).toBe('function');
    expect(typeof result.current.playExhale).toBe('function');
  });

  it('playInhale does nothing when disabled', async () => {
    const { result } = renderHook(() => useBreathingAudio(false));
    result.current.playInhale();
    expect(inhale.seekTo).not.toHaveBeenCalled();
  });

  it('playExhale does nothing when disabled', async () => {
    const { result } = renderHook(() => useBreathingAudio(false));
    result.current.playExhale();
    expect(exhale.seekTo).not.toHaveBeenCalled();
  });

  it('playInhale calls seekTo(0) when enabled', async () => {
    const { result } = renderHook(() => useBreathingAudio(true));
    await act(async () => { result.current.playInhale(); });
    expect(inhale.seekTo).toHaveBeenCalledWith(0);
  });

  it('playExhale calls seekTo(0) when enabled', async () => {
    const { result } = renderHook(() => useBreathingAudio(true));
    await act(async () => { result.current.playExhale(); });
    expect(exhale.seekTo).toHaveBeenCalledWith(0);
  });
});

// Cover use-color-scheme.ts re-export
describe('use-color-scheme re-export', () => {
  it('exports useColorScheme', () => {
    const mod = require('@/hooks/use-color-scheme');
    expect(typeof mod.useColorScheme).toBe('function');
  });
});
