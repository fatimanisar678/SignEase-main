import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraViewLive({ style, isActive = false, onFrame }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!permission) {
      requestPermission().catch(() => { });
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!isActive || !isReady || !permission?.granted) return;
    if (!onFrame) return;

    const interval = setInterval(async () => {
      try {
        if (inFlightRef.current) return;

        const camera = cameraRef.current;
        if (!camera?.takePictureAsync) return;

        inFlightRef.current = true;

        const photo = await camera.takePictureAsync({
          base64: true,
          // FIX 1: Raised quality from 0.2 → 0.5
          // At 0.2 the JPEG was too compressed — cv2.imdecode on the server
          // sometimes returned None (corrupt image), and MediaPipe failed to
          // detect hands in the blurry result even when it did decode.
          quality: 0.5,
          // FIX 2: Removed skipProcessing: true
          // skipProcessing skips expo's orientation correction, meaning the
          // image was sent to the server rotated 90° or 270° depending on
          // how the user holds the phone. MediaPipe cannot detect hands in
          // rotated images. With skipProcessing removed, expo normalises the
          // orientation before encoding, so the server always gets an upright image.
          exif: false,
        });

        if (photo?.base64) {
          await onFrame(photo.base64);
        }
      } catch (e) {
        // Ignore intermittent camera errors
      } finally {
        inFlightRef.current = false;
      }
    }, 1500);

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
