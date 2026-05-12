import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ResetSession } from '@/types';

interface Props {
  session: ResetSession;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SessionCard({ session }: Props) {
  const improvement =
    session.scoreBefore != null && session.scoreAfter != null
      ? session.scoreAfter - session.scoreBefore
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.date}>{formatDate(session.startedAt)}</Text>
        <Text style={styles.duration}>{session.durationMinutes} min</Text>
      </View>
      <View style={styles.right}>
        {improvement != null && (
          <Text style={[styles.improvement, improvement >= 0 ? styles.positive : styles.negative]}>
            {improvement >= 0 ? '+' : ''}{improvement} mood
          </Text>
        )}
        <View style={[styles.badge, session.completed ? styles.badgeComplete : styles.badgeIncomplete]}>
          <Text style={styles.badgeText}>{session.completed ? 'Done' : 'Incomplete'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1F35',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  left: {
    gap: 4,
  },
  date: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  duration: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  improvement: {
    fontSize: 14,
    fontWeight: '700',
  },
  positive: {
    color: '#34D399',
  },
  negative: {
    color: '#F87171',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeComplete: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
  },
  badgeIncomplete: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
