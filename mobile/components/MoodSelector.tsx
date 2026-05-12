import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { MoodLabel } from '@/types';
import { MOOD_EMOJIS } from '@/types';

const MOODS: MoodLabel[] = ['Stressed', 'Overwhelmed', 'Anxious', 'Neutral', 'Calm'];

interface Props {
  selected: MoodLabel | null;
  onSelect: (mood: MoodLabel) => void;
}

export default function MoodSelector({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {MOODS.map((mood) => (
        <Pressable
          key={mood}
          testID={`mood-${mood.toLowerCase()}`}
          onPress={() => onSelect(mood)}
          accessibilityRole="button"
          accessibilityLabel={mood}
          style={[styles.item, selected === mood && styles.itemSelected]}>
          <Text style={styles.emoji}>{MOOD_EMOJIS[mood]}</Text>
          <Text style={[styles.label, selected === mood && styles.labelSelected]}>
            {mood}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  item: {
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  itemSelected: {
    backgroundColor: 'rgba(142, 151, 253, 0.15)',
    borderColor: '#8E97FD',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  labelSelected: {
    color: '#8E97FD',
    fontWeight: '700',
  },
});
