import React from 'react';
import { StyleSheet, Text } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';

export default function ChatbotTutorScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Chatbot Tutor</Text>
      <Text style={styles.subtitle}>
        In the future, this screen will host an interactive tutor to answer your sign language
        questions. For now, it is a simple placeholder.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
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
  },
});

