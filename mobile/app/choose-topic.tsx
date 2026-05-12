import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { STORAGE_KEYS } from '@/services/storage.service';

const DESIGN_WIDTH = 430;
const DESIGN_HEIGHT = 932;

export const CARDS = [
  { label: 'Reduce Stress',       x: 17,  y: 217, w: 176, h: 210 },
  { label: 'Improve Performance', x: 237, y: 217, w: 176, h: 210 },
  { label: 'Increase Happiness',  x: 17,  y: 447, w: 176, h: 167 },
  { label: 'Reduce Anxiety',      x: 237, y: 447, w: 176, h: 167 },
  { label: 'Personal Growth',     x: 17,  y: 634, w: 176, h: 210 },
  { label: 'Better Sleep',        x: 237, y: 634, w: 176, h: 210 },
] as const;

export default function ChooseTopicScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const scale = width / DESIGN_WIDTH;
  const imageHeight = DESIGN_HEIGHT * scale;

  return (
    // ScrollView with no fixed height on contentContainerStyle —
    // the inner View defines the scroll extent naturally.
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      showsVerticalScrollIndicator={false}
      testID="choose-topic-scroll"
    >
      {/* Wrapper View gives ScrollView an explicit content height to scroll against */}
      <View style={{ width, height: imageHeight }}>
        <Image
          source={require('@/assets/images/choose-topic-full.png')}
          contentFit="fill"
          style={{ width, height: imageHeight }}
          testID="choose-topic-image"
        />
        {CARDS.map((card) => (
          <Pressable
            key={card.label}
            testID={`card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
            style={[
              styles.hitbox,
              {
                left:   card.x * scale,
                top:    card.y * scale,
                width:  card.w * scale,
                height: card.h * scale,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={card.label}
            onPress={async () => {
              await AsyncStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify([card.label]));
              await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
              router.replace('/(tabs)');
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // No fixed height — let the inner View drive the scroll extent.
  // A generous paddingBottom ensures the last row scrolls clear of the
  // device's home-indicator / bottom safe-area on every screen size.
  contentContainer: {
    paddingBottom: 40,
  },
  hitbox: {
    position: 'absolute',
    borderRadius: 20,
  },
});
