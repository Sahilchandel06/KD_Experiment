import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';
export default function Card({ children, style, compact = false }) { return <View style={[styles.card, compact && styles.compact, style]}>{children}</View>; }
const styles = StyleSheet.create({ card: { borderWidth: 1, borderColor: colors.line, borderRadius: radii.md, backgroundColor: colors.paper, padding: spacing.lg }, compact: { padding: spacing.md, borderRadius: radii.sm } });
