/**
 * ScreenContainer — Wraps every screen with safe area, dark background,
 * and proper status bar styling.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export default function ScreenContainer({ children, style }) {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <StatusBar style="dark" />
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
});
