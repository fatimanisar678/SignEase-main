import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, setAuthToken } from '@/lib/api';

const TOKEN_KEY = '@signease_token';
const USER_KEY = '@signease_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persists token both in state AND in the api.js global so all requests are authenticated
  const persistToken = async (newToken) => {
    setAuthToken(newToken);          // ← wires into api.js immediately
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    }
  };

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (storedToken && storedUser) {
        setAuthToken(storedToken);   // ← restore into api.js on app restart
        setTokenState(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to load stored auth:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const signup = async (fullName, email, password) => {
    const data = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
    await persistToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  };

  const login = async (email, password) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await persistToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    setUser(null);
    await persistToken(null);
  };

  const updateUserStats = async (updates) => {
    try {
      const updatedUser = await apiRequest('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (e) {
      console.warn('Failed to update user stats:', e);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await apiRequest('/api/auth/me');
      setUser(data);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signup, login, logout, refreshUser, updateUserStats }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
