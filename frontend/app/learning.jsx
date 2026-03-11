import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import { apiRequest } from '@/lib/api';

const FALLBACK_LESSONS = [
  { id: '1', title: 'Basics: Alphabet (A–Z)', level: 'Beginner', duration: '10 min' },
  { id: '2', title: 'Common Greetings', level: 'Beginner', duration: '8 min' },
  { id: '3', title: 'Numbers 1–20', level: 'Beginner', duration: '12 min' },
  { id: '4', title: 'Everyday Phrases', level: 'Intermediate', duration: '15 min' },
  { id: '5', title: 'Emotions & Expressions', level: 'Intermediate', duration: '14 min' },
  { id: '6', title: 'Conversation Practice', level: 'Advanced', duration: '20 min' },
];

export default function LearningScreen() {
  const [lessons, setLessons] = useState(FALLBACK_LESSONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/lessons')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLessons(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ScreenContainer style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      <Text style={styles.title}>Sign Language Lessons</Text>
      <Text style={styles.subtitle}>
        Follow the curated path below or jump into any lesson you like.
      </Text>

      <View style={styles.list}>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={styles.lessonCard}>
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonBadge}>{lesson.level}</Text>
            </View>
            <Text style={styles.lessonMeta}>{lesson.duration} • 5 short activities</Text>
          </View>
        ))}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  list: {
    marginTop: 20,
    gap: 12,
  },
  lessonCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#111827',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    flex: 1,
    marginRight: 8,
  },
  lessonBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#22c55e',
    backgroundColor: '#022c22',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lessonMeta: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

