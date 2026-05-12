import { useCallback, useEffect, useRef, useState } from 'react';
import { hapticService } from '@/services/haptic.service';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export const BREATHING_SPEED_DURATIONS: Record<string, [number, number, number]> = {
  Slow:   [5000, 2000, 7000],
  Normal: [4000, 2000, 6000],
  Fast:   [3000, 1000, 4000],
};

export interface BreathingEngineResult {
  currentPhase: BreathingPhase;
  progress: number;
  phaseDurations: [number, number, number];
  start: () => void;
  stop: () => void;
}

export function useBreathingEngine(
  speed: string = 'Normal',
  hapticEnabled: boolean = true,
): BreathingEngineResult {
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [progress, setProgress] = useState(0);

  const phaseDurations = BREATHING_SPEED_DURATIONS[speed] ?? BREATHING_SPEED_DURATIONS.Normal;
  const [inhale, hold, exhale] = phaseDurations;

  // Refs let timers read the latest values without stale closures
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isActiveRef = useRef(false);
  const hapticEnabledRef = useRef(hapticEnabled);
  const inhaleRef = useRef(inhale);
  const holdRef = useRef(hold);
  const exhaleRef = useRef(exhale);

  hapticEnabledRef.current = hapticEnabled;
  inhaleRef.current = inhale;
  holdRef.current = hold;
  exhaleRef.current = exhale;

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  }, []);

  const triggerHaptic = useCallback((phase: BreathingPhase) => {
    if (!hapticEnabledRef.current) return;
    if (phase === 'inhale') hapticService.triggerInhale();
    else if (phase === 'hold') hapticService.triggerHold();
    else hapticService.triggerExhale();
  }, []);

  // cycleRef lets the recursive cycle call itself without stale closure captures
  const cycleRef = useRef<() => void>(() => {});

  cycleRef.current = () => {
    if (!isActiveRef.current) return;

    addTimer(() => {
      if (!isActiveRef.current) return;
      setCurrentPhase('hold');
      setProgress(0);
      triggerHaptic('hold');

      addTimer(() => {
        if (!isActiveRef.current) return;
        setCurrentPhase('exhale');
        setProgress(0);
        triggerHaptic('exhale');

        addTimer(() => {
          if (!isActiveRef.current) return;
          setCurrentPhase('inhale');
          setProgress(0);
          triggerHaptic('inhale');
          cycleRef.current();
        }, exhaleRef.current);
      }, holdRef.current);
    }, inhaleRef.current);
  };

  const start = useCallback(() => {
    clearAllTimers();
    isActiveRef.current = true;
    setCurrentPhase('inhale');
    setProgress(0);
    triggerHaptic('inhale');
    cycleRef.current();
  }, [clearAllTimers, triggerHaptic]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    clearAllTimers();
    hapticService.stop();
  }, [clearAllTimers]);

  // Auto-start; restart when speed or haptic preference changes
  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inhale, hold, exhale, hapticEnabled]);

  return { currentPhase, progress, phaseDurations, start, stop };
}
