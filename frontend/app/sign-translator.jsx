import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import PrimaryButton from '@/components/PrimaryButton';
import CameraViewLive from '@/components/CameraView';
import { ML_BASE_URL } from '@/lib/api';

export default function SignTranslatorScreen() {
  const [detectedText, setDetectedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [builtSentence, setBuiltSentence] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [translatedSentence, setTranslatedSentence] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastConfidence, setLastConfidence] = useState(null);

  // Stabilisation: need 3 consecutive identical predictions + 1500ms cooldown
  const lastPredictionRef = useRef(null);
  const consecutiveRef = useRef(0);
  const lastAddedAtRef = useRef(0);

  const handleDetectToggle = () => {
    setIsTranslating((v) => !v);
    setStatusText((t) => (t === 'Idle' ? 'Starting…' : 'Idle'));
    lastPredictionRef.current = null;
    consecutiveRef.current = 0;
  };

  const languages = [
    { label: 'English', code: 'en-US' },
    { label: 'Urdu (اردو)', code: 'ur-PK' },
    { label: 'Sindhi (سنڌي)', code: 'sd-PK' },
    { label: 'Punjabi (پنجابي)', code: 'pa-PK' },
  ];

  const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'en-US') return text;
    const dictionary = {
      'HELLO': { 'ur-PK': 'سلام', 'sd-PK': 'سلام', 'pa-PK': 'ست سری اکال' },
      'A': { 'ur-PK': 'الف', 'sd-PK': 'الف', 'pa-PK': 'ੳ' },
    };
    return dictionary[text.toUpperCase()]?.[targetLang] || text;
  };

  const handleTranslateAndSpeak = async () => {
    if (!builtSentence) return;
    setIsSpeaking(true);
    const translation = await translateText(builtSentence, selectedLanguage);
    setTranslatedSentence(translation);
    Speech.speak(translation, {
      language: selectedLanguage,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleFrame = useCallback(async (base64) => {
    try {
      setStatusText('Detecting…');

      // BUG FIX: Call ML server directly. Was already correct in previous version.
      const response = await fetch(`${ML_BASE_URL}/predict-sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) throw new Error(`Server ${response.status}`);
      const data = await response.json();

      // BUG FIX: Read "prediction" and "confidence" from response.
      // Old code already read these correctly, but the ML API was returning
      // "char"/"word"/"sentence" instead — so prediction was always null.
      // Now the ML API returns the right shape, these fields work correctly.
      const prediction = data?.prediction ?? null;
      const confidence = data?.confidence ?? 0;

      if (!prediction) {
        const msg = data?.message || 'No hand';
        setStatusText(msg.includes('hand') ? 'No hand detected' : 'Low confidence');
        consecutiveRef.current = 0;
        lastPredictionRef.current = null;
        return;
      }

      // Show confidence in status bar
      setStatusText(`Detecting · ${Math.round(confidence * 100)}%`);
      setLastConfidence(Math.round(confidence * 100));

      // Stabilisation: require 3 identical consecutive frames + 1500ms cooldown
      if (prediction === lastPredictionRef.current) {
        consecutiveRef.current += 1;

        if (consecutiveRef.current >= 3) {
          const now = Date.now();
          const timeSinceLastAdd = now - lastAddedAtRef.current;

          if (timeSinceLastAdd > 1500) {
            const char = prediction;
            setBuiltSentence((prev) => prev + char);
            setDetectedText(prediction);
            lastAddedAtRef.current = now;
            consecutiveRef.current = 0; // reset after adding so we need 3 fresh frames again
          }
        }
      } else {
        lastPredictionRef.current = prediction;
        consecutiveRef.current = 1;
      }
    } catch (e) {
      setStatusText('API Error — is the Flask server running?');
      console.error('Sign detection error:', e.message);
    }
  }, []);

  const clearSentence = () => {
    setBuiltSentence('');
    setDetectedText('');
    setTranslatedSentence('');
    setLastConfidence(null);
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

      <View style={styles.languageContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langChip, selectedLanguage === lang.code && styles.langChipActive]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={[styles.langChipText, selectedLanguage === lang.code && styles.langChipTextActive]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <CameraViewLive style={styles.camera} isActive={isTranslating} onFrame={handleFrame} />

      {isTranslating && lastConfidence !== null && (
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <View style={styles.confidenceBarBg}>
            <View style={[
              styles.confidenceBarFill,
              {
                width: `${lastConfidence}%`,
                backgroundColor: lastConfidence >= 55 ? '#22c55e' : '#f59e0b',
              }
            ]} />
          </View>
          <Text style={styles.confidenceValue}>{lastConfidence}%</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <PrimaryButton
          label={isTranslating ? 'Stop Detection' : 'Start Detection'}
          onPress={handleDetectToggle}
          style={styles.mainButton}
        />
        <TouchableOpacity
          style={[styles.speakerBtn, isSpeaking && styles.speakerBtnActive]}
          onPress={handleTranslateAndSpeak}
          disabled={!builtSentence}
        >
          <Ionicons name={isSpeaking ? 'radio-button-on' : 'volume-high'} size={24} color="#FFFFFF" />
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
  camera: { width: '100%', height: 280, borderRadius: 24, overflow: 'hidden' },
  languageContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15, justifyContent: 'center' },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: 'transparent' },
  langChipActive: { backgroundColor: '#4A628A', borderColor: '#3B82F6' },
  langChipText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  langChipTextActive: { color: '#FFFFFF' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingHorizontal: 4 },
  confidenceLabel: { fontSize: 12, color: '#64748B', width: 74 },
  confidenceBarBg: { flex: 1, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  confidenceBarFill: { height: '100%', borderRadius: 3 },
  confidenceValue: { fontSize: 12, color: '#475569', width: 36, textAlign: 'right' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  mainButton: { flex: 1, backgroundColor: '#4A628A' },
  speakerBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8BA3C0', justifyContent: 'center', alignItems: 'center' },
  speakerBtnActive: { backgroundColor: '#3B82F6' },
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
