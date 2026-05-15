import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import {
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BreathingOrb from '@/components/BreathingOrb';
import { VideoTile } from '@/components/VideoTile';
import {
  AgoraMeditationRoomService,
  type MeditationRoomService,
} from '../services/meditation-room.service';
import { trackMeditationSessionJoined } from '@/services/tracking.service';
import { useMeditationStore } from '@/store/meditationStore';

const REACTION_EMOJIS = ['🙏', '❤️', '✨', '🌊', '🌿'];
const RtcSurfaceView = loadRtcSurfaceView('surface');
const RtcTextureView = loadRtcSurfaceView('texture');

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

interface ReactionBubbleProps {
  readonly emoji: string;
  readonly x: number;
}

function ReactionBubble({ emoji, x }: ReactionBubbleProps) {
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

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function loadRtcSurfaceView(
  kind: 'surface' | 'texture',
): ComponentType<{ canvas: { uid: number }; style?: object }> | null {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const agora = require('react-native-agora');
    if (kind === 'texture') {
      return agora.RtcTextureView ?? null;
    }
    return agora.RtcSurfaceView ?? null;
  } catch {
    return null;
  }
}

/**
 * Responsive grid layout calculator.
 * Determines the best tile layout based on number of participants.
 */
function getGridLayout(participantCount: number): {
  cols: number;
  rows: number;
} {
  if (participantCount <= 0) {
    return { cols: 1, rows: 1 }; // Full screen
  } else if (participantCount === 1) {
    return { cols: 1, rows: 2 }; // Stack vertically
  } else if (participantCount <= 3) {
    return { cols: 2, rows: 2 }; // 2x2 grid
  } else if (participantCount <= 5) {
    return { cols: 2, rows: 3 }; // 2x3 grid
  } else {
    return { cols: 3, rows: Math.ceil(participantCount / 3) }; // 3-column
  }
}

export default function MeditationRoomScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { sessions, loadSessions, loadSession } = useMeditationStore();

  // Agora & room state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [localUid, setLocalUid] = useState<number | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [remoteUids, setRemoteUids] = useState<number[]>([]);

  // Control state
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Service and cleanup management
  const serviceRef = useRef<MeditationRoomService>(
    new AgoraMeditationRoomService(),
  );
  const cleanupListenersRef = useRef<Array<() => void>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];

  /**
   * Join the Agora room and set up event listeners.
   */
  const joinRoom = useCallback(async () => {
    if (!sessionId) {
      setError('No session ID provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setElapsed(0);
    setRemoteUids([]);

    try {
      const svc = serviceRef.current;

      // Join the meditation room via Agora.
      const joinedUid = await svc.join(sessionId);
      setIsJoined(true);
      setLocalUid(joinedUid);

      // Register listeners.
      const unsubscribeParticipants = svc.onParticipantCountChange((count: number) => {
        setParticipantCount(count);
      });
      const unsubscribeRemoteUsers = svc.onRemoteUsersChange((uids: number[]) => {
        setRemoteUids(uids);
      });

      cleanupListenersRef.current = [
        ...cleanupListenersRef.current,
        unsubscribeParticipants,
        unsubscribeRemoteUsers,
      ];

      // Track the session join.
      trackMeditationSessionJoined(sessionId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to join the room.';
      setError(message);
      setIsJoined(false);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  /**
   * Leave the room cleanly.
   */
  const leaveRoom = useCallback(async () => {
    Alert.alert(
      'Leave Room',
      'Are you sure you want to leave?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Leave',
          onPress: async () => {
            try {
              await serviceRef.current.leave();
            } catch {
              // Leave is best-effort.
            } finally {
              router.back();
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  }, [router]);

  /**
   * Load session data on mount.
   */
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    } else if (sessions.length === 0) {
      loadSessions();
    }
  }, [sessionId, loadSession, loadSessions, sessions.length]);

  /**
   * Join room on mount, set up timer, clean up on unmount.
   */
  useEffect(() => {
    joinRoom();

    // Elapsed time timer.
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    return () => {
      // Cleanup listeners.
      cleanupListenersRef.current.forEach((cleanup) => cleanup());
      cleanupListenersRef.current = [];

      // Stop timer.
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Leave room gracefully.
      serviceRef.current.leave().catch(() => {});
    };
  }, [joinRoom]);

  /**
   * Send a reaction emoji.
   */
  function sendReaction(emoji: string) {
    const reaction: Reaction = {
      id: crypto.randomUUID(),
      emoji,
      x: (crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF) * 200 + 60,
    };
    setReactions((prev) => [...prev, reaction]);
    setTimeout(() => removeReaction(reaction.id), 2200);
    setShowEmojiPicker(false);
    serviceRef.current.sendReaction(emoji).catch(() => {});
  }

  /**
   * Compile all video tile UIDs (local + remote).
   */
  const allParticipants: Array<{ uid: number; isLocal: boolean }> = [];
  if (localUid !== null) {
    allParticipants.push({ uid: localUid, isLocal: true });
  }
  remoteUids.forEach((uid) => {
    allParticipants.push({ uid, isLocal: false });
  });

  const layout = getGridLayout(allParticipants.length);
  const tileWidth = 100 / layout.cols;

  const removeReaction = useCallback((reactionId: string) => {
    setReactions((previous) =>
      previous.filter((reaction) => reaction.id !== reactionId),
    );
  }, []);

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

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.backBtn}
            onPress={leaveRoom}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Ionicons name="chevron-back-outline" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.topCenter}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session?.title ?? 'Meditation Session'}
            </Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
              <Text style={styles.participantCountLabel}>
                {participantCount} {participantCount === 1 ? 'person' : 'people'}
              </Text>
            </View>
          </View>

          <Text style={styles.elapsedText}>{formatElapsed(elapsed)}</Text>
        </View>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.centerOverlay}>
            <ActivityIndicator size="large" color="#8E97FD" />
            <Text style={styles.loadingText}>Connecting...</Text>
          </View>
        )}

        {/* Error state */}
        {Boolean(error) && !isLoading && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={32} color="#F87171" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryBtn}
              onPress={() => {
                setError('');
                joinRoom();
              }}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Video grid */}
        {isJoined && !isLoading && !error && !!allParticipants.length && (
          <ScrollView
            style={styles.videoGridContainer}
            scrollEnabled={layout.rows > 2}
            contentContainerStyle={styles.videoGridContent}>
            <View style={styles.videoGrid}>
              {allParticipants.map((participant) => (
                <View
                  key={participant.uid}
                  style={{
                    width: `${tileWidth}%`,
                    aspectRatio: 9 / 16,
                    padding: 4,
                  }}>
                  <VideoTile
                    uid={participant.uid}
                    isLocal={participant.isLocal}
                    isMuted={muted && participant.isLocal}
                    isCameraOff={cameraOff && participant.isLocal}
                    label={
                      participant.isLocal
                        ? 'You'
                        : `Participant ${participant.uid}`
                    }
                    RtcSurfaceView={
                      participant.isLocal ? RtcTextureView ?? undefined : RtcSurfaceView ?? undefined
                    }
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Empty state */}
        {isJoined && !isLoading && !error && allParticipants.length === 0 && (
          <View style={styles.centerOverlay}>
            <Ionicons name="people-outline" size={48} color="#8E97FD" />
            <Text style={styles.emptyText}>Waiting for participants...</Text>
          </View>
        )}

        {/* Breathing orb (secondary visual) */}
        {isJoined && !isLoading && !error && allParticipants.length > 1 && (
          <View style={styles.orbOverlay} pointerEvents="none">
            <BreathingOrb size={60} />
          </View>
        )}

        {/* Controls */}
        {isJoined && !isLoading && (
          <View style={styles.controls}>
            <Pressable
              style={[styles.controlBtn, muted && styles.controlBtnActive]}
              onPress={async () => {
                setMuted((v) => !v);
                await serviceRef.current.toggleMute().catch(() => {});
              }}
              accessibilityRole="button"
              accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
              <Ionicons
                name={muted ? 'mic-off' : 'mic-outline'}
                size={22}
                color={muted ? '#8E97FD' : '#9CA3AF'}
              />
              <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
            </Pressable>

            <Pressable
              style={[styles.controlBtn, cameraOff && styles.controlBtnActive]}
              onPress={async () => {
                setCameraOff((v) => !v);
                await serviceRef.current.toggleCamera().catch(() => {});
              }}
              accessibilityRole="button"
              accessibilityLabel={cameraOff ? 'Show Camera' : 'Hide Camera'}>
              <Ionicons
                name={cameraOff ? 'videocam-off' : 'videocam-outline'}
                size={22}
                color={cameraOff ? '#8E97FD' : '#9CA3AF'}
              />
              <Text style={styles.controlLabel}>Camera</Text>
            </Pressable>

            <Pressable
              style={styles.controlBtn}
              onPress={async () => {
                await serviceRef.current.switchCamera().catch(() => {});
              }}
              accessibilityRole="button"
              accessibilityLabel="Switch Camera">
              <Ionicons name="camera-reverse-outline" size={22} color="#9CA3AF" />
              <Text style={styles.controlLabel}>Switch</Text>
            </Pressable>

            <Pressable
              style={[styles.controlBtn, handRaised && styles.controlBtnActive]}
              onPress={async () => {
                setHandRaised((v) => !v);
                await serviceRef.current.raiseHand().catch(() => {});
              }}
              accessibilityRole="button"
              accessibilityLabel="Raise Hand">
              <Ionicons
                name="hand-left-outline"
                size={22}
                color={handRaised ? '#8E97FD' : '#9CA3AF'}
              />
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

            <Pressable
              style={styles.controlBtn}
              onPress={leaveRoom}
              accessibilityRole="button"
              accessibilityLabel="Leave Room"
              testID="leave-btn">
              <Ionicons name="exit-outline" size={22} color="#F87171" />
              <Text style={[styles.controlLabel, { color: '#F87171' }]}>
                Leave
              </Text>
            </Pressable>
          </View>
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <View style={styles.emojiPicker}>
            {REACTION_EMOJIS.map((e) => (
              <Pressable
                key={e}
                style={styles.emojiBtn}
                onPress={() => sendReaction(e)}>
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
  ambientLeft: { left: -160 },
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
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center' },
  sessionTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveBadgeText: { color: '#EF4444', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  participantCountLabel: { color: '#9CA3AF', fontSize: 10, marginLeft: 4 },
  elapsedText: { color: '#8E97FD', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },

  // Center overlays
  centerOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500' },
  emptyText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500', marginTop: 8 },

  // Error state
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: { color: '#F87171', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  retryBtn: {
    borderWidth: 1,
    borderColor: '#8E97FD',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { color: '#8E97FD', fontSize: 13, fontWeight: '700' },

  // Video grid
  videoGridContainer: {
    flex: 1,
    marginVertical: 12,
  },
  videoGridContent: {
    paddingHorizontal: 12,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Breathing orb overlay
  orbOverlay: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    opacity: 0.7,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    paddingVertical: 14,
    marginHorizontal: 12,
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

  // Emoji picker
  emojiPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1F35',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  emojiBtn: { padding: 8 },
  emojiText: { fontSize: 28 },
});
