import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '@/components/ScreenContainer';
import { apiRequest } from '@/lib/api';

const MODULES_BEGINNER = [
  {
    id: '1',
    title: 'Alphabet',
    description: 'Learn the fundamentals of finger spelling.',
    progress: 85,
    progressText: '22/26 Letters',
    iconText: 'ABC',
    iconColor: '#CDE0F5',
  },
  {
    id: '2',
    title: 'Numbers',
    description: 'Counting from 1-100 with ease.',
    progress: 30,
    progressText: '4/12 Modules',
    iconText: '#',
    iconColor: '#CDE0F5',
  },
];

const MODULES_INTERMEDIATE = [
  {
    id: '3',
    title: 'Common Phrases',
    description: 'Greetings and essential everyday talk.',
    progress: 10,
    progressText: '1/10 Phrases',
    iconName: 'chatbox-outline',
    iconColor: '#EBCB9F',
  },
];

export default function LearningScreen() {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // In production, use your actual backend IP or domain
    const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/modules' : 'http://localhost:5000/api/modules';
    
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Map backend data to frontend properties
          const formatted = data.map(m => ({
            ...m,
            id: m._id,
            progress: 0, // Would come from UserProgress in a fully integrated flow
            progressText: 'Not Started',
          }));
          setModules(formatted);
        }
      })
      .catch((err) => console.log('Using fallback modules due to API error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenContainer style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A628A" />
      </ScreenContainer>
    );
  }

  // Fallback to hardcoded modules if API fails (useful for your demo if DB is down)
  const beginnerModules = modules.length > 0 
    ? modules.filter(m => m.level === 'Beginner')
    : MODULES_BEGINNER;
    
  const intermediateModules = modules.length > 0
    ? modules.filter(m => m.level === 'Intermediate')
    : MODULES_INTERMEDIATE;

  const renderModuleCard = (mod) => (
    <TouchableOpacity 
      key={mod.id} 
      style={styles.moduleCard}
      activeOpacity={0.8}
      onPress={() => router.push('/chatbot-tutor')}
    >
      <View style={styles.moduleHeaderRow}>
        <View style={[styles.moduleIconBox, { backgroundColor: mod.iconColor }]}>
          {mod.iconText ? (
            <Text style={styles.moduleIconText}>{mod.iconText}</Text>
          ) : (
            <Ionicons name={mod.iconName} size={24} color="#784212" />
          )}
        </View>
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>{mod.title}</Text>
          <Text style={styles.moduleDescription}>{mod.description}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#4A628A', '#8BA3C0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${mod.progress}%` }]}
          />
        </View>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressPercent}>{mod.progress}% Complete</Text>
          <Text style={styles.progressFraction}>{mod.progressText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
            style={styles.avatar} 
          />
          <Text style={styles.appName}>SignEase</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#374B6D" />
        </TouchableOpacity>
      </View>

      <ScreenContainer 
        style={styles.container} 
        containerStyle={{ backgroundColor: '#F8F9FA' }} 
        scrollable 
        contentContainerStyle={styles.scroll}
      >
        {/* Page Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learning Path</Text>
          <Text style={styles.subtitle}>
            Master sign language at your own pace with visual modules.
          </Text>
        </View>

        {/* Beginner Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Beginner</Text>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeBlueText}>3 Lessons</Text>
            </View>
          </View>
          {MODULES_BEGINNER.map(renderModuleCard)}
        </View>

        {/* Intermediate Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Intermediate</Text>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeOrangeText}>2 Lessons</Text>
            </View>
          </View>
          {MODULES_INTERMEDIATE.map(renderModuleCard)}
        </View>

        {/* Take a Quiz Button */}
        <TouchableOpacity style={styles.quizButtonContainer} activeOpacity={0.8} onPress={() => router.push('/quiz')}>
          <LinearGradient
            colors={['#4A628A', '#8BA3C0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.quizButtonGradient}
          >
            <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.quizButtonText}>Take a Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Locked Section Indicator */}
        <View style={styles.lockedSectionRow}>
          <View style={styles.lockedLine} />
          <View style={styles.lockedIconContainer}>
            <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
          </View>
          <View style={styles.lockedLine} />
        </View>

      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D6E4F0',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374B6D',
  },
  notificationBtn: {
    padding: 4,
  },
  container: {
    paddingHorizontal: 20,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#374B6D',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeBlue: {
    backgroundColor: '#D6E6F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeBlueText: {
    color: '#4A628A',
    fontWeight: '600',
    fontSize: 12,
  },
  badgeOrange: {
    backgroundColor: '#FCE7D1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeOrangeText: {
    color: '#9E5821',
    fontWeight: '600',
    fontSize: 12,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  moduleIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A628A',
    letterSpacing: 1,
  },
  moduleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  progressSection: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A628A',
  },
  progressFraction: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  quizButtonContainer: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A628A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quizButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  lockedSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    opacity: 0.5,
  },
  lockedLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#CBD5E1',
  },
  lockedIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
});

