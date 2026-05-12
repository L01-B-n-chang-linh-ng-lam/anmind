import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import SessionCard from '@/components/SessionCard';
import { STORAGE_KEYS } from '@/services/storage.service';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useAuthStore } from '@/store/authStore';
import { useResetStore } from '@/store/resetStore';
import { useSettingsStore } from '@/store/settingsStore';

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

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const chartWidth = width - 48;

  const { user, isAuthenticated, logout } = useAuthStore();
  const settings = useSettingsStore((s) => s.settings);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { streak, totalSessions, avgImprovement, weeklyData, computeAnalytics } =
    useAnalyticsStore();
  const sessions = useResetStore((s) => s.sessions);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.TOPICS).then((raw) => {
      if (raw) setSelectedTopics(JSON.parse(raw));
    });
    computeAnalytics();
  }, []);

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5);

  async function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  }

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <View style={styles.root}>
      <View style={styles.ambientGlow} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>Profile</Text>
            <Pressable
              onPress={() => router.push('/settings')}
              style={styles.settingsBtn}
              accessibilityRole="button"
              accessibilityLabel="Settings">
              <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* Avatar + name */}
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {(user?.username ?? 'G')[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.username}>{user?.username ?? 'Guest'}</Text>
              <Text style={styles.joinedDate}>Joined {joinedDate}</Text>
            </View>
          </View>

          {/* Topics */}
          {selectedTopics.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>My Focus Areas</Text>
              <View style={styles.topicsRow}>
                {selectedTopics.map((t) => (
                  <View key={t} style={styles.topicChip}>
                    <Text style={styles.topicChipText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Progress stats */}
          <Text style={styles.sectionLabel}>Your Progress</Text>
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
          {recentSessions.length === 0 ? (
            <Text style={styles.emptyText}>No sessions yet. Start your first reset!</Text>
          ) : (
            recentSessions.map((s) => <SessionCard key={s.id} session={s} />)
          )}

          {/* Reminder summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Reminder</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name={settings.reminderEnabled ? 'notifications' : 'notifications-off-outline'}
                size={18}
                color={settings.reminderEnabled ? '#8E97FD' : '#9CA3AF'}
              />
              <Text style={styles.infoText}>
                {settings.reminderEnabled
                  ? `Enabled at ${settings.reminderTime}`
                  : 'Disabled'}
              </Text>
            </View>
          </View>

          {/* Auth status */}
          {!isAuthenticated && (
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push('/auth/login')}
              accessibilityRole="button">
              <Text style={styles.loginBtnText}>Log In / Sign Up</Text>
            </Pressable>
          )}

          {isAuthenticated && (
            <Pressable
              style={styles.logoutBtn}
              onPress={handleLogout}
              accessibilityRole="button"
              testID="logout-btn">
              <Ionicons name="log-out-outline" size={18} color="#F87171" />
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </Pressable>
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
    marginBottom: 24,
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#252B45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#8E97FD',
    fontSize: 24,
    fontWeight: '700',
  },
  username:   { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  joinedDate: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  topicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    backgroundColor: 'rgba(142, 151, 253, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#8E97FD',
  },
  topicChipText: { color: '#8E97FD', fontSize: 13, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: '#FFFFFF', fontSize: 14 },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    marginTop: 4,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
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
  chartCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  chart: { borderRadius: 16 },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  loginBtn: {
    backgroundColor: '#8E97FD',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: { color: '#1C0A3E', fontSize: 15, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 113, 113, 0.4)',
    marginTop: 8,
  },
  logoutBtnText: { color: '#F87171', fontSize: 15, fontWeight: '600' },
});
