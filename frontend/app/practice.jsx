import React from 'react';
import { StyleSheet, Text } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';

export default function PracticeScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <Text style={styles.subtitle}>
        Short, focused exercises will appear here. For now this is a placeholder screen.
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

