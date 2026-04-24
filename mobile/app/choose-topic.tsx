import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TopicCard = {
  label: string;
  height: number;
  artwork: 'sunrise' | 'lotus' | 'moon' | 'cloud' | 'waves' | 'night';
};

const TOPICS: TopicCard[] = [
  { label: 'Reduce Stress', height: 210, artwork: 'sunrise' },
  { label: 'Improve Performance', height: 167, artwork: 'lotus' },
  { label: 'Increase Happiness', height: 167, artwork: 'moon' },
  { label: 'Reduce Anxiety', height: 210, artwork: 'cloud' },
  { label: 'Personal Growth', height: 210, artwork: 'waves' },
  { label: 'Better Sleep', height: 167, artwork: 'night' },
];

export default function ChooseTopicScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heroBubbles} pointerEvents="none">
        <View style={[styles.heroBubble, styles.heroBubbleOne]} />
        <View style={[styles.heroBubble, styles.heroBubbleTwo]} />
        <View style={[styles.heroBubble, styles.heroBubbleThree]} />
        <View style={[styles.heroBubble, styles.heroBubbleFour]} />
      </View>

      <Text style={styles.title}>What brings you to AnMind?</Text>
      <Text style={styles.subtitle}>choose a topic to focuse on:</Text>

      <View style={styles.panel} pointerEvents="none">
        <View style={[styles.panelBubble, styles.panelBubbleOne]} />
        <View style={[styles.panelBubble, styles.panelBubbleTwo]} />
        <View style={[styles.panelBubble, styles.panelBubbleThree]} />
      </View>

      <View style={styles.grid}>
        {TOPICS.map((topic) => (
          <Pressable
            key={topic.label}
            style={[styles.card, { height: topic.height }]}
            onPress={() => router.replace('/home')}>
            <View style={styles.cardArtwork}>
              <CardArtwork kind={topic.artwork} />
            </View>
            <Text style={styles.cardText}>{topic.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function CardArtwork({ kind }: { kind: TopicCard['artwork'] }) {
  if (kind === 'sunrise') {
    return (
      <View style={styles.artworkCanvas}>
        <View style={styles.sunriseHill} />
        <View style={styles.sunriseSun} />
      </View>
    );
  }

  if (kind === 'lotus') {
    return (
      <View style={styles.artworkCanvas}>
        <View style={styles.lotusLeafLarge} />
        <View style={styles.lotusLeafSmall} />
        <View style={styles.lotusCenter} />
      </View>
    );
  }

  if (kind === 'moon') {
    return (
      <View style={styles.artworkCanvas}>
        <View style={styles.moonDisk} />
        <View style={styles.moonCut} />
        <View style={styles.moonStar} />
      </View>
    );
  }

  if (kind === 'cloud') {
    return (
      <View style={styles.artworkCanvas}>
        <View style={styles.cloudPuffLeft} />
        <View style={styles.cloudPuffRight} />
        <View style={styles.cloudBase} />
      </View>
    );
  }

  if (kind === 'waves') {
    return (
      <View style={styles.artworkCanvas}>
        <View style={styles.waveOne} />
        <View style={styles.waveTwo} />
        <View style={styles.waveThree} />
      </View>
    );
  }

  return (
    <View style={[styles.artworkCanvas, styles.nightCanvas]}>
      <View style={styles.nightMoon} />
      <View style={styles.nightGlow} />
      <View style={styles.nightStarOne} />
      <View style={styles.nightStarTwo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8e97fd',
    paddingTop: 36,
    paddingHorizontal: 20,
  },
  heroBubbles: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 76,
    height: 130,
  },
  heroBubble: {
    position: 'absolute',
    backgroundColor: '#9ea6ff',
    opacity: 0.85,
    borderRadius: 999,
  },
  heroBubbleOne: {
    width: 158,
    height: 158,
    right: -22,
    top: -8,
  },
  heroBubbleTwo: {
    width: 148,
    height: 148,
    left: 58,
    top: 42,
  },
  heroBubbleThree: {
    width: 111,
    height: 111,
    right: 78,
    top: 22,
  },
  heroBubbleFour: {
    width: 88,
    height: 88,
    left: -22,
    top: 54,
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    width: 332,
  },
  subtitle: {
    marginTop: 34,
    color: '#ebeaec',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '600',
    width: 248,
    zIndex: 2,
  },
  panel: {
    position: 'absolute',
    left: -30,
    right: -30,
    top: 220,
    bottom: 0,
    backgroundColor: '#f0f1ff',
    borderTopLeftRadius: 240,
    borderTopRightRadius: 240,
  },
  panelBubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#e0e4ff',
  },
  panelBubbleOne: {
    width: 104,
    height: 104,
    left: 26,
    top: -30,
  },
  panelBubbleTwo: {
    width: 80,
    height: 80,
    left: 184,
    top: -40,
  },
  panelBubbleThree: {
    width: 88,
    height: 88,
    left: 294,
    top: -16,
  },
  grid: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 20,
    zIndex: 3,
  },
  card: {
    width: '47.5%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    shadowColor: '#6c74cc',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  cardArtwork: {
    height: 112,
    borderRadius: 14,
    backgroundColor: '#dde3ff',
    overflow: 'hidden',
  },
  cardText: {
    marginTop: 12,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3f414e',
  },
  artworkCanvas: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#dfe4ff',
  },
  sunriseHill: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#bec8ff',
    bottom: -105,
    left: -18,
  },
  sunriseSun: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffcfa6',
    top: 24,
    left: 58,
  },
  lotusLeafLarge: {
    position: 'absolute',
    width: 108,
    height: 44,
    borderRadius: 40,
    backgroundColor: '#b0b8ff',
    bottom: 18,
    left: 18,
  },
  lotusLeafSmall: {
    position: 'absolute',
    width: 72,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#9da8ff',
    bottom: 28,
    left: 36,
  },
  lotusCenter: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#fff1d8',
    bottom: 44,
    left: 64,
  },
  moonDisk: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffd6a5',
    top: 18,
    left: 40,
  },
  moonCut: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dfe4ff',
    top: 10,
    left: 54,
  },
  moonStar: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff4e3',
    top: 22,
    left: 24,
  },
  cloudPuffLeft: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c2cbff',
    top: 38,
    left: 24,
  },
  cloudPuffRight: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#c2cbff',
    top: 28,
    left: 56,
  },
  cloudBase: {
    position: 'absolute',
    width: 108,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#c2cbff',
    top: 62,
    left: 18,
  },
  waveOne: {
    position: 'absolute',
    width: 150,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#c5cdff',
    bottom: 14,
    left: -20,
  },
  waveTwo: {
    position: 'absolute',
    width: 130,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#b4beff',
    bottom: 26,
    left: 6,
  },
  waveThree: {
    position: 'absolute',
    width: 108,
    height: 22,
    borderRadius: 18,
    backgroundColor: '#a4b0ff',
    bottom: 40,
    left: 24,
  },
  nightCanvas: {
    backgroundColor: '#ced5ff',
  },
  nightMoon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff0cc',
    top: 20,
    left: 24,
  },
  nightGlow: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#b6c0ff',
    bottom: -50,
    right: -8,
  },
  nightStarOne: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#fffdf3',
    top: 18,
    right: 30,
  },
  nightStarTwo: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fffdf3',
    top: 38,
    right: 16,
  },
});
