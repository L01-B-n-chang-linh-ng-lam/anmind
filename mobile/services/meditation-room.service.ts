export interface MeditationRoomService {
  join(sessionId: string): Promise<void>;
  leave(): Promise<void>;
  toggleMute(): Promise<void>;
  toggleCamera(): Promise<void>;
  raiseHand(): Promise<void>;
  sendReaction(emoji: string): Promise<void>;
  /** Returns a cleanup function that stops listening. */
  onParticipantCountChange(cb: (count: number) => void): () => void;
}

export class MockMeditationRoomService implements MeditationRoomService {
  async join(_sessionId: string): Promise<void> {}
  async leave(): Promise<void> {}
  async toggleMute(): Promise<void> {}
  async toggleCamera(): Promise<void> {}
  async raiseHand(): Promise<void> {}
  async sendReaction(_emoji: string): Promise<void> {}

  onParticipantCountChange(cb: (count: number) => void): () => void {
    let count = 4200;
    const interval = setInterval(() => {
      count += Math.random() > 0.5 ? 1 : -1;
      cb(count);
    }, 10000);
    return () => clearInterval(interval);
  }
}
