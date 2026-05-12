import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DURATIONS = [3, 5, 7, 10] as const;
type Duration = (typeof DURATIONS)[number];

interface Props {
  selected: Duration;
  onSelect: (d: Duration) => void;
}

export default function DurationSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {DURATIONS.map((d) => (
        <Pressable
          key={d}
          testID={`duration-${d}`}
          onPress={() => onSelect(d)}
          accessibilityRole="button"
          accessibilityLabel={`${d} minutes`}
          style={[styles.btn, selected === d && styles.btnSelected]}>
          <Text style={[styles.label, selected === d && styles.labelSelected]}>
            {d} min
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: '#252B45',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  btnSelected: {
    backgroundColor: 'rgba(142, 151, 253, 0.15)',
    borderColor: '#8E97FD',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  labelSelected: {
    color: '#8E97FD',
    fontWeight: '700',
  },
});
