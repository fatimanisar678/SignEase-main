import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import { useAuth } from '@/context/AuthContext';

export default function HomeDashboardScreen() {
  const { user } = useAuth();

  const handleNavigate = (path) => {
    router.push(path);
  };

  // Get real user data or defaults
  const fullName = user?.fullName || 'Guest';
  const firstName = fullName.split(' ')[0];
  const level = user?.level || 'Beginner';
  const streakDays = user?.streakDays || 0;
  const lessonsCompleted = user?.lessonsCompleted || 0;
  const quizScore = user?.quizScore || '0%';

  return (
    <ScreenContainer 
      containerStyle={styles.safeAreaOverride} 
      style={styles.container} 
      scrollable 
      contentContainerStyle={styles.scroll}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.userInfo} onPress={() => handleNavigate('/profile')}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoIcon}
          />
          <Text style={styles.appName}>SignEase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color="#8BA3C0" />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {firstName}!</Text>
        <Text style={styles.subtitle}>Ready to continue your sign language journey today?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelLabel}>Your Level</Text>
            <View style={styles.beginnerBadge}>
              <Text style={styles.beginnerText}>{level}</Text>
            </View>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelValue}>Exp: {lessonsCompleted * 10}</Text>
            <Text style={styles.xpText}>{lessonsCompleted} Lessons Done</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(lessonsCompleted * 10, 100)}%` }]} />
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <View style={styles.streakValueContainer}>
              <Text style={styles.streakValue}>{streakDays}</Text>
              <Text style={styles.streakDays}>days</Text>
            </View>
          </View>
          <View style={styles.fireIconContainer}>
            <Ionicons name="flame" size={24} color="#784212" />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsList}>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => handleNavigate('/sign-translator')} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#CDE0F5' }]}>
              <Ionicons name="videocam" size={24} color="#4A628A" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Start Translation</Text>
              <Text style={styles.actionSubtitle}>Instant sign-to-text conversion</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => handleNavigate('/learning')} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#CDE0F5' }]}>
              <Ionicons name="school" size={24} color="#4A628A" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Learn Sign Language</Text>
              <Text style={styles.actionSubtitle}>Practice your vocabulary</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => handleNavigate('/quiz')} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="trophy" size={24} color="#D97706" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Test Your Skills</Text>
              <Text style={styles.actionSubtitle}>Last score: {quizScore}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => handleNavigate('/chatbot-tutor')} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FADEC9' }]}>
              <Ionicons name="chatbubbles" size={24} color="#784212" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Chat with AI Tutor</Text>
              <Text style={styles.actionSubtitle}>Get help with your learning</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

        </View>
      </View>


      {/* Picked for you */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Picked for you</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pickedCard}>
          <View style={styles.pickedContent}>
            <Text style={styles.expertTip}>EXPERT TIP</Text>
            <Text style={styles.pickedTitle}>Mastering Facial Expressions</Text>
            <Text style={styles.pickedSubtitle}>Why eyebrows matter in ASL syntax.</Text>
          </View>
          <View style={styles.pickedImageContainer}>
            {/* Dummy representation of the hand image using icon or color */}
            <Ionicons name="hand-right" size={80} color="#C4B5A5" style={{ transform: [{ rotate: '15deg' }], marginTop: 20 }} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeAreaOverride: {
    backgroundColor: '#F8F9FA', // Very light grey/white background
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scroll: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6', // Brighter blue
  },
  notificationBtn: {
    padding: 4,
  },
  header: {
    marginBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  statsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  beginnerBadge: {
    backgroundColor: '#D6E6F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beginnerText: {
    color: '#4A628A',
    fontSize: 12,
    fontWeight: '600',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  levelValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A4B6B',
  },
  xpText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8BA3C0',
    borderRadius: 4,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#784212',
  },
  streakDays: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  fireIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FADEC9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16, // Default margin for sections without See All
  },
  seeAllText: {
    color: '#4A628A',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  pickedCard: {
    backgroundColor: '#446688', // Dark slate blue
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 160,
  },
  pickedContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#557A9D',
  },
  expertTip: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D6E6F5',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pickedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 26,
  },
  pickedSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  pickedImageContainer: {
    width: '40%',
    backgroundColor: '#1E2F40', // Darker blue
    justifyContent: 'center',
    alignItems: 'center',
  },
});

