import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    router.replace('/login');
  };

  const displayUser = user || {
    fullName: 'John Doe',
    title: 'Sign Language Explorer',
    level: 'Beginner',
    streakDays: '7 Day Streak',
    lessonsCompleted: 24,
    quizScore: '92%',
    dailyProgress: 45,
    dailyGoal: 60,
  };

  return (
    <ScreenContainer 
      containerStyle={styles.safeAreaOverride} 
      style={styles.container} 
      scrollable 
      contentContainerStyle={styles.scroll}
    >
      {/* Top Navigation Header */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
            style={styles.topAvatar} 
          />
          <Text style={styles.appName}>SignEase</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Main Profile Avatar & Info */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/300?img=11' }} 
            style={styles.mainAvatar} 
          />
          <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>{displayUser.fullName}</Text>
        <Text style={styles.title}>{displayUser.title}</Text>
        
        <View style={styles.tagsRow}>
          <View style={styles.tagBeginner}>
            <Text style={styles.tagBeginnerText}>{displayUser.level}</Text>
          </View>
          <View style={styles.tagStreak}>
            <Text style={styles.tagStreakText}>{displayUser.streakDays}</Text>
          </View>
        </View>
      </View>

      {/* Your Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>YOUR PROGRESS</Text>
        
        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Ionicons name="school" size={28} color="#4A628A" style={styles.progressIcon} />
            <Text style={styles.progressValue}>{displayUser.lessonsCompleted}</Text>
            <Text style={styles.progressLabel}>Lessons Completed</Text>
          </View>
          
          <View style={styles.progressCard}>
            <Ionicons name="help-circle" size={28} color="#784212" style={styles.progressIcon} />
            <Text style={styles.progressValue}>{displayUser.quizScore}</Text>
            <Text style={styles.progressLabel}>Avg. Quiz Score</Text>
          </View>
        </View>

        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalContent}>
            <Text style={styles.dailyGoalLabel}>Daily Goal Progress</Text>
            <Text style={styles.dailyGoalValue}>
              {displayUser.dailyProgress} / <Text style={styles.dailyGoalTotal}>{displayUser.dailyGoal} mins</Text>
            </Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${(displayUser.dailyProgress / displayUser.dailyGoal) * 100}%` }]} />
            </View>
          </View>
          <Ionicons name="flash" size={100} color="rgba(255,255,255,0.1)" style={styles.lightningIcon} />
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>ACHIEVEMENTS</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconCircle}>
              <Ionicons name="medal" size={24} color="#EAB308" />
            </View>
            <Text style={styles.achievementText}>First Word</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIconCircle}>
              <Ionicons name="flame" size={24} color="#F97316" />
            </View>
            <Text style={styles.achievementText}>7-Day Fire</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIconCircle}>
              <Ionicons name="star" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.achievementText}>Perfect Quiz</Text>
          </View>

          <View style={[styles.achievementCard, styles.achievementLocked]}>
            <View style={styles.achievementIconCircle}>
              <Ionicons name="lock-closed" size={24} color="#94A3B8" />
            </View>
            <Text style={styles.achievementText}>Locked</Text>
          </View>
        </ScrollView>
      </View>

      {/* Settings Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="person" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
        
        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="notifications" size={20} color="#F97316" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#FAF5FF' }]}>
            <Ionicons name="language" size={20} color="#9333EA" />
          </View>
          <Text style={styles.menuText}>Languages</Text>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="log-out" size={20} color="#EF4444" style={{ marginLeft: 4 }} />
          </View>
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={20} color="#FCA5A5" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeAreaOverride: {
    backgroundColor: '#F8F9FA', // Light overall background
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
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  notificationBtn: {
    padding: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  mainAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E2E8F0',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A628A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F8F9FA',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tagBeginner: {
    backgroundColor: '#DDE8F4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagBeginnerText: {
    color: '#4A628A',
    fontWeight: '600',
    fontSize: 13,
  },
  tagStreak: {
    backgroundColor: '#FCE7D1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagStreakText: {
    color: '#9E5821',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A628A',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressIcon: {
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2A4B6B',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  dailyGoalCard: {
    backgroundColor: '#4A628A',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#4A628A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  dailyGoalContent: {
    flex: 1,
    zIndex: 2,
  },
  dailyGoalLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  dailyGoalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  dailyGoalTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#CBD5E1',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    width: '60%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  lightningIcon: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    zIndex: 1,
  },
  achievementsScroll: {
    gap: 12,
    paddingRight: 20, // To ensure scrolling doesn't cut off abruptly
  },
  achievementCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    width: 90,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  achievementText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72, // Aligns divider with text
  },
});

