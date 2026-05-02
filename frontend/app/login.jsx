import React, { useMemo, useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0 && !loading,
    [email, password, loading]
  );

  return (
    <LinearGradient
      colors={['#E8F0F8', '#FFFFFF', '#FAF0E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.brandRow}>
                <View style={styles.brandIconContainer}>
                  <Ionicons name="people" size={28} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.brandText}>SignEase</Text>
              <Text style={styles.subtitle}>
                Bridging Communication Through{'\n'}Signs
              </Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>Sign in to continue your journey</Text>

              <View style={styles.form}>
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="hello@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<Ionicons name="mail" size={18} color="#6B7280" />}
                />

                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  left={<Ionicons name="lock-closed" size={18} color="#6B7280" />}
                  right={
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      activeOpacity={0.8}
                      style={{ padding: 4 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  }
                />

                <View style={styles.forgotRow}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => { }}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <CustomButton
                  label={loading ? 'Logging in…' : 'Login'}
                  onPress={handleLogin}
                  disabled={!canSubmit}
                  style={styles.primaryBtn}
                />
              </View>
            </View>

            {/* Footer Section */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/signup" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.linkText}> Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: { alignItems: 'center', marginBottom: 36 },
  brandRow: { marginBottom: 12 },
  brandIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#5C7C9E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C7C9E',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  brandText: { fontSize: 36, fontWeight: '800', color: '#374B6D', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#4B5563', textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    marginBottom: 28,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  form: { gap: 18 },
  forgotRow: { alignItems: 'flex-end', marginTop: -8 },
  forgotText: { fontSize: 13, fontWeight: '600', color: '#374B6D' },
  error: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginTop: -4 },
  primaryBtn: { backgroundColor: '#6A89A7', height: 54, borderRadius: 14, marginTop: 4 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#4B5563', fontSize: 15 },
  linkText: { color: '#374B6D', fontSize: 15, fontWeight: '700' },
});
