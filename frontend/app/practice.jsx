import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Use 10.0.2.2 for Android emulator to access PC localhost, otherwise use localhost or actual IP
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/predict-sign' : 'http://localhost:8000/predict-sign';

export default function PracticeScreen() {
  const { targetLetter = 'A' } = useLocalSearchParams(); // Defaults to 'A' if not passed
  const [permission, requestPermission] = useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
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
    // If the user successfully signs the letter, stop processing
    if (isSuccess || !permission?.granted) return;

    const interval = setInterval(async () => {
      if (!cameraRef.current || processingRef.current || !mountedRef.current) return;
      
      try {
        processingRef.current = true;
        
        // Take a low-quality picture to send to the ML model fast
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.1,
          base64: true,
          skipProcessing: true,
        });

        if (!photo || !photo.base64) {
          processingRef.current = false;
          return;
        }

        // Send to Flask ML API
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageBase64: photo.base64,
          }),
        });

        const data = await response.json();
        
        if (mountedRef.current && data.prediction) {
          setPrediction(data.prediction);
          // Check if the prediction matches our target letter
          if (data.prediction.toUpperCase() === targetLetter.toUpperCase()) {
            setIsSuccess(true);
            // Here you could also call a backend API to save progress
          }
        }
      } catch (error) {
        console.log('Error processing frame:', error);
      } finally {
        processingRef.current = false;
      }
    }, 1500); // Check every 1.5 seconds

    return () => clearInterval(interval);
  }, [permission, isSuccess, targetLetter]);

  if (!permission) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#4A628A" /></View>;
  }

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
        
        {/* Instruction Header */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>Show the sign for</Text>
          <Text style={styles.targetLetter}>{targetLetter}</Text>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera} 
            facing="front"
            animateShutter={false}
          >
            {/* Overlay for success/scanning */}
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

        {/* Feedback Section */}
        <View style={styles.feedbackSection}>
          {!isSuccess ? (
            <>
              <Text style={styles.feedbackTitle}>AI is watching...</Text>
              {prediction ? (
                <Text style={styles.predictionText}>I see: <Text style={styles.predictionHighlight}>{prediction}</Text></Text>
              ) : (
                <Text style={styles.predictionText}>Position your hand in the frame</Text>
              )}
            </>
          ) : (
            <LinearGradient
              colors={['#4A628A', '#8BA3C0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButton}
            >
              <TouchableOpacity style={{ width: '100%', alignItems: 'center' }} onPress={() => router.back()}>
                <Text style={styles.continueButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#374B6D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#4A628A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  iconButton: {
    padding: 4,
  },
  topHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374B6D',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  targetLetter: {
    fontSize: 48,
    fontWeight: '800',
    color: '#374B6D',
    marginTop: 4,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanCorners: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22C55E',
    marginTop: 10,
  },
  feedbackSection: {
    width: '100%',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 20,
    color: '#4B5563',
    fontWeight: '500',
  },
  predictionHighlight: {
    fontSize: 24,
    fontWeight: '800',
    color: '#3B82F6',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#4A628A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

