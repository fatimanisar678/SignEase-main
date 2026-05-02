import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function ScreenContainer({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  containerStyle,
}) {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, containerStyle]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        >
          <View style={[styles.inner, style]}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      <View style={[styles.innerFlex, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  inner: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  innerFlex: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
