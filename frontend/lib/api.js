import { Platform } from 'react-native';

// ─── CHANGE THIS to your PC's local IP when running on a phone/device ───────
// On emulator: Android uses 10.0.2.2, iOS simulator uses localhost
// On a real device: use your computer's Wi-Fi IP (e.g. 192.168.1.100)
const LAN_IP = process.env.EXPO_PUBLIC_API_IP || '10.48.106.111';
const PORT = process.env.EXPO_PUBLIC_API_PORT || '5000';

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator: 10.0.2.2 maps to localhost on your PC
    const isEmulator = !__DEV__ || true; // assume device in dev; change if needed
    return `http://${LAN_IP}:${PORT}`;
  }
  if (Platform.OS === 'ios') {
    return `http://${LAN_IP}:${PORT}`;
  }
  // Web
  return `http://${LAN_IP}:${PORT}`;
};

export const API_BASE_URL = getApiBaseUrl();

// ML Flask API (runs on port 8000)
const ML_PORT = process.env.EXPO_PUBLIC_ML_PORT || '8000';
export const ML_BASE_URL = `http://${LAN_IP}:${ML_PORT}`;

let _token = null;

export function setAuthToken(token) {
  _token = token;
}

export function getAuthToken() {
  return _token;
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}