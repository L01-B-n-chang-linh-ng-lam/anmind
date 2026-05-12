import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeditationStore } from '@/store/meditationStore';
import type { MeditationSession } from '@/types';

function LiveSessionCard({ session }: { session: MeditationSession }) {
  const router = useRouter();
  const minutesLeft = session.durationMinutes;

  return (
    <View style={styles.liveCard}>
      <View style={styles.liveCardOverlay} />
      <View style={styles.liveCardContent}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>Live Now</Text>
        </View>
        <Text style={styles.liveTitle}>{session.title}</Text>
        <View style={styles.liveRow}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text style={styles.liveDetail}>{minutesLeft} Minutes Left</Text>
        </View>
        <View style={styles.liveRow}>
          <Ionicons name="people-outline" size={14} color="#8E97FD" />
          <Text style={styles.liveParticipants}>
            Live: {session.participantCount.toLocaleString()} participants
          </Text>
        </View>
      </View>
      <Pressable
        style={styles.joinBtn}
        onPress={() =>
          router.push({
            pathname: '/meditation-room',
            params: { sessionId: session.id },
          })
        }
        accessibilityRole="button"
        accessibilityLabel="Join Session">
        <Text style={styles.joinBtnText}>Join Session</Text>
        <Ionicons name="arrow-forward" size={16} color="#1C0A3E" />
      </Pressable>
    </View>
  );
}

function UpcomingCard({ session }: { session: MeditationSession }) {
  const time = new Date(session.startTime);
  const timeStr = `${time.getUTCHours().toString().padStart(2, '0')}:${time
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')} GMT`;

  return (
    <View style={styles.upcomingCard}>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{timeStr}</Text>
      </View>
      <View style={styles.upcomingDivider} />
      <View style={styles.upcomingInfo}>
        <Text style={styles.upcomingTitle}>{session.title}</Text>
        <Text style={styles.upcomingDetail}>
          {session.durationMinutes} Minutes • {session.description}
        </Text>
      </View>
      <Pressable
        style={styles.alertBtn}
        accessibilityRole="button"
        accessibilityLabel="Set Alert">
        <Ionicons name="notifications-outline" size={14} color="#8E97FD" />
        <Text style={styles.alertBtnText}>Set Alert</Text>
      </Pressable>
    </View>
  );
}

export default function CommunityScreen() {
  const { sessions, loadSessions } = useMeditationStore();

  useEffect(() => {
    loadSessions();
  }, []);

  const liveSession = sessions.find((s) => s.isLive);
  const upcomingSessions = sessions.filter((s) => !s.isLive);

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <View style={[styles.ambientGlow, styles.ambientRight]} />

      <SafeAreaView style={styles.safe}>
        <FlatList
          data={upcomingSessions}
          keyExtractor={(s) => s.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          ListHeaderComponent={
            <View>
              <Text style={styles.heading}>The Station</Text>
              <Text style={styles.sub}>
                Synchronized silence. Join the collective pulse.
              </Text>

              <View style={styles.liveIndicatorRow}>
                <View style={styles.liveDotSmall} />
                <Text style={styles.liveIndicatorText}>
                  Broadcasting Live From The Sanctuary
                </Text>
              </View>

              {liveSession && <LiveSessionCard session={liveSession} />}

              <Text style={styles.sectionLabel}>Upcoming Sessions</Text>
            </View>
          }
          renderItem={({ item }) => <UpcomingCard session={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No upcoming sessions.</Text>
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
    opacity: 0.2,
    top: '25%',
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
  sub: { color: '#9CA3AF', fontSize: 13, marginBottom: 16, lineHeight: 20 },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  liveDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveIndicatorText: { color: '#9CA3AF', fontSize: 12 },
  liveCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  liveCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(142, 151, 253, 0.06)',
    borderRadius: 20,
  },
  liveCardContent: { marginBottom: 16 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveBadgeText: { color: '#EF4444', fontSize: 11, fontWeight: '700' },
  liveTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 30,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  liveDetail:       { color: '#9CA3AF', fontSize: 13 },
  liveParticipants: { color: '#8E97FD', fontSize: 13, fontWeight: '600' },
  joinBtn: {
    backgroundColor: '#8E97FD',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  joinBtnText: { color: '#1C0A3E', fontSize: 15, fontWeight: '700' },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  upcomingCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  timeBox: {
    backgroundColor: '#252B45',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  timeText: { color: '#8E97FD', fontSize: 14, fontWeight: '700' },
  upcomingDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: '#252B45',
  },
  upcomingInfo: { flex: 1 },
  upcomingTitle:  { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  upcomingDetail: { color: '#9CA3AF', fontSize: 12, lineHeight: 18 },
  alertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#252B45',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  alertBtnText: { color: '#8E97FD', fontSize: 12, fontWeight: '600' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 20 },
});
