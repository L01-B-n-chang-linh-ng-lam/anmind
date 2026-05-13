export interface MeditationRoomService {
  join(sessionId: string): Promise<void>;
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
  async join(_sessionId: string): Promise<void> {
    throw new Error('Live meditation rooms are only available on native platforms.');
  }

  async leave(): Promise<void> {}
  async toggleMute(): Promise<void> {}
  async toggleCamera(): Promise<void> {}
  async switchCamera(): Promise<void> {}
  async raiseHand(): Promise<void> {}
  async sendReaction(_emoji: string): Promise<void> {}

  onParticipantCountChange(cb: (count: number) => void): () => void {
    cb(0);
    return () => {};
  }

  onRemoteUsersChange(cb: (uids: number[]) => void): () => void {
    cb([]);
    return () => {};
  }
}
