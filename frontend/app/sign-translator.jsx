import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';

export default function SignTranslatorScreen() {
  const [detectedText, setDetectedText] = useState('Detected text will appear here...');

  const handleDetectSign = () => {
    setDetectedText('Hello, nice to meet you!');
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Sign Translator</Text>
      <Text style={styles.subtitle}>
        Use your camera to translate sign language into text in real time.
      </Text>

      <View style={styles.cameraPlaceholder}>
        <Text style={styles.cameraText}>Camera Preview</Text>
      </View>

      <PrimaryButton label="Detect Sign" onPress={handleDetectSign} style={styles.button} />

      <View style={styles.outputBox}>
        <Text style={styles.outputLabel}>Detected Text</Text>
        <Text style={styles.outputText}>{detectedText}</Text>
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
  cameraPlaceholder: {
    marginTop: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4b5563',
    backgroundColor: '#020617',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: {
    color: '#6b7280',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  outputBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#111827',
  },
  outputLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 6,
  },
  outputText: {
    fontSize: 16,
    color: '#e5e7eb',
  },
});

