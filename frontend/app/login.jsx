import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '@/components/ScreenContainer';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  return (
    <LinearGradient
      colors={['#E8F0F8', '#FFFFFF', '#FAF0E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScreenContainer 
          style={styles.container} 
          containerStyle={{ backgroundColor: 'transparent' }} 
          scrollable 
          contentContainerStyle={styles.scroll}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconContainer}>
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.brandText}>SignEase</Text>
            </View>
            <Text style={styles.subtitle}>
              Bridging Communication Through{'\n'}Signs
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
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
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} activeOpacity={0.8} style={{ padding: 4 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                }
              />

              <View style={styles.forgotRow}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <CustomButton
                label="Login"
                onPress={handleLogin}
                disabled={!canSubmit}
                style={styles.primaryBtn}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <CustomButton
                label="Continue with Google"
                onPress={() => {}}
                variant="outline"
                left={<Ionicons name="logo-google" size={18} color="#D97706" style={{ backgroundColor: '#000', padding: 2, borderRadius: 10, color: '#FFF', fontSize: 14 }} />}
                style={styles.googleBtn}
              />
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/signup" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScreenContainer>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  scroll: {
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  brandIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#5C7C9E', // Slate blue matching the screenshot
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#374B6D',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    marginBottom: 30,
  },
  form: {
    gap: 18,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374B6D',
  },
  primaryBtn: {
    backgroundColor: '#6A89A7', // Soft slate blue for login button
    height: 54,
    borderRadius: 14,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  googleBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 0,
    height: 54,
    borderRadius: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 14,
  },
  linkText: {
    color: '#374B6D',
    fontSize: 14,
    fontWeight: '700',
  },
});
