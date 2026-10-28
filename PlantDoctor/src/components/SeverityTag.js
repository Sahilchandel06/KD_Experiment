import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';
const map = { healthy: colors.healthy, warning: colors.warning, critical: colors.critical };
export default function SeverityTag({ level = 'warning', label }) { const tint = map[level] || map.warning; return <View style={[styles.tag, { backgroundColor: `${tint}18` }]}><View style={[styles.dot, { backgroundColor: tint }]} /><Text style={[styles.text, { color: tint }]}>{label || level}</Text></View>; }
const styles = StyleSheet.create({ tag: { minHeight: 30, paddingHorizontal: spacing.sm, borderRadius: radii.xs, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }, dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 }, text: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: .7 } });
