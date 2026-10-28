/**
 * ProgressBar — Animated horizontal bar showing a prediction percentage.
 * Used for the top-3 predictions list.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii, fontSizes, fontFamily, spacing } from '../theme';

export default function ProgressBar({
  label,
  percentage = 0,
  isTop = false,
  delay = 0,
  color,
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      width.value = withTiming(percentage, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const barColor = color || (isTop ? colors.accentStart : colors.textSecondary);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, isTop && styles.topLabel]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.percentage, { color: barColor }]}>
          {percentage.toFixed(1)}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.bar, animatedBarStyle, { backgroundColor: barColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  topLabel: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
  },
  percentage: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamily.semiBold,
  },
  track: {
    height: 6,
    backgroundColor: colors.cardBorder,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
