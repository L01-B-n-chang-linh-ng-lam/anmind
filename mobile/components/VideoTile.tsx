import { Ionicons } from '@expo/vector-icons';
import { useMemo, type ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VideoTileProps {
  uid: number;
  isLocal: boolean;
  isMuted?: boolean;
  isCameraOff?: boolean;
  label?: string;
  RtcSurfaceView?: ComponentType<{ canvas: { uid: number }; style?: object }>;
}

export function VideoTile({
  uid,
  isLocal,
  isMuted = false,
  isCameraOff = false,
  label,
  RtcSurfaceView,
}: VideoTileProps) {
  const displayLabel = useMemo(
    () => label || (isLocal ? 'You' : `Participant ${uid}`),
    [label, isLocal, uid],
  );

  return (
    <View style={styles.container}>
      {!isCameraOff && RtcSurfaceView ? (
        <RtcSurfaceView canvas={{ uid }} style={styles.video} />
      ) : (
        <View style={styles.cameraOffPlaceholder}>
          <Ionicons name="videocam-off-outline" size={40} color="#9CA3AF" />
          <Text style={styles.cameraOffText}>Camera Off</Text>
        </View>
      )}

      {/* Overlay: label + mute indicator */}
      <View style={styles.overlay}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{displayLabel}</Text>
          {isMuted && (
            <View style={styles.muteIndicator}>
              <Ionicons name="mic-off" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#111827',
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraOffPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1F35',
    gap: 8,
  },
  cameraOffText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 8,
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  muteIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
