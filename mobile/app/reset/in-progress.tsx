import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BreathingOrb from '@/components/BreathingOrb';
import { useResetStore } from '@/store/resetStore';
import { useSettingsStore } from '@/store/settingsStore';

const SPEED_DURATIONS: Record<string, [number, number, number]> = {
  Slow:   [6000, 3000, 6000],
  Normal: [4000, 2000, 4000],
  Fast:   [2500, 1500, 2500],
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ResetInProgressScreen() {
  const router = useRouter();
  const settings = useSettingsStore((s) => s.settings);
  const currentSession = useResetStore((s) => s.currentSession);

  const totalSeconds = (currentSession?.durationMinutes ?? 5) * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const phaseDurations = SPEED_DURATIONS[settings.breathingSpeed] ?? SPEED_DURATIONS.Normal;
  const [inhale, hold, exhale] = phaseDurations;

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Breathing phase cycle
  useEffect(() => {
    const cycle = () => {
      const cur = phaseRef.current;
      if (cur === 'inhale') {
        setPhase('hold');
        if (settings.hapticFeedbackEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        return setTimeout(() => {
          setPhase('exhale');
          if (settings.hapticFeedbackEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          setTimeout(() => {
            setPhase('inhale');
            if (settings.hapticFeedbackEnabled) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            setTimeout(cycle, inhale);
          }, exhale);
        }, hold);
      }
      return undefined;
    };

    const t = setTimeout(cycle, inhale);
    return () => clearTimeout(t);
  }, [inhale, hold, exhale, settings.hapticFeedbackEnabled]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      router.replace('/reset/end');
      return;
    }
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(interval);
          router.replace('/reset/end');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleClose() {
    Alert.alert(
      'End Early?',
      'Are you sure you want to end this session early?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Session', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }

  const phaseLabel = phase === 'inhale' ? 'Inhale...' : phase === 'hold' ? 'Hold...' : 'Exhale...';

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <View style={[styles.ambientGlow, styles.ambientRight]} />

      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
            testID="close-btn">
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </Pressable>
          <View style={styles.timerPill}>
            <Ionicons name="time-outline" size={14} color="#8E97FD" />
            <Text style={styles.timerText} testID="timer-display">
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>

        {/* Orb */}
        <View style={styles.orbWrapper}>
          <BreathingOrb
            size={220}
            phaseDurations={phaseDurations}
          />
          <Text style={styles.phaseLabel} testID="phase-label">{phaseLabel}</Text>
        </View>

        {/* Footer hint */}
        <Text style={styles.hint}>
          Find a comfortable position and breathe naturally.
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  ambientGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#6B3FA0',
    opacity: 0.25,
    top: '20%',
  },
  ambientLeft:  { left: -160 },
  ambientRight: { right: -160 },
  safe: { flex: 1, paddingHorizontal: 24 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  timerText: {
    color: '#8E97FD',
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  orbWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  phaseLabel: {
    color: '#E9D5FF',
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 2,
  },
  hint: {
    color: '#4B5563',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
  },
});
