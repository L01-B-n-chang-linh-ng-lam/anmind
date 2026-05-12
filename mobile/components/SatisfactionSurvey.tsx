import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { trackSatisfactionSubmitted } from '@/services/tracking.service';

interface Props {
  visible: boolean;
  onClose(): void;
}

export default function SatisfactionSurvey({ visible, onClose }: Props) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  function handleSubmit() {
    if (score === 0) return;
    trackSatisfactionSubmitted(score, feedback.trim() || undefined);
    setScore(0);
    setFeedback('');
    onClose();
  }

  function handleSkip() {
    setScore(0);
    setFeedback('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>How satisfied are you{'\n'}with AnMind?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setScore(n)} accessibilityRole="button">
                <Ionicons
                  name={n <= score ? 'star' : 'star-outline'}
                  size={36}
                  color={n <= score ? '#F59E0B' : '#4B5563'}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Any feedback? (optional)"
            placeholderTextColor="#6B7280"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={3}
          />

          <Pressable
            style={[styles.submitBtn, score === 0 && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={score === 0}
            accessibilityRole="button">
            <Text style={styles.submitBtnText}>Submit</Text>
          </Pressable>

          <Pressable onPress={handleSkip} style={styles.skipBtn} accessibilityRole="button">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1A1F35',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#252B45',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#8E97FD',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: '#1C0A3E', fontSize: 15, fontWeight: '700' },
  skipBtn: { paddingVertical: 8 },
  skipText: { color: '#6B7280', fontSize: 14 },
});
