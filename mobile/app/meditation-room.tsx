import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BreathingOrb from '@/components/BreathingOrb';
import {
  MockMeditationRoomService,
  type MeditationRoomService,
} from '@/services/meditation-room.service';
import { trackMeditationSessionJoined } from '@/services/tracking.service';
import { useMeditationStore } from '@/store/meditationStore';

const REACTION_EMOJIS = ['🙏', '❤️', '✨', '🌊', '🌿'];

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

function ReactionBubble({ emoji, x }: { emoji: string; x: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-180, { duration: 2000 });
    opacity.value = withTiming(0, { duration: 2000 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.reactionBubble, { left: x }, style]}>
      <Text style={styles.reactionEmoji}>{emoji}</Text>
    </Animated.View>
  );
}

const MOCK_AVATARS = [
  { initials: 'AK', color: '#8B5CF6' },
  { initials: 'JL', color: '#06B6D4' },
  { initials: 'MR', color: '#F59E0B' },
];

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MeditationRoomScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions, loadSessions } = useMeditationStore();

  const [participantCount, setParticipantCount] = useState(4200);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const serviceRef = useRef<MeditationRoomService>(new MockMeditationRoomService());

  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];

  useEffect(() => {
    if (sessions.length === 0) loadSessions();
  }, []);

  useEffect(() => {
    serviceRef.current.join(sessionId ?? '');
    trackMeditationSessionJoined(sessionId ?? '');
    const cleanup = serviceRef.current.onParticipantCountChange((count) => {
      setParticipantCount(count);
    });

    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    return () => {
      cleanup();
      clearInterval(timer);
      serviceRef.current.leave();
    };
  }, []);

  function sendReaction(emoji: string) {
    const reaction: Reaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.random() * 200 + 60,
    };
    setReactions((prev) => [...prev, reaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 2200);
    setShowEmojiPicker(false);
    serviceRef.current.sendReaction(emoji);
  }

  return (
    <View style={styles.root}>
      <View style={[styles.ambientGlow, styles.ambientLeft]} />
      <View style={[styles.ambientGlow, styles.ambientRight]} />

      {/* Floating reactions overlay */}
      <View style={styles.reactionsOverlay} pointerEvents="none">
        {reactions.map((r) => (
          <ReactionBubble key={r.id} emoji={r.emoji} x={r.x} />
        ))}
      </View>

      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
          <View style={styles.topCenter}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session?.title ?? 'Meditation Session'}
            </Text>
            <Text style={styles.participantCount}>
              {participantCount.toLocaleString()} participants
            </Text>
          </View>
          <Text style={styles.elapsedText}>{formatElapsed(elapsed)}</Text>
        </View>

        {/* Orb */}
        <View style={styles.orbWrapper}>
          <BreathingOrb size={240} />
        </View>

        {/* Participant avatars */}
        <View style={styles.avatarsRow}>
          {MOCK_AVATARS.map(({ initials, color }) => (
            <View key={initials} style={[styles.avatarCircle, { backgroundColor: color }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          ))}
          <View style={[styles.avatarCircle, styles.avatarOverflow]}>
            <Text style={styles.overflowText}>+{(participantCount - 3).toLocaleString()}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            style={styles.controlBtn}
            onPress={() => {
              serviceRef.current.leave();
              router.back();
            }}
            accessibilityRole="button"
            accessibilityLabel="Leave Room"
            testID="leave-btn">
            <Ionicons name="exit-outline" size={22} color="#F87171" />
            <Text style={[styles.controlLabel, { color: '#F87171' }]}>Leave</Text>
          </Pressable>

          <Pressable
            style={[styles.controlBtn, muted && styles.controlBtnActive]}
            onPress={() => { setMuted((v) => !v); serviceRef.current.toggleMute(); }}
            accessibilityRole="button"
            accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
            <Ionicons name={muted ? 'mic-off' : 'mic-outline'} size={22} color={muted ? '#8E97FD' : '#9CA3AF'} />
            <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
          </Pressable>

          <Pressable
            style={[styles.controlBtn, cameraOff && styles.controlBtnActive]}
            onPress={() => { setCameraOff((v) => !v); serviceRef.current.toggleCamera(); }}
            accessibilityRole="button"
            accessibilityLabel={cameraOff ? 'Show Camera' : 'Hide Camera'}>
            <Ionicons name={cameraOff ? 'videocam-off' : 'videocam-outline'} size={22} color={cameraOff ? '#8E97FD' : '#9CA3AF'} />
            <Text style={styles.controlLabel}>Camera</Text>
          </Pressable>

          <Pressable
            style={[styles.controlBtn, handRaised && styles.controlBtnActive]}
            onPress={() => { setHandRaised((v) => !v); serviceRef.current.raiseHand(); }}
            accessibilityRole="button"
            accessibilityLabel="Raise Hand">
            <Ionicons name="hand-left-outline" size={22} color={handRaised ? '#8E97FD' : '#9CA3AF'} />
            <Text style={styles.controlLabel}>Hand</Text>
          </Pressable>

          <Pressable
            style={styles.controlBtn}
            onPress={() => setShowEmojiPicker((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Send Reaction">
            <Ionicons name="heart-outline" size={22} color="#9CA3AF" />
            <Text style={styles.controlLabel}>React</Text>
          </Pressable>
        </View>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <View style={styles.emojiPicker}>
            {REACTION_EMOJIS.map((e) => (
              <Pressable key={e} style={styles.emojiBtn} onPress={() => sendReaction(e)}>
                <Text style={styles.emojiText}>{e}</Text>
              </Pressable>
            ))}
          </View>
        )}
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
    opacity: 0.2,
    top: '20%',
  },
  ambientLeft:  { left: -160 },
  ambientRight: { right: -160 },
  reactionsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  reactionBubble: {
    position: 'absolute',
    bottom: 120,
  },
  reactionEmoji: { fontSize: 28 },
  safe: { flex: 1, paddingHorizontal: 20 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveBadgeText: { color: '#EF4444', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  topCenter: { flex: 1, alignItems: 'center' },
  sessionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  participantCount: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  elapsedText: { color: '#8E97FD', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  orbWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: -10,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0B0F1A',
  },
  avatarInitials: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  avatarOverflow: { backgroundColor: '#252B45' },
  overflowText: { color: '#9CA3AF', fontSize: 10, fontWeight: '600' },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    paddingVertical: 14,
    marginBottom: 16,
  },
  controlBtn: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  controlBtnActive: { backgroundColor: 'rgba(142,151,253,0.15)' },
  controlLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: '500' },
  emojiPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emojiBtn: { padding: 8 },
  emojiText: { fontSize: 28 },
});
