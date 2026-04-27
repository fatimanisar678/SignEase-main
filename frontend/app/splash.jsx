import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const hasNavigated = useRef(false);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2200,
      useNativeDriver: false,
    }).start();
  }, []);

  // Navigate ONLY after auth has finished loading AND 2s animation has passed
  useEffect(() => {
    if (isLoading || hasNavigated.current) return;
    const timer = setTimeout(() => {
      hasNavigated.current = true;
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F0F0F8', '#E6E4F0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoCard}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>SignEase</Text>
            <Text style={styles.subtitle}>Bridging Communication{'\n'}Through Signs</Text>
            <View style={styles.loaderContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFillContainer, { width: progressWidth }]}>
                  <LinearGradient
                    colors={['#5C6B8D', '#CDE0F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressBarFill}
                  />
                </Animated.View>
              </View>
              <Text style={styles.loadingText}>Preparing your journey...</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', width: '100%', marginTop: -50 },
  logoCard: { width: 140, height: 140, backgroundColor: '#FFFFFF', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 40, shadowColor: '#CDB4DB', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  logoImage: { width: 100, height: 100 },
  title: { fontSize: 42, fontWeight: '800', color: '#374B6D', letterSpacing: -0.5, marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#6B7280', textAlign: 'center', lineHeight: 26, fontWeight: '400' },
  loaderContainer: { marginTop: 60, alignItems: 'center', width: '100%' },
  progressBarBackground: { width: 220, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  progressBarFillContainer: { height: '100%' },
  progressBarFill: { flex: 1, borderRadius: 4 },
  loadingText: { fontSize: 14, color: '#6B7280', fontWeight: '500', letterSpacing: 0.5 },
});
