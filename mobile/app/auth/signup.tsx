import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';

export default function SignupScreen() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(username.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.glow, styles.glowTop]} />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Create{'\n'}Account</Text>
            <Text style={styles.sub}>Start your mindfulness journey today.</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {[
              { label: 'Username', value: username, set: setUsername, placeholder: 'yourname', icon: 'person-outline' as const, type: 'default' as const },
              { label: 'Email', value: email, set: setEmail, placeholder: 'you@example.com', icon: 'mail-outline' as const, type: 'email-address' as const },
              { label: 'Password', value: password, set: setPassword, placeholder: '••••••••', icon: 'lock-closed-outline' as const, type: 'default' as const, secure: true },
            ].map(({ label, value, set, placeholder, icon, type, secure }) => (
              <View key={label} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name={icon} size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#4B5563"
                    value={value}
                    onChangeText={set}
                    keyboardType={type}
                    autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                    secureTextEntry={secure}
                    testID={`${label.toLowerCase()}-input`}
                  />
                </View>
              </View>
            ))}

            <Pressable
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Sign Up"
              testID="signup-btn">
              <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Sign Up'}</Text>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <Pressable>
                  <Text style={styles.loginLink}>Log In</Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F1A' },
  glow: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#6B3FA0', opacity: 0.2 },
  glowTop: { top: -100, left: -80 },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: 28, paddingBottom: 32 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '700', marginTop: 40, lineHeight: 46, marginBottom: 8 },
  sub: { color: '#9CA3AF', fontSize: 15, marginBottom: 32 },
  error: { color: '#F87171', fontSize: 13, marginBottom: 16, backgroundColor: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: 12 },
  inputGroup: { marginBottom: 18 },
  inputLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1F35', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: '#252B45' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  btn: { backgroundColor: '#8E97FD', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 24, marginTop: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#1C0A3E', fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#9CA3AF', fontSize: 14 },
  loginLink: { color: '#8E97FD', fontSize: 14, fontWeight: '700' },
});
