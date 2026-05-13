import { useAudioPlayer } from 'expo-audio';

export function useBreathingAudio(enabled: boolean) {
  const inhalePlayer = useAudioPlayer(require('@/assets/sounds/inhale.wav'));
  const exhalePlayer = useAudioPlayer(require('@/assets/sounds/exhale.wav'));

  inhalePlayer.volume = 1;
  exhalePlayer.volume = 1;

  function playInhale() {
    if (!enabled) return;
    inhalePlayer.seekTo(0).then(() => inhalePlayer.play()).catch(() => {});
  }

  function playExhale() {
    if (!enabled) return;
    exhalePlayer.seekTo(0).then(() => exhalePlayer.play()).catch(() => {});
  }

  return { playInhale, playExhale };
}
