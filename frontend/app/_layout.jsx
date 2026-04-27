import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';

// Changed from (tabs) → splash so the app always starts at the splash/login screen
export const unstable_settings = {
  anchor: 'splash',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sign-translator" options={{ title: 'Sign Translator' }} />
          <Stack.Screen name="learning" options={{ title: 'Learn Sign Language' }} />
          <Stack.Screen name="practice" options={{ title: 'Practice' }} />
          <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
          <Stack.Screen name="chatbot-tutor" options={{ title: '3D Tutor' }} />
          <Stack.Screen name="numbers" options={{ title: 'Numbers' }} />
          <Stack.Screen name="phrases" options={{ title: 'Phrases' }} />
          <Stack.Screen name="profile" options={{ title: 'Profile' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
