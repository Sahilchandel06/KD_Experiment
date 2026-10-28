import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { ArrowRight, Camera, Bookmark, Share2 } from './Icons';
import { colors, radii, spacing } from '../theme';

const icons = { camera: Camera, arrow: ArrowRight, bookmark: Bookmark, share: Share2 };
export default function Button({ title, onPress, variant = 'primary', icon, style, disabled = false }) {
  const Icon = icons[icon];
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, variant === 'primary' ? styles.primary : styles.secondary, style, pressed && !disabled && styles.pressed, disabled && styles.disabled]}>
    <Text style={[styles.text, variant !== 'primary' && styles.secondaryText]}>{title}</Text>{Icon ? <Icon size={19} strokeWidth={1.8} color={variant === 'primary' ? colors.accent : colors.forest} /> : null}
  </Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 56, borderRadius: radii.pill, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, primary: { backgroundColor: colors.forest }, secondary: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper }, text: { fontSize: 15, fontWeight: '700', color: colors.white, letterSpacing: .1 }, secondaryText: { color: colors.forest }, pressed: { opacity: .8, transform: [{ scale: .985 }] }, disabled: { opacity: .48 } });
