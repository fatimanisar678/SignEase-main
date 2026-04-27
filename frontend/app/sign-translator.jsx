import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';
import CameraViewLive from '@/components/CameraView';
import { apiRequest } from '@/lib/api';

export default function SignTranslatorScreen() {
  const [detectedText, setDetectedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [builtSentence, setBuiltSentence] = useState('');
  
  const lastPredictionRef = useRef(null);
  const lastCallAtRef = useRef(0);
  const consecutiveRef = useRef(0);

  const handleDetectToggle = () => {
    setIsTranslating((v) => !v);
    setStatusText((t) => (t === 'Idle' ? 'Starting…' : 'Idle'));
  };

  const speak = (text) => {
    if (!text) return;
    Speech.speak(text);
  };

  const handleFrame = useCallback(async (base64) => {
    const now = Date.now();
    if (now - lastCallAtRef.current < 900) return;
    lastCallAtRef.current = now;

    try {
      setStatusText('Detecting…');
      const data = await apiRequest('/api/predict-sign', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const prediction = data?.prediction ?? null;
      if (!prediction) {
        setStatusText('No hand');
        consecutiveRef.current = 0;
        return;
      }

      setStatusText('Live');
      
      // Basic word building logic: if the same prediction persists for 2 frames, add it
      if (prediction === lastPredictionRef.current) {
        consecutiveRef.current += 1;
        if (consecutiveRef.current === 2) {
          const char = prediction === ' ' ? ' ' : prediction;
          setBuiltSentence((prev) => prev + char);
          setDetectedText(prediction);
          // Optional: Speak character
          // Speech.speak(char);
        }
      } else {
        lastPredictionRef.current = prediction;
        consecutiveRef.current = 0;
      }
    } catch (e) {
      setStatusText('API Error');
    }
  }, []);

  const clearSentence = () => {
    setBuiltSentence('');
    setDetectedText('');
  };

  const backspace = () => {
    setBuiltSentence((prev) => prev.slice(0, -1));
  };

  return (
    <ScreenContainer scrollable containerStyle={styles.safeArea} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign Translator</Text>
        <View style={[styles.statusBadge, isTranslating && styles.statusBadgeActive]}>
          <Text style={styles.statusBadgeText}>{statusText}</Text>
        </View>
      </View>
      
      <Text style={styles.subtitle}>
        Translate signs into words and build sentences in real time.
      </Text>

      <CameraViewLive style={styles.camera} isActive={isTranslating} onFrame={handleFrame} />

      <View style={styles.actionRow}>
        <PrimaryButton
          label={isTranslating ? 'Stop' : 'Start'}
          onPress={handleDetectToggle}
          style={styles.mainButton}
        />
        <TouchableOpacity style={styles.speakerBtn} onPress={() => speak(builtSentence)}>
          <Ionicons name="volume-high" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.outputBox}>
        <View style={styles.outputHeader}>
          <Text style={styles.outputLabel}>Current Sentence</Text>
          <View style={styles.outputActions}>
            <TouchableOpacity onPress={backspace} style={styles.miniActionBtn}>
              <Ionicons name="backspace-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearSentence} style={styles.miniActionBtn}>
              <Ionicons name="trash-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.sentenceContainer} contentContainerStyle={styles.sentenceContent}>
          <Text style={styles.sentenceText}>
            {builtSentence || <Text style={styles.placeholderText}>Your translated text will appear here…</Text>}
          </Text>
        </ScrollView>
        {detectedText ? (
          <View style={styles.detectedBadge}>
            <Text style={styles.detectedBadgeText}>Last: {detectedText}</Text>
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F8F9FA' },
  container: { paddingHorizontal: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  statusBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeActive: { backgroundColor: '#DCFCE7' },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 20 },
  camera: { width: '100%', height: 300, borderRadius: 24, overflow: 'hidden' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  mainButton: { flex: 1, backgroundColor: '#4A628A' },
  speakerBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8BA3C0', justifyContent: 'center', alignItems: 'center' },
  outputBox: { marginTop: 24, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 40 },
  outputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  outputLabel: { fontSize: 13, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  outputActions: { flexDirection: 'row', gap: 12 },
  miniActionBtn: { padding: 4 },
  sentenceContainer: { minHeight: 80, maxHeight: 150 },
  sentenceContent: { paddingVertical: 5 },
  sentenceText: { fontSize: 22, fontWeight: '600', color: '#1E293B', lineHeight: 30 },
  placeholderText: { color: '#CBD5E1', fontWeight: '400', fontSize: 16 },
  detectedBadge: { position: 'absolute', bottom: -10, right: 20, backgroundColor: '#4A628A', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  detectedBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});

