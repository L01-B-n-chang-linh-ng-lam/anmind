import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

// ── Haptics mock ──────────────────────────────────────────────────────────────
const mockSelectionAsync = jest.fn(async () => undefined);
const mockImpactAsync    = jest.fn(async () => undefined);

jest.mock('expo-haptics', () => ({
  selectionAsync: (...args: unknown[]) => mockSelectionAsync(...args),
  impactAsync:    (...args: unknown[]) => mockImpactAsync(...args),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

// ── haptic.service ────────────────────────────────────────────────────────────
import { hapticService } from '@/services/haptic.service';

describe('hapticService', () => {
  beforeEach(() => {
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();
  });

  it('triggerInhale calls selectionAsync', async () => {
    await hapticService.triggerInhale();
    expect(mockSelectionAsync).toHaveBeenCalledTimes(1);
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('triggerHold calls impactAsync with Light', async () => {
    await hapticService.triggerHold();
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
    expect(mockSelectionAsync).not.toHaveBeenCalled();
  });

  it('triggerExhale calls selectionAsync', async () => {
    await hapticService.triggerExhale();
    expect(mockSelectionAsync).toHaveBeenCalledTimes(1);
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('stop does not throw', () => {
    expect(() => hapticService.stop()).not.toThrow();
  });

  it('isEnabled returns true by default', () => {
    expect(hapticService.isEnabled()).toBe(true);
  });

  it('triggerInhale silently catches haptic errors', async () => {
    mockSelectionAsync.mockRejectedValueOnce(new Error('unsupported'));
    await expect(hapticService.triggerInhale()).resolves.toBeUndefined();
  });

  it('triggerHold silently catches haptic errors', async () => {
    mockImpactAsync.mockRejectedValueOnce(new Error('unsupported'));
    await expect(hapticService.triggerHold()).resolves.toBeUndefined();
  });

  it('triggerExhale silently catches haptic errors', async () => {
    mockSelectionAsync.mockRejectedValueOnce(new Error('unsupported'));
    await expect(hapticService.triggerExhale()).resolves.toBeUndefined();
  });
});

// ── useBreathingEngine ────────────────────────────────────────────────────────
import { useBreathingEngine } from '@/hooks/useBreathingEngine';

describe('useBreathingEngine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with inhale phase', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    expect(result.current.currentPhase).toBe('inhale');
  });

  it('triggers inhale haptic on start', () => {
    renderHook(() => useBreathingEngine('Normal', true));
    expect(mockSelectionAsync).toHaveBeenCalledTimes(1);
  });

  it('transitions to hold after inhale duration', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();

    act(() => { jest.advanceTimersByTime(4000); }); // Normal inhale = 4 s

    expect(result.current.currentPhase).toBe('hold');
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('transitions to exhale after hold duration', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    mockSelectionAsync.mockClear();

    act(() => { jest.advanceTimersByTime(4000 + 2000); }); // inhale + hold

    expect(result.current.currentPhase).toBe('exhale');
    expect(mockSelectionAsync).toHaveBeenCalledTimes(1);
  });

  it('cycles back to inhale after exhale duration', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    mockSelectionAsync.mockClear();

    act(() => { jest.advanceTimersByTime(4000 + 2000 + 6000); }); // full Normal cycle

    expect(result.current.currentPhase).toBe('inhale');
  });

  it('does NOT trigger haptics when hapticEnabled is false', () => {
    renderHook(() => useBreathingEngine('Normal', false));
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();

    act(() => { jest.advanceTimersByTime(4000 + 2000 + 6000); }); // full cycle

    expect(mockSelectionAsync).not.toHaveBeenCalled();
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('stops all timers when stop() is called', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();

    act(() => { result.current.stop(); });
    act(() => { jest.advanceTimersByTime(20000); }); // advance past multiple cycles

    // No additional haptics after stop
    expect(mockSelectionAsync).not.toHaveBeenCalled();
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = renderHook(() => useBreathingEngine('Normal', true));
    mockSelectionAsync.mockClear();
    mockImpactAsync.mockClear();

    unmount();

    act(() => { jest.advanceTimersByTime(20000); });

    expect(mockSelectionAsync).not.toHaveBeenCalled();
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('exposes correct phaseDurations for Slow speed', () => {
    const { result } = renderHook(() => useBreathingEngine('Slow', true));
    expect(result.current.phaseDurations).toEqual([5000, 2000, 7000]);
  });

  it('exposes correct phaseDurations for Fast speed', () => {
    const { result } = renderHook(() => useBreathingEngine('Fast', true));
    expect(result.current.phaseDurations).toEqual([3000, 1000, 4000]);
  });

  it('restarts cleanly when start() is called again', () => {
    const { result } = renderHook(() => useBreathingEngine('Normal', true));

    act(() => { jest.advanceTimersByTime(4000); }); // into hold
    expect(result.current.currentPhase).toBe('hold');

    mockSelectionAsync.mockClear();
    act(() => { result.current.start(); });

    expect(result.current.currentPhase).toBe('inhale');
    expect(mockSelectionAsync).toHaveBeenCalledTimes(1);
  });

  it('uses Slow durations: transitions hold after 5 s inhale', () => {
    const { result } = renderHook(() => useBreathingEngine('Slow', true));
    act(() => { jest.advanceTimersByTime(5000); });
    expect(result.current.currentPhase).toBe('hold');
  });

  it('uses Fast durations: transitions hold after 3 s inhale', () => {
    const { result } = renderHook(() => useBreathingEngine('Fast', true));
    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current.currentPhase).toBe('hold');
  });
});
