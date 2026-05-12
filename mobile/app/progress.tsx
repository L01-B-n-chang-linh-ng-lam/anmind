import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SessionCard from '@/components/SessionCard';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useResetStore } from '@/store/resetStore';

export default function ProgressScreen() {
  const router = useRouter();

  const { streak, totalSessions, avgImprovement, computeAnalytics } = useAnalyticsStore();
  const sessions = useResetStore((s) => s.sessions);

  useEffect(() => {
    computeAnalytics();
  }, []);

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <View style={styles.ambientGlow} />
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color="#9CA3AF" />
            </Pressable>
            <Text style={styles.heading}>Progress</Text>
            <Pressable
              onPress={() => router.push('/settings')}
              style={styles.settingsBtn}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              testID="progress-settings-btn">
              <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🧘</Text>
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statValue}>+{avgImprovement.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Mood</Text>
            </View>
          </View>

          {/* Recent sessions */}
          <Text style={styles.sectionLabel}>Recent Sessions</Text>
          {recentSessions.length === 0 ? (
            <Text style={styles.emptyText}>No sessions yet. Start your first reset!</Text>
          ) : (
            recentSessions.map((s) => <SessionCard key={s.id} session={s} />)
          )}
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
    opacity: 0.15,
    top: 0,
    left: -130,
  },
  safe:   { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 28,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1F35',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statIcon:  { fontSize: 22 },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#9CA3AF', fontSize: 11, textAlign: 'center' },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
});
