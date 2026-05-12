import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import SessionCard from '@/components/SessionCard';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useResetStore } from '@/store/resetStore';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CHART_CONFIG = {
  backgroundColor: '#1A1F35',
  backgroundGradientFrom: '#1A1F35',
  backgroundGradientTo: '#1A1F35',
  decimalPlaces: 0,
  color: () => '#8E97FD',
  labelColor: () => '#9CA3AF',
  barPercentage: 0.6,
  propsForBackgroundLines: { stroke: '#252B45' },
};

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const chartWidth = width - 48;

  const { streak, totalSessions, avgImprovement, weeklyData, computeAnalytics } =
    useAnalyticsStore();
  const sessions = useResetStore((s) => s.sessions);

  useEffect(() => {
    computeAnalytics();
  }, []);

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={recentSessions}
          keyExtractor={(s) => s.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.headerRow}>
                <Pressable
                  onPress={() => router.back()}
                  style={styles.backBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Back">
                  <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
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

              {/* Stat cards */}
              <View style={styles.statsRow}>
                <StatCard icon="🔥" value={`${streak}`} label="Day Streak" />
                <StatCard icon="🧘" value={`${totalSessions}`} label="Sessions" />
                <StatCard
                  icon="📈"
                  value={`+${avgImprovement.toFixed(1)}`}
                  label="Avg Mood"
                />
              </View>

              {/* Weekly chart */}
              <Text style={styles.sectionLabel}>This Week</Text>
              <View style={styles.chartCard}>
                <BarChart
                  data={{
                    labels: DAY_LABELS,
                    datasets: [{ data: weeklyData.length === 7 ? weeklyData : [0,0,0,0,0,0,0] }],
                  }}
                  width={chartWidth}
                  height={160}
                  chartConfig={CHART_CONFIG}
                  style={styles.chart}
                  showValuesOnTopOfBars
                  fromZero
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              </View>

              <Text style={styles.sectionLabel}>Recent Sessions</Text>
            </View>
          }
          renderItem={({ item }) => <SessionCard session={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No sessions yet. Start your first reset!
            </Text>
          }
        />
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
    top: '10%',
    left: -130,
  },
  safe:   { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
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
  chartCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 28,
  },
  chart: { borderRadius: 16 },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});
