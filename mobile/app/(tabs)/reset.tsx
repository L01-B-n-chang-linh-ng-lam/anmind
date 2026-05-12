import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DurationSelector from '@/components/DurationSelector';
import MoodSelector from '@/components/MoodSelector';
import { useResetStore } from '@/store/resetStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { MoodLabel } from '@/types';
import { MOOD_SCORES } from '@/types';
import { generateId } from '@/utils/uuid';

export default function ResetStartScreen() {
  const router = useRouter();
  const settings = useSettingsStore((s) => s.settings);
  const setCurrentSession = useResetStore((s) => s.setCurrentSession);

  const [moodBefore, setMoodBefore] = useState<MoodLabel | null>(null);
  const [duration, setDuration] = useState<3 | 5 | 7 | 10>(
    settings.defaultResetDuration,
  );

  useEffect(() => {
    setDuration(settings.defaultResetDuration);
  }, [settings.defaultResetDuration]);

  const canStart = moodBefore !== null;

  function handleStart() {
    setCurrentSession({
      id: generateId(),
      durationMinutes: duration,
      startedAt: new Date().toISOString(),
      completed: false,
      scoreBefore: moodBefore ? MOOD_SCORES[moodBefore] : undefined,
    });
    router.push('/reset/in-progress');
  }

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <View style={[styles.ambientGlow, styles.ambientRight]} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>Quick Check-in</Text>
          <Text style={styles.sub}>How are you feeling right now?</Text>

          <View style={styles.section}>
            <MoodSelector selected={moodBefore} onSelect={setMoodBefore} />
          </View>

          <Text style={styles.sectionLabel}>Select Duration</Text>
          <View style={styles.section}>
            <DurationSelector
              selected={duration}
              onSelect={setDuration}
            />
          </View>

          <Pressable
            style={[styles.btn, !canStart && styles.btnDisabled]}
            onPress={handleStart}
            disabled={!canStart}
            accessibilityRole="button"
            accessibilityLabel="Start Reset"
            testID="start-reset-btn">
            <Text style={styles.btnText}>Start Reset</Text>
            <Ionicons name="arrow-forward" size={18} color="#1C0A3E" />
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.push('/(tabs)/community')}
            accessibilityRole="button"
            accessibilityLabel="Go With Others"
            testID="go-with-others-btn">
            <Ionicons name="people-outline" size={16} color="#8E97FD" />
            <Text style={styles.secondaryBtnText}>Go With Others</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  ambientGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#6B3FA0',
    opacity: 0.2,
    top: '20%',
  },
  ambientLeft:  { left: -130 },
  ambientRight: { right: -130 },
  safe:   { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 6,
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 24,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    marginBottom: 28,
  },
  btn: {
    backgroundColor: '#8E97FD',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: '#1C0A3E',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#252B45',
  },
  secondaryBtnText: {
    color: '#8E97FD',
    fontSize: 15,
    fontWeight: '600',
  },
});
