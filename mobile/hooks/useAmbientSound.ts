import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import type { AppSettings } from '@/types';

const AMBIENT_ASSETS: Partial<Record<AppSettings['ambientSound'], ReturnType<typeof require>>> = {
  Rain:   require('@/assets/sounds/rain.wav'),
  Ocean:  require('@/assets/sounds/ocean.wav'),
  Forest: require('@/assets/sounds/forest.wav'),
};

export function useAmbientSound(selection: AppSettings['ambientSound']) {
  const source = selection === 'None' ? null : (AMBIENT_ASSETS[selection] ?? null);
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (selection === 'None' || !status.isLoaded) return;
    player.loop = true;
    player.volume = 0.4;
    player.play();
    // No cleanup — useAudioPlayer releases the player on unmount and on source change,
    // which stops audio automatically. Calling player.pause() in cleanup crashes because
    // the native object is already freed by the time effect cleanup runs on unmount.
  }, [selection, status.isLoaded]);
}
