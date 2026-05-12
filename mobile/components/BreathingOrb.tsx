import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  size?: number;
  label?: string;
  onPress?: () => void;
  /** Duration of each cycle phase in ms: [inhale, hold, exhale] */
  phaseDurations?: [number, number, number];
}

export default function BreathingOrb({
  size = 192,
  label,
  onPress,
  phaseDurations = [4000, 2000, 4000],
}: Props) {
  const pulseScale = useSharedValue(1);
  const [phaseText, setPhaseText] = React.useState('Inhale...');
  const phaseRef = useRef<'inhale' | 'hold' | 'exhale'>('inhale');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inhale, hold, exhale] = phaseDurations;

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: inhale }),
        withTiming(1.12, { duration: hold }),
        withTiming(1.0, { duration: exhale }),
      ),
      -1,
    );

    const cycle = () => {
      if (phaseRef.current === 'inhale') {
        phaseRef.current = 'hold';
        setPhaseText('Hold...');
        timerRef.current = setTimeout(() => {
          phaseRef.current = 'exhale';
          setPhaseText('Exhale...');
          timerRef.current = setTimeout(() => {
            phaseRef.current = 'inhale';
            setPhaseText('Inhale...');
            timerRef.current = setTimeout(cycle, inhale);
          }, exhale);
        }, hold);
      }
    };

    timerRef.current = setTimeout(cycle, inhale);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inhale, hold, exhale]);

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
