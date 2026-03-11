import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [isLoading, user]);

  const handleGetStarted = () => {
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0f172a', '#1d4ed8', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.container, { justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#f9fafb" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#1d4ed8', '#38bdf8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SE</Text>
          </View>
          <Text style={styles.title}>SignEase</Text>
          <Text style={styles.subtitle}>
            Learn, practice, and translate sign language with an intuitive, modern experience.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(15,23,42,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#e5e7eb',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f9fafb',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#f9fafb',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

