import * as Haptics from 'expo-haptics';

export const hapticService = {
  async triggerInhale(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch {}
  },

  async triggerHold(): Promise<void> {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },

  async triggerExhale(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch {}
  },

  stop(): void {
    // Expo haptics are one-shot events; nothing to cancel
  },

  isEnabled(): boolean {
    return true;
  },
};
