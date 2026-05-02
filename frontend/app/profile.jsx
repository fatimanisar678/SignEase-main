import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Real data from User model: fullName, level, streakDays(Number), lessonsCompleted(Number), quizScore(String)
  const name = user?.fullName || 'Guest User';
  const level = user?.level || 'Beginner';
  const streakDays = user?.streakDays ?? 0;
  const lessonsCompleted = user?.lessonsCompleted ?? 0;
  const quizScore = user?.quizScore || '0%';
  const dailyGoal = 60;
  const dailyProgress = Math.min(lessonsCompleted * 5, dailyGoal);

  return (
    <ScreenContainer
      containerStyle={styles.safeAreaOverride}
      style={styles.container}
      scrollable
      contentContainerStyle={styles.scroll}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image source={require('../assets/images/logo.png')} style={styles.topAvatar} />
          <Text style={styles.appName}>SignEase</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.mainAvatar}>
             <Ionicons name="person" size={60} color="#3B82F6" />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.userTitle}>Sign Language Explorer</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tagBeginner}>
            <Text style={styles.tagBeginnerText}>{level}</Text>
          </View>
          <View style={styles.tagStreak}>
            <Ionicons name="flame" size={12} color="#9E5821" style={{ marginRight: 3 }} />
            <Text style={styles.tagStreakText}>{streakDays} Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>YOUR PROGRESS</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Ionicons name="school" size={28} color="#4A628A" style={styles.progressIcon} />
            <Text style={styles.progressValue}>{lessonsCompleted}</Text>
            <Text style={styles.progressLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.progressCard}>
            <Ionicons name="help-circle" size={28} color="#784212" style={styles.progressIcon} />
            <Text style={styles.progressValue}>{quizScore}</Text>
            <Text style={styles.progressLabel}>Last Quiz Score</Text>
          </View>
        </View>

        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalContent}>
            <Text style={styles.dailyGoalLabel}>Daily Goal Progress</Text>
            <Text style={styles.dailyGoalValue}>
              {dailyProgress} / <Text style={styles.dailyGoalTotal}>{dailyGoal} mins</Text>
            </Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${Math.round((dailyProgress / dailyGoal) * 100)}%` }]} />
            </View>
          </View>
          <Ionicons name="flash" size={100} color="rgba(255,255,255,0.1)" style={styles.lightningIcon} />
        </View>
      </View>

      {/* Achievements - unlocked based on real user data */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>ACHIEVEMENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
          {[
            { icon: 'medal', color: '#EAB308', label: 'First Lesson', unlocked: lessonsCompleted >= 1 },
            { icon: 'flame', color: '#F97316', label: '7-Day Streak', unlocked: streakDays >= 7 },
            { icon: 'star', color: '#3B82F6', label: 'Perfect Quiz', unlocked: quizScore === '100%' },
            { icon: 'trophy', color: '#F59E0B', label: '10 Lessons', unlocked: lessonsCompleted >= 10 },
          ].map((ach) => (
            <View key={ach.label} style={[styles.achievementCard, !ach.unlocked && styles.achievementLocked]}>
              <View style={styles.achievementIconCircle}>
                <Ionicons name={ach.icon} size={24} color={ach.unlocked ? ach.color : '#94A3B8'} />
              </View>
              <Text style={styles.achievementText}>{ach.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {[
          { icon: 'person', bg: '#EFF6FF', color: '#3B82F6', label: 'Account Settings' },
          { icon: 'notifications', bg: '#FFF7ED', color: '#F97316', label: 'Notifications' },
          { icon: 'language', bg: '#FAF5FF', color: '#9333EA', label: 'Language Settings' },
        ].map((item, idx) => (
          <React.Fragment key={item.label}>
            {idx > 0 && <View style={styles.divider} />}
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </React.Fragment>
        ))}
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
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
  safeAreaOverride: { backgroundColor: '#F8F9FA' },
  container: { paddingHorizontal: 20, paddingTop: 10 },
  scroll: { paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E2E8F0' },
  appName: { fontSize: 18, fontWeight: '700', color: '#3B82F6' },
  notificationBtn: { padding: 4 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  mainAvatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E2E8F0', borderWidth: 4, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4A628A', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F8F9FA' },
  name: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  userTitle: { fontSize: 15, color: '#475569', marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 10 },
  tagBeginner: { backgroundColor: '#DDE8F4', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  tagBeginnerText: { color: '#4A628A', fontWeight: '600', fontSize: 13 },
  tagStreak: { backgroundColor: '#FCE7D1', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  tagStreakText: { color: '#9E5821', fontWeight: '600', fontSize: 13 },
  section: { marginBottom: 30 },
  sectionHeading: { fontSize: 13, fontWeight: '700', color: '#64748B', letterSpacing: 1, marginBottom: 15 },
  progressRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  progressCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  progressIcon: { marginBottom: 12 },
  progressValue: { fontSize: 28, fontWeight: '700', color: '#2A4B6B', marginBottom: 4 },
  progressLabel: { fontSize: 12, color: '#64748B' },
  dailyGoalCard: { backgroundColor: '#4A628A', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', shadowColor: '#4A628A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  dailyGoalContent: { flex: 1, zIndex: 2 },
  dailyGoalLabel: { color: '#E2E8F0', fontSize: 13, fontWeight: '500', marginBottom: 6 },
  dailyGoalValue: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 },
  dailyGoalTotal: { fontSize: 16, fontWeight: '500', color: '#CBD5E1' },
  progressBarBackground: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, width: '80%' },
  progressBarFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  lightningIcon: { position: 'absolute', right: -10, bottom: -20, zIndex: 1 },
  achievementsScroll: { gap: 12, paddingRight: 20 },
  achievementCard: { backgroundColor: '#F1F5F9', borderRadius: 16, width: 90, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center' },
  achievementLocked: { opacity: 0.4 },
  achievementIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  achievementText: { fontSize: 11, fontWeight: '600', color: '#475569', textAlign: 'center' },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 72 },
});
