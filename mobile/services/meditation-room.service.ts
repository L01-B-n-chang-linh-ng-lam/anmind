import type {
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcConnection,
} from 'react-native-agora';
import { getMeditationToken, joinMeditationSession } from './meditation.service';

export interface MeditationRoomService {
  join(sessionId: string): Promise<void>;
  leave(): Promise<void>;
  toggleMute(): Promise<void>;
  toggleCamera(): Promise<void>;
  switchCamera(): Promise<void>;
  raiseHand(): Promise<void>;
  sendReaction(emoji: string): Promise<void>;
  /** Returns a cleanup function that stops listening. */
  onParticipantCountChange(cb: (count: number) => void): () => void;
}

export class AgoraMeditationRoomService implements MeditationRoomService {
  private engine: IRtcEngine | null = null;
  private eventHandler: IRtcEngineEventHandler | null = null;
  private muted = false;
  private cameraOff = false;
  private participantCount = 1;
  private participantListeners = new Set<(count: number) => void>();
  private joining = false;

  async join(sessionId: string): Promise<void> {
    if (this.joining || this.engine) return;
    this.joining = true;

    try {
      // Best-effort: join the session on the backend (works for both auth and guest).
      // Errors are swallowed so the room still loads if the backend is unreachable.
      try {
        await joinMeditationSession(sessionId);
      } catch {
        // non-fatal — guest or network error
      }

      const tokenData = await getMeditationToken(sessionId);
      const { appId, channelName, token, uid } = tokenData;

      if (!appId) throw new Error('Agora App ID is not configured.');

      // Dynamic import keeps react-native-agora out of the module graph at startup,
      // preventing Expo Go from crashing before the user even opens this screen.
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
      engine.setClientRole(ClientRoleType.ClientRoleAudience);
      engine.enableVideo();

      this.eventHandler = {
        onJoinChannelSuccess: (_connection?: RtcConnection) =>
          this.setParticipantCount(1),
        onUserJoined: () =>
          this.setParticipantCount(this.participantCount + 1),
        onUserOffline: () =>
          this.setParticipantCount(Math.max(1, this.participantCount - 1)),
        onLeaveChannel: (
          _connection?: RtcConnection,
          stats?: { userCount?: number },
        ) => this.setParticipantCount(stats?.userCount ?? 0),
      };
      engine.registerEventHandler(this.eventHandler);

      engine.joinChannel(token ?? null, channelName, uid ?? 0, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      this.engine = engine;
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

  async raiseHand(): Promise<void> {}
  async sendReaction(_emoji: string): Promise<void> {}

  onParticipantCountChange(cb: (count: number) => void): () => void {
    this.participantListeners.add(cb);
    cb(this.participantCount);
    return () => {
      this.participantListeners.delete(cb);
    };
  }

  private setParticipantCount(count: number) {
    this.participantCount = count;
    this.participantListeners.forEach((listener) => listener(count));
  }
}
