import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';
import CameraViewLive from '@/components/CameraView';
import { apiRequest } from '@/lib/api';

export default function SignTranslatorScreen() {
  const [detectedText, setDetectedText] = useState('Point the camera at a hand sign…');
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const lastPredictionRef = useRef(null);
  const lastCallAtRef = useRef(0);

  const handleDetectToggle = () => {
    setIsTranslating((v) => !v);
    setStatusText((t) => (t === 'Idle' ? 'Starting…' : 'Idle'));
  };

  const handleFrame = useCallback(async (base64) => {
    // extra throttle at screen-level (in addition to CameraView’s capture throttle)
    const now = Date.now();
    if (now - lastCallAtRef.current < 800) return;
    lastCallAtRef.current = now;

    try {
      setStatusText('Detecting…');
      const data = await apiRequest('/api/predict-sign', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const prediction = data?.prediction ?? null;
      if (!prediction) {
        setStatusText('No hand detected');
        return;
      }

      if (prediction !== lastPredictionRef.current) {
        lastPredictionRef.current = prediction;
        setDetectedText(prediction === ' ' ? '(SPACE)' : prediction);
      }
      setStatusText('Live');
    } catch (e) {
      setStatusText('Network/API error');
    }
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Sign Translator</Text>
      <Text style={styles.subtitle}>
        Use your camera to translate sign language into text in real time.
      </Text>

      <CameraViewLive style={styles.camera} isActive={isTranslating} onFrame={handleFrame} />

      <PrimaryButton
        label={isTranslating ? 'Stop Detecting' : 'Start Detecting'}
        onPress={handleDetectToggle}
        style={styles.button}
      />

      <View style={styles.outputBox}>
        <Text style={styles.outputLabel}>Detected</Text>
        <Text style={styles.outputText}>{detectedText}</Text>
        <Text style={styles.statusText}>Status: {statusText}</Text>
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
  },
  camera: {
    marginTop: 24,
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
  statusText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
});

