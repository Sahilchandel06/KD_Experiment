import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';
export default function Chip({ children, active = false, dot = false, style }) {
  return <View style={[styles.chip, active && styles.active, style]}>{dot ? <View style={styles.dot} /> : null}<Text style={[styles.text, active && styles.activeText]}>{children}</Text></View>;
}
const styles = StyleSheet.create({ chip: { minHeight: 34, borderRadius: radii.xs, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sage }, active: { backgroundColor: colors.forest }, text: { color: colors.forest, fontSize: 12, fontWeight: '700' }, activeText: { color: colors.white }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.healthy, marginRight: spacing.sm } });
