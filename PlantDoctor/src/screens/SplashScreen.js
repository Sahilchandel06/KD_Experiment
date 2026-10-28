import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Leaf } from '../components/Icons';
import { colors } from '../theme';
export default function SplashScreen({ navigation }) {
 const opacity = useSharedValue(0);
 useEffect(() => { opacity.value = withDelay(150, withTiming(1, { duration: 650 })); const timer = setTimeout(() => navigation.replace('Home'), 1200); return () => clearTimeout(timer); }, []);
 const animated = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: (1 - opacity.value) * 8 }] }));
 return <View style={styles.root}><Animated.View style={[styles.content, animated]}><View style={styles.mark}><Leaf size={34} color={colors.accent} strokeWidth={1.7} /></View><Text style={styles.name}>LeafLens</Text><Text style={styles.note}>A FIELD GUIDE FOR GROWING WELL</Text></Animated.View></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' }, content: { alignItems: 'center' }, mark: { width: 66, height: 66, borderRadius: 23, backgroundColor: 'rgba(255,255,255,.09)', alignItems: 'center', justifyContent: 'center', marginBottom: 17 }, name: { color: colors.background, fontFamily: 'Georgia', fontSize: 39, letterSpacing: -.8 }, note: { color: 'rgba(255,255,255,.62)', fontSize: 9, letterSpacing: 2, fontWeight: '800', marginTop: 11 } });
