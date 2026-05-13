import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.title}>Forgot{'\n'}Password?</Text>
          <Text style={styles.sub}>
            Enter your email and we will send you a reset link.
          </Text>

          {submitted ? (
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={28} color="#34D399" />
              <Text style={styles.successText}>
                Reset link sent. Check your inbox.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    testID="email-input"
                  />
                </View>
              </View>

              <Pressable
                style={[styles.btn, !email.trim() && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={!email.trim()}
                accessibilityRole="button"
                accessibilityLabel="Send Reset Link"
                testID="send-reset-btn">
                <Text style={styles.btnText}>Send Reset Link</Text>
              </Pressable>
            </>
          )}

          <Link href="/auth/login" asChild>
            <Pressable style={styles.backToLogin}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 28 },
  backBtn: {
    marginTop: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1A1F35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '700', marginTop: 32, lineHeight: 44, marginBottom: 8 },
  sub: { color: '#9CA3AF', fontSize: 14, marginBottom: 32, lineHeight: 22 },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  successText: { color: '#34D399', fontSize: 15, flex: 1, lineHeight: 22 },
  inputGroup: { marginBottom: 24 },
  inputLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1F35', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: '#252B45' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  btn: { backgroundColor: '#8E97FD', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#1C0A3E', fontSize: 16, fontWeight: '700' },
  backToLogin: { alignItems: 'center', paddingVertical: 14 },
  backToLoginText: { color: '#8E97FD', fontSize: 14, fontWeight: '600' },
});
