import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export const NAV_ITEMS = [
  { label: 'Home',      icon: 'home'                  as const, active: true  },
  { label: 'Reset',     icon: 'refresh-circle-outline' as const, active: false },
  { label: 'Community', icon: 'people-outline'         as const, active: false },
  { label: 'Profile',   icon: 'person-outline'         as const, active: false },
] as const;

export const ACTION_ITEMS = [
  {
    testID: 'action-meditation',
    icon: 'tablet-portrait-outline' as const,
    title: 'Join Meditation Station',
    subtitle: 'Join 4.2k others breathing now',
  },
  {
    testID: 'action-progress',
    icon: 'stats-chart-outline' as const,
    title: 'View Progress',
    subtitle: '7-day streak continuing',
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2200 }),
        withTiming(1.0,  { duration: 2200 }),
      ),
      -1,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.root} testID="home-screen">
      {/* Ambient purple side glows */}
      <View style={[styles.ambientGlow, styles.ambientLeft]}  testID="ambient-left"  />
      <View style={[styles.ambientGlow, styles.ambientRight]} testID="ambient-right" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.topRow}>
          <View style={styles.avatar} />
          <View style={styles.header} testID="home-header">
            <Text style={styles.title}>
              How are you feeling{'\n'}right now?
            </Text>
            <Text style={styles.subtitle}>
              Take a moment to check in with yourself.
            </Text>
          </View>
        </View>

        {/* Breathing orb — tapping starts a reset */}
        <Pressable
          style={styles.orbContainer}
          testID="orb-container-pressable"
          onPress={() => router.push('/(tabs)/reset')}
          accessibilityRole="button"
          accessibilityLabel="Start Reset">
          <Animated.View style={[styles.orbGlowOuter, glowStyle]} testID="orb-glow-outer">
            <View style={styles.orbGlowInner} testID="orb-glow-inner">
              <View style={styles.orb} testID="orb">
                <Text style={styles.orbLabel}>Reset{'\n'}Now</Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>

        {/* Action cards */}
        <View style={styles.actions} testID="action-cards">
          {ACTION_ITEMS.map((item) => (
            <Pressable
              key={item.testID}
              testID={item.testID}
              style={styles.actionCard}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => {
                if (item.testID === 'action-meditation') {
                  router.push('/(tabs)/community');
                } else {
                  router.push('/(tabs)/profile');
                }
              }}>
              <View style={styles.actionIconBox}>
                <Ionicons name={item.icon} size={22} color="#8E97FD" />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  ambientGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#6B3FA0',
    opacity: 0.28,
    top: '30%',
  },
  ambientLeft: {
    left: -160,
  },
  ambientRight: {
    right: -160,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
  },
  header: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
  },
  orbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlowOuter: {
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlowInner: {
    width: 228,
    height: 228,
    borderRadius: 114,
    backgroundColor: 'rgba(124, 58, 237, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 32,
    elevation: 24,
  },
  orbLabel: {
    color: '#1C0A3E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#252B45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 3,
  },
});
