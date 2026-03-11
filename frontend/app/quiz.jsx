import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';

const QUESTION = {
  id: 'q1',
  prompt: 'What is the correct handshape for the sign representing the letter "A" in ASL?',
  options: [
    'Open hand with all fingers spread apart',
    'Closed fist with thumb resting along the side of the index finger',
    'Index and middle finger extended, other fingers folded',
    'Flat hand with all fingers together and thumb tucked in',
  ],
  correctIndex: 1,
};

export default function QuizScreen() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = () => {
    if (selectedIndex == null) {
      setFeedback('Please choose an option to submit.');
      return;
    }

    if (selectedIndex === QUESTION.correctIndex) {
      setFeedback('Correct! Nice work, keep going.');
    } else {
      setFeedback('Not quite. Review the alphabet lesson and try again.');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Quick Quiz</Text>
      <Text style={styles.subtitle}>Check your understanding with a short question.</Text>

      <View style={styles.card}>
        <Text style={styles.prompt}>{QUESTION.prompt}</Text>

        <View style={styles.options}>
          {QUESTION.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            return (
              <View
                key={option}
                style={[styles.option, isSelected && styles.optionSelected]}
                onStartShouldSetResponder={() => {
                  setSelectedIndex(index);
                  setFeedback(null);
                  return true;
                }}
              >
                <View style={[styles.bullet, isSelected && styles.bulletSelected]} />
                <Text style={styles.optionText}>{option}</Text>
              </View>
            );
          })}
        </View>

        <PrimaryButton label="Submit Answer" onPress={handleSubmit} style={styles.button} />

        {feedback && <Text style={styles.feedback}>{feedback}</Text>}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
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
  card: {
    marginTop: 24,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#111827',
  },
  prompt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  options: {
    marginTop: 16,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#1e293b',
  },
  bullet: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#4b5563',
    marginRight: 10,
  },
  bulletSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#e5e7eb',
  },
  button: {
    marginTop: 16,
  },
  feedback: {
    marginTop: 10,
    fontSize: 14,
    color: '#e5e7eb',
  },
});

