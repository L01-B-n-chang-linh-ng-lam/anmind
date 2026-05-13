import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MoodSelector from '@/components/MoodSelector';
import SatisfactionSurvey from '@/components/SatisfactionSurvey';
import { trackResetCompleted } from '@/services/tracking.service';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useAuthStore } from '@/store/authStore';
import { useResetStore } from '@/store/resetStore';
import type { MoodLabel, ResetSession } from '@/types';
import { MOOD_SCORES } from '@/types';
import { generateId } from '@/utils/uuid';

export default function ResetEndScreen() {
  const router = useRouter();
  const { currentSession, addSession } = useResetStore();
  const [moodAfter, setMoodAfter] = useState<MoodLabel | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canEnd = moodAfter !== null;

  async function handleEnd() {
    if (loading) return;
    setLoading(true);
    setError('');
    const session: ResetSession = {
      id: currentSession?.id ?? generateId(),
      externalId: currentSession?.externalId ?? currentSession?.id ?? generateId(),
      durationMinutes: currentSession?.durationMinutes ?? 5,
      startedAt: currentSession?.startedAt ?? new Date().toISOString(),
      endedAt: new Date().toISOString(),
      completed: true,
      scoreBefore: currentSession?.scoreBefore,
      scoreAfter: moodAfter ? MOOD_SCORES[moodAfter] : undefined,
    };
    try {
      await addSession(session);
      await useAnalyticsStore.getState().computeAnalytics(useAuthStore.getState().isAuthenticated);
      trackResetCompleted(session.durationMinutes, session.scoreBefore, session.scoreAfter);
      const completedCount = useResetStore.getState().sessions.filter((s) => s.completed).length;
      if (completedCount % 5 === 0) {
        setShowSurvey(true);
      } else {
        router.replace('/(tabs)/profile');
      }
    } catch {
      setError('Unable to save this reset. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const improvement =
    currentSession?.scoreBefore != null && moodAfter != null
      ? MOOD_SCORES[moodAfter] - currentSession.scoreBefore
      : null;

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientTop]} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>

          {/* Success badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={40} color="#34D399" />
            </View>
          </View>

          <Text style={styles.heading}>You are back{'\n'}in control.</Text>
          <Text style={styles.sub}>
            Take a deep breath and settle back in.
          </Text>

          {/* Improvement preview */}
          {improvement != null && (
            <View style={styles.improvementCard}>
              <Text style={styles.improvementLabel}>Mood change</Text>
              <Text
                style={[
                  styles.improvementValue,
                  improvement >= 0 ? styles.positive : styles.negative,
                ]}>
                {improvement >= 0 ? '+' : ''}{improvement} point{Math.abs(improvement) !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>How do you feel now?</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.moodSection}>
            <MoodSelector selected={moodAfter} onSelect={setMoodAfter} />
          </View>

          <Pressable
            style={[styles.btn, (!canEnd || loading) && styles.btnDisabled]}
            onPress={handleEnd}
            disabled={!canEnd || loading}
            accessibilityRole="button"
            accessibilityLabel="End Reset"
            testID="end-reset-btn">
            <Text style={styles.btnText}>{loading ? 'Saving...' : 'End Reset'}</Text>
            <Ionicons name="checkmark" size={18} color="#1C0A3E" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      <SatisfactionSurvey
        visible={showSurvey}
        onClose={() => {
          setShowSurvey(false);
          router.replace('/(tabs)/profile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#34D399',
    opacity: 0.06,
  },
  ambientTop: { top: -100, alignSelf: 'center', left: '10%' },
  safe:   { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  badgeContainer: { alignItems: 'center', marginTop: 32, marginBottom: 24 },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 10,
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  improvementCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  improvementLabel: { color: '#9CA3AF', fontSize: 14 },
  improvementValue: { fontSize: 20, fontWeight: '700' },
  positive: { color: '#34D399' },
  negative: { color: '#F87171' },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  moodSection: { marginBottom: 28 },
  error: { color: '#F87171', fontSize: 13, marginBottom: 12 },
  btn: {
    backgroundColor: '#8E97FD',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#1C0A3E', fontSize: 16, fontWeight: '700' },
});
