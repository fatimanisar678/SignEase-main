import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '@/components/ScreenContainer';
import { apiRequest } from '@/lib/api';

// Fallback data shown if backend is unreachable
const FALLBACK_BEGINNER = [
  { id: '1', title: 'Alphabet (A–Z)', description: 'Learn all 26 letters of ASL finger spelling.', progress: 0, progressText: '0/26 Letters', iconText: 'ABC', iconColor: '#CDE0F5', level: 'Beginner' },
  { id: '2', title: 'Numbers (0–9)', description: 'Count from 0 to 9 in sign language.', progress: 0, progressText: '0/10 Numbers', iconText: '#', iconColor: '#CDE0F5', level: 'Beginner' },
];

const FALLBACK_INTERMEDIATE = [
  { id: '3', title: 'Common Phrases', description: 'Greetings and essential everyday expressions.', progress: 0, progressText: '0/10 Phrases', iconName: 'chatbox-outline', iconColor: '#EBCB9F', level: 'Intermediate' },
  { id: '4', title: 'Emotions & Feelings', description: 'Express happiness, sadness, anger and more.', progress: 0, progressText: '0/8 Signs', iconName: 'happy-outline', iconColor: '#EBCB9F', level: 'Intermediate' },
];

export default function LearningScreen() {
  const [loading, setLoading] = useState(true);
  const [beginnerModules, setBeginnerModules] = useState(FALLBACK_BEGINNER);
  const [intermediateModules, setIntermediateModules] = useState(FALLBACK_INTERMEDIATE);

  useEffect(() => {
    apiRequest('/api/modules')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((m) => ({
            ...m,
            id: m._id || m.id,
            progress: 0,
            progressText: 'Not Started',
          }));
          const beginners = formatted.filter((m) => m.level === 'Beginner');
          const intermediates = formatted.filter((m) => m.level === 'Intermediate');
          if (beginners.length > 0) setBeginnerModules(beginners);
          if (intermediates.length > 0) setIntermediateModules(intermediates);
        }
      })
      .catch(() => {
        // silently use fallback modules
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A628A" />
          <Text style={styles.loadingText}>Loading modules…</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Ionicons name={mod.iconName || 'book-outline'} size={24} color="#784212" />
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
            style={[styles.progressBarFill, { width: `${mod.progress || 0}%` }]}
          />
        </View>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressPercent}>{mod.progress || 0}% Complete</Text>
          <Text style={styles.progressFraction}>{mod.progressText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=11' }} style={styles.avatar} />
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
        <View style={styles.header}>
          <Text style={styles.title}>Learning Path</Text>
          <Text style={styles.subtitle}>Master sign language at your own pace.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Beginner</Text>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeBlueText}>{beginnerModules.length} Modules</Text>
            </View>
          </View>
          {beginnerModules.map(renderModuleCard)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Intermediate</Text>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeOrangeText}>{intermediateModules.length} Modules</Text>
            </View>
          </View>
          {intermediateModules.map(renderModuleCard)}
        </View>

        <TouchableOpacity
          style={styles.quizButtonContainer}
          activeOpacity={0.8}
          onPress={() => router.push('/quiz')}
        >
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

        <View style={styles.lockedSectionRow}>
          <View style={styles.lockedLine} />
          <View style={styles.lockedIconContainer}>
            <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
          </View>
          <View style={styles.lockedLine} />
        </View>
        <Text style={styles.lockedHint}>Advanced modules unlock as you complete beginner lessons</Text>
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: '#4A628A', fontSize: 15, fontWeight: '500' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, backgroundColor: '#F8F9FA' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#D6E4F0' },
  appName: { fontSize: 18, fontWeight: '700', color: '#374B6D' },
  notificationBtn: { padding: 4 },
  container: { paddingHorizontal: 20 },
  scroll: { paddingBottom: 40 },
  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '800', color: '#374B6D', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748B', lineHeight: 22 },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  badgeBlue: { backgroundColor: '#D6E6F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeBlueText: { color: '#4A628A', fontWeight: '600', fontSize: 12 },
  badgeOrange: { backgroundColor: '#FCE7D1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeOrangeText: { color: '#9E5821', fontWeight: '600', fontSize: 12 },
  moduleCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  moduleHeaderRow: { flexDirection: 'row', marginBottom: 20 },
  moduleIconBox: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  moduleIconText: { fontSize: 16, fontWeight: '800', color: '#4A628A', letterSpacing: 1 },
  moduleInfo: { flex: 1, justifyContent: 'center' },
  moduleTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  moduleDescription: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  progressSection: { width: '100%' },
  progressBarBackground: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressPercent: { fontSize: 12, fontWeight: '600', color: '#4A628A' },
  progressFraction: { fontSize: 12, fontWeight: '500', color: '#64748B' },
  quizButtonContainer: { marginTop: 10, borderRadius: 16, overflow: 'hidden', shadowColor: '#4A628A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  quizButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  quizButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  lockedSectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, opacity: 0.5 },
  lockedLine: { height: 1, flex: 1, backgroundColor: '#CBD5E1' },
  lockedIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 },
  lockedHint: { textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 12, paddingBottom: 10 },
});
