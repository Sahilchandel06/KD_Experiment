import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
export default function ConfidenceBar({ value = 0 }) { return <View style={styles.row}><View style={styles.track}>{Array.from({ length: 10 }, (_, i) => <View key={i} style={[styles.segment, i < Math.round(value / 10) && styles.filled]} />)}</View><Text style={styles.value}>{Math.round(value)}% match</Text></View>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, track: { flex: 1, flexDirection: 'row', gap: 3, height: 8 }, segment: { flex: 1, borderRadius: 3, backgroundColor: colors.line }, filled: { backgroundColor: colors.forest }, value: { color: colors.ink, fontSize: 12, fontWeight: '700' } });
