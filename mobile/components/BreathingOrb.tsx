import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { BreathingPhase } from '@/hooks/useBreathingEngine';

interface Props {
  readonly size?: number;
  readonly label?: string;
  readonly onPress?: () => void;
  /** Duration of each cycle phase in ms: [inhale, hold, exhale] */
  readonly phaseDurations?: [number, number, number];
  /**
   * When provided the parent (useBreathingEngine) drives the animation and
   * phase text. The internal self-running timer is disabled to prevent drift.
   */
  readonly currentPhase?: BreathingPhase;
}

function phaseToLabel(p: BreathingPhase): string {
  if (p === 'inhale') return 'Inhale...';
  if (p === 'hold') return 'Hold...';
  return 'Exhale...';
}

function runInternalCycle(
  phaseRef: React.RefObject<BreathingPhase>,
  setPhaseText: (t: string) => void,
  timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
  inh: number,
  hld: number,
  exh: number,
): void {
  if (phaseRef.current !== 'inhale') return;
  phaseRef.current = 'hold';
  setPhaseText('Hold...');
  timerRef.current = setTimeout(() => {
    phaseRef.current = 'exhale';
    setPhaseText('Exhale...');
    timerRef.current = setTimeout(() => {
      phaseRef.current = 'inhale';
      setPhaseText('Inhale...');
      timerRef.current = setTimeout(
        () => runInternalCycle(phaseRef, setPhaseText, timerRef, inh, hld, exh),
        inh,
      );
    }, exh);
  }, hld);
}

export default function BreathingOrb({
  size = 192,
  label,
  onPress,
  phaseDurations = [4000, 2000, 4000],
  currentPhase,
}: Props) {
  const pulseScale = useSharedValue(1);
  const [inhale, , exhale] = phaseDurations;

  // ── Externally controlled mode ────────────────────────────────────────────
  useEffect(() => {
    if (currentPhase === undefined) return;
    if (currentPhase === 'inhale') {
      pulseScale.value = withTiming(1.12, { duration: inhale });
    } else if (currentPhase === 'hold') {
      pulseScale.value = withTiming(1.12, { duration: 80 });
    } else {
      pulseScale.value = withTiming(1, { duration: exhale });
    }
  }, [currentPhase, inhale, exhale, pulseScale]);

  // ── Self-running mode (no external phase) ─────────────────────────────────
  const [internalPhaseText, setInternalPhaseText] = React.useState('Inhale...');
  const internalPhaseRef = useRef<BreathingPhase>('inhale');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null) as React.RefObject<ReturnType<typeof setTimeout> | null>;

  useEffect(() => {
    if (currentPhase !== undefined) return;

    const [inh, hld, exh] = phaseDurations;

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: inh }),
        withTiming(1.12, { duration: hld }),
        withTiming(1, { duration: exh }),
      ),
      -1,
    );

    timerRef.current = setTimeout(
      () => runInternalCycle(internalPhaseRef, setInternalPhaseText, timerRef, inh, hld, exh),
      inh,
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phaseDurations, currentPhase, pulseScale]);

  const phaseText = currentPhase ? phaseToLabel(currentPhase) : internalPhaseText;

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const outerSize = size * 1.51;
  const innerSize = size * 1.19;

  const inner = (
    <View testID="orb-container" style={styles.container}>
      <Animated.View
        testID="orb-glow-outer"
        style={[
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            backgroundColor: 'rgba(124, 58, 237, 0.35)',
            alignItems: 'center',
            justifyContent: 'center',
          },
          glowStyle,
        ]}>
        <View
          testID="orb-glow-inner"
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: 'rgba(124, 58, 237, 0.45)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            testID="orb"
            style={[
              styles.core,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}>
            {label ? (
              <Text style={styles.labelText}>{label}</Text>
            ) : (
              <Text style={styles.phaseText}>{phaseText}</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 32,
    elevation: 24,
  },
  labelText: {
    color: '#1C0A3E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  phaseText: {
    color: '#E9D5FF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
