import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PrimaryButton({ label, onPress, variant = 'primary', style, loading, disabled }) {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? '#022c22' : '#f9fafb'} />
      ) : (
        <Text style={[styles.label, isSecondary ? styles.secondaryLabel : styles.primaryLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: '#22c55e',
  },
  disabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#f9fafb',
  },
  secondaryLabel: {
    color: '#022c22',
  },
});

