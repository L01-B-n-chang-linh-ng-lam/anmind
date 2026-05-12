import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { STORAGE_KEYS } from '@/services/storage.service';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const settings = useSettingsStore((s) => s.settings);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.TOPICS).then((raw) => {
      if (raw) setSelectedTopics(JSON.parse(raw));
    });
  }, []);

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
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          <Text style={styles.heading}>Profile</Text>

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
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 24,
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
