import type {
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
} from 'react-native-agora';
import { PermissionsAndroid, Platform, type Permission } from 'react-native';
import { getUserFriendlyError } from './api';
import { getMeditationToken, joinMeditationSession } from './meditation.service';

export interface MeditationRoomService {
  join(sessionId: string): Promise<number>;
  leave(): Promise<void>;
  toggleMute(): Promise<void>;
  toggleCamera(): Promise<void>;
  switchCamera(): Promise<void>;
  raiseHand(): Promise<void>;
  sendReaction(emoji: string): Promise<void>;
  onParticipantCountChange(cb: (count: number) => void): () => void;
  onRemoteUsersChange(cb: (uids: number[]) => void): () => void;
}

export class AgoraMeditationRoomService implements MeditationRoomService {
  private engine: IRtcEngine | null = null;
  private eventHandler: IRtcEngineEventHandler | null = null;
  private muted = false;
  private cameraOff = false;
  private participantCount = 1;
  private readonly remoteUids = new Set<number>();
  private readonly participantListeners = new Set<(count: number) => void>();
  private readonly remoteUserListeners = new Set<(uids: number[]) => void>();
  private joining = false;

  async join(sessionId: string): Promise<number> {
    if (!sessionId) throw new Error('Meditation session is missing.');
    if (this.joining || this.engine) return;
    this.joining = true;

    try {
      await requestAgoraPermissions();

      try {
        await joinMeditationSession(sessionId);
      } catch {
        // non-fatal — guest or network error
      }

      const tokenData = await getMeditationToken(sessionId);
      const { appId, channelName, token, uid } = tokenData;

      if (!appId) throw new Error('Agora App ID is not configured.');
      if (!channelName) throw new Error('Agora channel is not configured.');

      const {
        ChannelProfileType,
        ClientRoleType,
        createAgoraRtcEngine,
      } = await import('react-native-agora');

      const engine = createAgoraRtcEngine();

      engine.initialize({
        appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.enableAudio();
      engine.enableVideo();
      engine.startPreview?.();

      this.remoteUids.clear();
      this.setParticipantCount(1);

      this.eventHandler = {
        onJoinChannelSuccess: (_connection?: RtcConnection) =>
          this.updateParticipantCount(),
        onUserJoined: (_connection?: RtcConnection, remoteUid?: number) => {
          if (typeof remoteUid === 'number') {
            this.remoteUids.add(remoteUid);
            this.emitRemoteUsers();
          }
          this.updateParticipantCount();
        },
        onUserOffline: (_connection?: RtcConnection, remoteUid?: number) => {
          if (typeof remoteUid === 'number') {
            this.remoteUids.delete(remoteUid);
            this.emitRemoteUsers();
          }
          this.updateParticipantCount();
        },
        onLeaveChannel: (
          _connection?: RtcConnection,
          stats?: { userCount?: number },
        ) => {
          this.remoteUids.clear();
          this.emitRemoteUsers();
          this.setParticipantCount(stats?.userCount ?? 0);
        },
      };
      engine.registerEventHandler(this.eventHandler);

      const joinResult = engine.joinChannel(token ?? null, channelName, uid ?? 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      if (typeof joinResult === 'number' && joinResult < 0) {
        throw new Error('Unable to join the live room.');
      }

      this.engine = engine;
      return uid ?? 0;
    } catch (error) {
      await this.leave();
      throw new Error(getUserFriendlyError(error));
    } finally {
      this.joining = false;
    }
  }

  async leave(): Promise<void> {
    if (!this.engine) return;
    try {
      this.engine.leaveChannel();
      if (this.eventHandler) {
        this.engine.unregisterEventHandler(this.eventHandler);
      }
      this.engine.release();
    } catch {
      // ignore errors on teardown
    } finally {
      this.engine = null;
      this.eventHandler = null;
      this.remoteUids.clear();
      this.emitRemoteUsers();
      this.setParticipantCount(0);
    }
  }

  async toggleMute(): Promise<void> {
    this.muted = !this.muted;
    this.engine?.muteLocalAudioStream(this.muted);
  }

  async toggleCamera(): Promise<void> {
    this.cameraOff = !this.cameraOff;
    this.engine?.muteLocalVideoStream(this.cameraOff);
  }

  async switchCamera(): Promise<void> {
    this.engine?.switchCamera();
  }

  async raiseHand(): Promise<void> {
    return;
  }

  async sendReaction(_emoji: string): Promise<void> {
    return;
  }

  onParticipantCountChange(cb: (count: number) => void): () => void {
    this.participantListeners.add(cb);
    cb(this.participantCount);
    return () => {
      this.participantListeners.delete(cb);
    };
  }

  onRemoteUsersChange(cb: (uids: number[]) => void): () => void {
    this.remoteUserListeners.add(cb);
    cb([...this.remoteUids]);
    return () => {
      this.remoteUserListeners.delete(cb);
    };
  }

  private setParticipantCount(count: number) {
    this.participantCount = count;
    this.participantListeners.forEach((listener) => listener(count));
  }

  private updateParticipantCount() {
    this.setParticipantCount(1 + this.remoteUids.size);
  }

  private emitRemoteUsers() {
    const uids = [...this.remoteUids];
    this.remoteUserListeners.forEach((listener) => listener(uids));
  }
}

async function requestAgoraPermissions(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const permissions: Permission[] = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
  ];

  const result = await PermissionsAndroid.requestMultiple(permissions);
  const denied = permissions.some(
    (permission) => result[permission] !== PermissionsAndroid.RESULTS.GRANTED,
  );

  if (denied) {
    throw new Error('Camera and microphone permissions are required to join the live room.');
  }
}
