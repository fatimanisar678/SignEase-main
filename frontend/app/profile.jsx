import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const displayUser = user || {
    fullName: 'Guest',
    level: 'Beginner',
    streakDays: 0,
    lessonsCompleted: 0,
    quizScore: '0%',
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{displayUser.fullName?.charAt(0) || 'G'}</Text>
      </View>
      <Text style={styles.name}>{displayUser.fullName}</Text>
      <Text style={styles.level}>{displayUser.level} signer</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>{displayUser.lessonsCompleted} lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Quiz score</Text>
          <Text style={styles.statValue}>{displayUser.quizScore}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCardWide}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{displayUser.streakDays} days in a row</Text>
        </View>
      </View>

      {user && (
        <PrimaryButton label="Log Out" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
    textAlign: 'center',
  },
  level: {
    marginTop: 4,
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#111827',
  },
  statCardWide: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#022c22',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  logoutButton: {
    marginTop: 32,
  },
});

