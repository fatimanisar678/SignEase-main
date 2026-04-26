import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '@/components/ScreenContainer';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms & Conditions');
      return;
    }
    setLoading(true);
    try {
      await signup(fullName.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F0F8', '#FFFFFF', '#FAF0E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.topHeaderText}>SignEase</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScreenContainer
          style={styles.container}
          containerStyle={{ backgroundColor: 'transparent' }}
          scrollable
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your sign language journey</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.form}>
              <CustomInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Jane Doe"
                left={<Ionicons name="person" size={18} color="#6B7280" />}
              />
              <CustomInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<Ionicons name="mail" size={18} color="#6B7280" />}
              />
              <CustomInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                secureTextEntry
                left={<Ionicons name="lock-closed" size={18} color="#6B7280" />}
              />
              <CustomInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry
                left={<Ionicons name="shield-checkmark" size={18} color="#6B7280" />}
              />

              <TouchableOpacity
                style={styles.checkboxRow}
                activeOpacity={0.8}
                onPress={() => setAgreed(!agreed)}
              >
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the{' '}
                  <Text style={styles.linkTextBlue}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.linkTextBlue}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}

              <CustomButton
                label={loading ? 'Creating account…' : 'Sign Up'}
                onPress={handleSignup}
                disabled={loading}
                style={styles.primaryBtn}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <CustomButton
                label="Continue with Google"
                onPress={() => { }}
                variant="outline"
                style={styles.googleBtn}
              />
            </View>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.linkTextDark}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScreenContainer>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  safeArea: { flex: 1 },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: { padding: 4 },
  topHeaderText: { fontSize: 18, fontWeight: '700', color: '#3B82F6' },
  container: { paddingHorizontal: 24 },
  scroll: { paddingBottom: 40, alignItems: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#4B5563' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 24, paddingVertical: 32, width: '100%', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3, marginBottom: 30 },
  form: { gap: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 4 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 10, flexShrink: 0 },
  checkboxChecked: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  checkboxText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },
  linkTextBlue: { color: '#374B6D', fontWeight: '600' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 10, borderRadius: 10 },
  error: { color: '#EF4444', fontSize: 13, flex: 1 },
  primaryBtn: { backgroundColor: '#6A89A7', height: 54, borderRadius: 14, marginTop: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', letterSpacing: 1 },
  googleBtn: { backgroundColor: '#F3F4F6', borderWidth: 0, height: 54, borderRadius: 14 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerText: { color: '#4B5563', fontSize: 14 },
  linkTextDark: { color: '#374B6D', fontSize: 14, fontWeight: '700' },
});
