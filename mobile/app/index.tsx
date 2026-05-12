import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { STORAGE_KEYS } from '@/services/storage.service';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const imageWidth = DESIGN_WIDTH * scale;
  const imageHeight = DESIGN_HEIGHT * scale;
  const offsetX = (width - imageWidth) / 2;
  const offsetY = (height - imageHeight) / 2;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING).then((done) => {
      if (done === 'true') router.replace('/(tabs)');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/onboarding-welcome.png')}
        contentFit="contain"
        style={{ width: imageWidth, height: imageHeight }}
      />

      <Pressable
        style={[
          styles.ctaHitbox,
          {
            left: offsetX + CTA_FRAME.x * scale,
            top: offsetY + CTA_FRAME.y * scale,
            width: CTA_FRAME.width * scale,
            height: CTA_FRAME.height * scale,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Get started"
        onPress={() => router.push('/choose-topic')}
      />
    </View>
  );
}

const DESIGN_WIDTH = 430;
const DESIGN_HEIGHT = 932;

const CTA_FRAME = {
  x: 28,
  y: 739,
  width: 374,
  height: 63,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8e97fd',
  },
  ctaHitbox: {
    position: 'absolute',
    borderRadius: 38,
  },
});
