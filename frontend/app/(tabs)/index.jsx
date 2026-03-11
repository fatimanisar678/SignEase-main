import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';

export default function HomeDashboardScreen() {
  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <ScreenContainer style={styles.container} scrollable contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, SignEase Learner 👋</Text>
        <Text style={styles.subtitle}>What would you like to work on today?</Text>
      </View>

      <View style={styles.cardGrid}>
        <TouchableOpacity
          style={[styles.card, styles.cardAccentPrimary]}
          onPress={() => handleNavigate('/sign-translator')}
        >
          <Text style={styles.cardTitle}>Sign Translator</Text>
          <Text style={styles.cardDescription}>
            Point your camera and see real-time text from signs.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardAccentSecondary]}
          onPress={() => handleNavigate('/learning')}
        >
          <Text style={styles.cardTitle}>Learn Sign Language</Text>
          <Text style={styles.cardDescription}>
            Structured lessons to build your signing foundations.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleNavigate('/practice')}
        >
          <Text style={styles.cardTitle}>Practice</Text>
          <Text style={styles.cardDescription}>
            Short daily exercises to keep skills sharp.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleNavigate('/quiz')}
        >
          <Text style={styles.cardTitle}>Quiz</Text>
          <Text style={styles.cardDescription}>
            Test your knowledge with quick quizzes.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleNavigate('/chatbot-tutor')}
        >
          <Text style={styles.cardTitle}>Chatbot Tutor</Text>
          <Text style={styles.cardDescription}>
            Ask questions and get instant sign language help.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleNavigate('/profile')}
        >
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDescription}>
            View your progress, streaks, and quiz scores.
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  scroll: {
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f9fafb',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9ca3af',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#0b1120',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardAccentPrimary: {
    backgroundColor: '#1e293b',
    borderColor: '#2563eb',
  },
  cardAccentSecondary: {
    backgroundColor: '#022c22',
    borderColor: '#22c55e',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
});

