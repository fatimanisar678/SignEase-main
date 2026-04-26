import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2000, // 2 seconds to fill
      useNativeDriver: false,
    }).start();

    // Handle navigation when auth state is loaded
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 2000); // Wait for the animation to finish
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, progressAnim]);

  // Interpolate the animated value to a percentage string for width
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
            {/* Logo Container */}
            <View style={styles.logoCard}>
              <View style={styles.iconWrapper}>
                <Ionicons name="hand-right" size={60} color="#374B6D" style={{ transform: [{ rotate: '-15deg' }] }} />
                <View style={styles.logoDot} />
              </View>
            </View>

            {/* Title & Subtitle */}
            <Text style={styles.title}>SignEase</Text>
            <Text style={styles.subtitle}>
              Bridging Communication{'\n'}Through Signs
            </Text>

            {/* Progress Bar Area */}
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
  },
  content: {
    alignItems: 'center',
    width: '100%',
    marginTop: -50, // Slight visual adjustment to center
  },
  logoCard: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#CDB4DB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDot: {
    position: 'absolute',
    top: -5,
    right: -10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D1B3F2', // Soft pastel purple dot
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#374B6D',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
    width: '100%',
  },
  progressBarBackground: {
    width: 220,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFillContainer: {
    height: '100%',
  },
  progressBarFill: {
    flex: 1,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

