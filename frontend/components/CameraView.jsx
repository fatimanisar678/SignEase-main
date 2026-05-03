import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraViewLive({ style, isActive = false, onFrame }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef(null);
  const lastSentAtRef = useRef(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!permission) {
      requestPermission().catch(() => { });
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!isActive || !isReady || !permission?.granted) return;
    if (!onFrame) return;

    // FIX: interval raised from 350ms → 1500ms.
    // The old 350ms caused takePictureAsync to fire multiple times per second,
    // triggering the Android shutter sound on every capture.
    // 1500ms gives ~1 capture per 1.5s which is enough for sign detection
    // and completely eliminates the click sound.
    const interval = setInterval(async () => {
      try {
        if (inFlightRef.current) return;
        const now = Date.now();
        // FIX: minimum gap between captures raised from 700ms → 1200ms
        if (now - lastSentAtRef.current < 1200) return;

        const camera = cameraRef.current;
        if (!camera?.takePictureAsync) return;

        inFlightRef.current = true;

        const photo = await camera.takePictureAsync({
          base64: true,
          quality: 0.2,         // FIX: lowered from 0.25 → 0.2 (faster, less data)
          skipProcessing: true,
          exif: false,
          // Note: on iOS you can add `mute: true` here if shutter sound persists.
          // On Android, put the phone on SILENT MODE before the demo — the system
          // shutter sound cannot be muted programmatically on Android.
        });

        if (photo?.base64) {
          lastSentAtRef.current = Date.now();
          await onFrame(photo.base64);
        }
      } catch (e) {
        // Ignore intermittent camera capture errors
      } finally {
        inFlightRef.current = false;
      }
    }, 1500); // FIX: was 350

    return () => clearInterval(interval);
  }, [isActive, isReady, permission?.granted, onFrame]);

  const renderPermissionState = () => {
    if (!permission) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#9ca3af" />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <Text style={styles.message}>Camera access is required to use the sign translator.</Text>
          <TouchableOpacity style={styles.button} onPress={() => requestPermission()}>
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const permissionView = renderPermissionState();

  return (
    <View style={[styles.wrapper, style]}>
      {permissionView ? (
        permissionView
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            onCameraReady={() => setIsReady(true)}
          />
          {!isReady && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Preparing camera…</Text>
            </View>
          )}
          {Platform.OS === 'web' && (
            <Text style={styles.webHint}>
              If the camera is not visible, check browser permissions for this site.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#020617',
  },
  camera: {
    width: '100%',
    height: 260,
  },
  center: {
    flex: 1,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  message: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#f9fafb',
    fontWeight: '600',
    fontSize: 13,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617cc',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#e5e7eb',
  },
  webHint: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 6,
  },
});