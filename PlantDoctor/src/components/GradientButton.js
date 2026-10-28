/**
 * GradientButton — Primary button with emerald→lime gradient or outlined variant.
 * Large touch target (≥52px height), press-scale animation.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fontSizes, fontFamily, spacing, shadows } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GradientButton({
  title,
  onPress,
  icon,
  variant = 'primary', // 'primary' | 'outlined'
  disabled = false,
  style,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const isPrimary = variant === 'primary';

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
      style={[animatedStyle, style]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={disabled ? ['#1F3A2C', '#1F3A2C'] : [colors.accentStart, colors.accentEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, disabled && styles.disabledButton, isPrimary && shadows.glow]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={disabled ? colors.textSecondary : colors.background}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles.primaryText, disabled && styles.disabledText]}>
            {title}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.button, styles.outlinedButton, disabled && styles.disabledOutlined]}>
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={disabled ? colors.textSecondary : colors.accentStart}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles.outlinedText, disabled && styles.disabledText]}>
            {title}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  outlinedButton: {
    borderWidth: 1.5,
    borderColor: colors.accentStart,
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledOutlined: {
    borderColor: colors.cardBorder,
    opacity: 0.5,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamily.semiBold,
  },
  primaryText: {
    color: colors.background,
  },
  outlinedText: {
    color: colors.accentStart,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
