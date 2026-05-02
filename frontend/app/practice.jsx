import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

// ─── Configure your ML server IP here ─────────────────────────────────────────
// Android emulator → 10.0.2.2 maps to your PC's localhost
// iOS simulator   → localhost works fine
// Physical device → replace with your PC's local network IP, e.g. 192.168.1.10
const ML_HOST =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';
const API_URL = `${ML_HOST}/predict-sign`;
// ──────────────────────────────────────────────────────────────────────────────

export default function PracticeScreen() {
  const { targetLetter = 'A' } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modelError, setModelError] = useState(false);
  const cameraRef = useRef(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isSuccess || !permission?.granted || modelError) return;

    const interval = setInterval(async () => {
      if (!cameraRef.current || processingRef.current || !mountedRef.current) return;

      try {
        processingRef.current = true;

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.15,
          base64: true,
          skipProcessing: true,
        });

        if (!photo?.base64) {
          processingRef.current = false;
          return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: photo.base64 }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error(`Server responded ${response.status}`);

        const data = await response.json();

        if (mountedRef.current && data.prediction) {
          setPrediction(data.prediction);
          if (data.prediction.toUpperCase() === targetLetter.toUpperCase()) {
            setIsSuccess(true);
            Speech.speak('Perfect! You got it right.', { rate: 1.0 });
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('ML request timed out');
        } else {
          console.log('ML API error:', error.message);
          // After 3 consecutive failures, show a friendly message instead of crashing
          setModelError(true);
        }
      } finally {
        processingRef.current = false;
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [permission, isSuccess, targetLetter, modelError]);

  // ── Permission not yet determined ──────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A628A" />
      </View>
    );
  }

  // ── Permission denied ──────────────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="camera-outline" size={64} color="#9CA3AF" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.subtitle}>We need camera access to see your signs!</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color="#374B6D" />
        </TouchableOpacity>
        <Text style={styles.topHeaderText}>Practice</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.container}>
        {/* Instruction */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>Show the sign for</Text>
          <Text style={styles.targetLetter}>{targetLetter}</Text>
        </View>

        {/* Camera */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            animateShutter={false}
          >
            <View style={styles.overlay}>
              {isSuccess ? (
                <View style={styles.successOverlay}>
                  <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
                  <Text style={styles.successText}>Perfect!</Text>
                </View>
              ) : (
                <View style={styles.scanningOverlay}>
                  <View style={styles.scanCorners}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>
                </View>
              )}
            </View>
          </CameraView>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          {isSuccess ? (
            <LinearGradient
              colors={['#4A628A', '#8BA3C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <TouchableOpacity
                style={{ width: '100%', alignItems: 'center' }}
                onPress={() => router.back()}
              >
                <Text style={styles.continueButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : modelError ? (
            <View style={styles.errorBox}>
              <Ionicons name="wifi-outline" size={28} color="#EF4444" style={{ marginBottom: 6 }} />
              <Text style={styles.errorTitle}>ML Server Unreachable</Text>
              <Text style={styles.errorDesc}>
                Make sure the Flask ML server is running on port 8000 and your device is on
                the same network. Update ML_HOST in practice.jsx if needed.
              </Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => { setModelError(false); setPrediction(null); }}
              >
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.feedbackTitle}>AI is watching…</Text>
              {prediction ? (
                <Text style={styles.predictionText}>
                  I see: <Text style={styles.predictionHighlight}>{prediction}</Text>
                </Text>
              ) : (
                <Text style={styles.predictionText}>Position your hand in the frame</Text>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: '800', color: '#374B6D', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  permissionButton: { backgroundColor: '#4A628A', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  permissionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  topHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12,
  },
  iconButton: { padding: 4 },
  topHeaderText: { fontSize: 18, fontWeight: '700', color: '#374B6D' },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 },
  instructionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  instructionText: { fontSize: 16, color: '#64748B', marginBottom: 4 },
  targetLetter: { fontSize: 48, fontWeight: '800', color: '#374B6D' },
  cameraContainer: {
    width: '100%', aspectRatio: 3 / 4, borderRadius: 30,
    overflow: 'hidden', backgroundColor: '#E5E7EB', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanningOverlay: { width: '80%', height: '80%', justifyContent: 'center', alignItems: 'center' },
  scanCorners: { width: '100%', height: '100%', position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: 'rgba(255,255,255,0.6)' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
  successOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center', alignItems: 'center',
  },
  successText: { fontSize: 28, fontWeight: '800', color: '#22C55E', marginTop: 10 },
  feedbackSection: { alignItems: 'center' },
  feedbackTitle: { fontSize: 14, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  predictionText: { fontSize: 20, color: '#4B5563', fontWeight: '500' },
  predictionHighlight: { fontSize: 24, fontWeight: '800', color: '#3B82F6' },
  continueButton: { width: '100%', borderRadius: 16, paddingVertical: 18 },
  continueButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  errorBox: {
    backgroundColor: '#FFF5F5', borderRadius: 16, padding: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#FECACA', width: '100%',
  },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#EF4444', marginBottom: 6 },
  errorDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 12 },
  retryBtn: { backgroundColor: '#4A628A', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
