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
  async join(_sessionId: string): Promise<number> {
    throw new Error('Live meditation rooms are only available on native platforms.');
  }

  async leave(): Promise<void> {
    return undefined;
  }

  async toggleMute(): Promise<void> {
    return undefined;
  }

  async toggleCamera(): Promise<void> {
    return undefined;
  }

  async switchCamera(): Promise<void> {
    return undefined;
  }

  async raiseHand(): Promise<void> {
    return undefined;
  }

  async sendReaction(_emoji: string): Promise<void> {
    return undefined;
  }

  onParticipantCountChange(cb: (count: number) => void): () => void {
    cb(0);
    return () => {};
  }

  onRemoteUsersChange(cb: (uids: number[]) => void): () => void {
    cb([]);
    return () => {};
  }
}
