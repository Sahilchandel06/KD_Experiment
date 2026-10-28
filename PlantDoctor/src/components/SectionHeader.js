import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';
export default function SectionHeader({ title, action }) { return <View style={styles.row}><Text style={styles.title}>{title}</Text>{action ? <Text style={styles.action}>{action}</Text> : null}</View>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }, title: { color: colors.ink, fontSize: 20, fontFamily: 'Georgia' }, action: { color: colors.forest, fontSize: 12, fontWeight: '700' } });
