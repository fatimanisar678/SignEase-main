// Change this to your backend URL (e.g. 10.0.2.2:5000 for Android emulator, or your machine IP for physical device)
export const API_BASE_URL = 'http://localhost:5000';

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}
