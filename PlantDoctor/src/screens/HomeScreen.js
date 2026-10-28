import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { CloudSun, MapPin, ArrowUpRight, Leaf, WifiOff } from '../components/Icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Chip from '../components/Chip';
import SectionHeader from '../components/SectionHeader';
import CropArt from '../components/CropArt';
import { recentScans, weeklyHealth } from '../data/scans';
import { loadModel } from '../ml/model';
import { colors, spacing, radii } from '../theme';

export default function HomeScreen({ navigation }) {
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);
  useEffect(() => { loadModel().then(() => { setReady(true); setOffline(false); }).catch(() => { setReady(false); setOffline(true); }); }, []);
  const scan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return Alert.alert('Camera access needed', 'Allow camera access to photograph a crop leaf.');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: .85 });
      if (!result.canceled) navigation.navigate('Result', { imageUri: result.assets[0].uri });
    } catch (error) { Alert.alert('Camera unavailable', 'Choose a leaf photo from your gallery instead.'); }
  };
  const gallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: .85 });
    if (!result.canceled) navigation.navigate('Result', { imageUri: result.assets[0].uri });
  };
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.topline}><View><Text style={styles.eyebrow}>TUESDAY, 27 OCTOBER</Text><Text style={styles.greeting}>Good morning,{"\n"}field notes.</Text></View><View style={styles.avatar}><Leaf size={21} color={colors.forest} strokeWidth={1.7} /></View></View>
    <View style={styles.conditions}><MapPin size={15} color={colors.forest} /><Text style={styles.place}>Your fields</Text><View style={styles.conditionRule} /><CloudSun size={17} color={colors.warning} /><Text style={styles.weather}>24° · Clear skies</Text></View>
    {offline && <View style={styles.offline}><WifiOff size={16} color={colors.warning} /><Text style={styles.offlineText}>Offline model unavailable · try again shortly</Text></View>}
    <Animated.View entering={FadeInDown.duration(450)}>
      <View style={styles.hero}>
        <CropArt crop="field" />
        <View style={styles.heroShade} /><View style={styles.heroTop}><Chip dot active>{ready ? 'READY TO SCAN' : 'GETTING READY'}</Chip><Text style={styles.heroIndex}>01 / FIELD GUIDE</Text></View>
        <View style={styles.heroCopy}><Text style={styles.heroTitle}>A closer look{"\n"}starts here.</Text><Text style={styles.heroBody}>Check a leaf before a small spot{"\n"}becomes a field-wide problem.</Text></View>
        <Button title="Scan a leaf" icon="camera" onPress={scan} disabled={!ready} style={styles.scanButton} />
      </View>
    </Animated.View>
    <View style={styles.section}><SectionHeader title="Recent scans" action="Field log  ↗" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scanStrip}>
      {recentScans.map((item, index) => <Pressable key={item.disease} onPress={() => navigation.navigate('Result', { mockResult: item })} style={[styles.scanCard, index === 0 && styles.firstScan]}>
        <View style={styles.scanPhoto}><CropArt crop={item.crop} /><View style={styles.photoShade} /><Text style={styles.cropLabel}>{item.crop.toUpperCase()}</Text></View>
        <View style={styles.scanInfo}><Text style={styles.disease}>{item.disease}</Text><Text style={styles.confidence}>{item.confidence}% match <Text style={styles.scanDate}>· {item.date.split(' · ')[0]}</Text></Text></View><ArrowUpRight size={17} color={colors.forest} style={styles.scanArrow} />
      </Pressable>)}
    </ScrollView></View>
    <View style={styles.healthSection}><View style={styles.healthHeader}><View><Text style={styles.eyebrow}>FIELD OVERVIEW</Text><Text style={styles.healthTitle}>Crop health this week</Text></View><Text style={styles.healthNumber}>72<Text style={styles.healthPercent}>%</Text></Text></View><View style={styles.chart}>{weeklyHealth.map((height, i) => <View key={i} style={styles.chartColumn}><View style={[styles.bar, i === 6 && styles.barToday, { height }]} /><Text style={[styles.chartDay, i === 6 && styles.chartDayToday]}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text></View>)}</View><Text style={styles.chartNote}>Looking steady · based on 12 field checks</Text></View>
    <View style={styles.footer}><Text style={styles.footerText}>GOOD GROUND, GOOD GROWTH.</Text><Pressable onPress={gallery}><Text style={styles.gallery}>Choose a photo  ↗</Text></Pressable></View>
  </ScrollView></ScreenContainer>;
}
const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 40 }, topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.7 }, greeting: { marginTop: 10, fontSize: 36, lineHeight: 40, letterSpacing: -1.5, color: colors.ink, fontFamily: 'Georgia' }, avatar: { width: 46, height: 46, marginTop: 8, borderRadius: 23, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }, conditions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.lg }, place: { marginLeft: 6, color: colors.forest, fontWeight: '700', fontSize: 13 }, conditionRule: { width: 1, height: 15, backgroundColor: colors.line, marginHorizontal: 11 }, weather: { marginLeft: 6, color: colors.muted, fontSize: 13 }, offline: { minHeight: 42, borderRadius: 9, backgroundColor: '#F1E7D5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 14, gap: 8 }, offlineText: { color: colors.ink, fontSize: 12, fontWeight: '700' }, hero: { height: 355, padding: 20, borderRadius: radii.lg, overflow: 'hidden', justifyContent: 'space-between', backgroundColor: colors.forest }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,34,23,.42)' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, heroIndex: { color: 'rgba(255,255,255,.82)', fontSize: 9, letterSpacing: 1.3, fontWeight: '800' }, heroCopy: { marginTop: 'auto', marginBottom: 20 }, heroTitle: { color: colors.white, fontFamily: 'Georgia', fontSize: 35, lineHeight: 38, letterSpacing: -.7 }, heroBody: { marginTop: 10, color: 'rgba(255,255,255,.85)', fontSize: 13, lineHeight: 19 }, scanButton: { backgroundColor: colors.accent }, section: { marginTop: 29 }, scanStrip: { gap: 11, paddingRight: 2 }, scanCard: { width: 216, minHeight: 199, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radii.sm, overflow: 'hidden' }, firstScan: { width: 230 }, scanPhoto: { height: 116, justifyContent: 'flex-end', overflow: 'hidden' }, photoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,34,23,.17)' }, cropLabel: { margin: 12, color: colors.white, fontSize: 10, letterSpacing: 1.1, fontWeight: '800' }, scanInfo: { padding: 12, paddingTop: 10 }, disease: { color: colors.ink, fontSize: 16, fontFamily: 'Georgia' }, confidence: { color: colors.forest, fontSize: 11, fontWeight: '700', marginTop: 5 }, scanDate: { color: colors.muted, fontWeight: '400' }, scanArrow: { position: 'absolute', right: 11, bottom: 13 }, healthSection: { marginTop: 30, padding: 18, borderRadius: radii.md, backgroundColor: colors.sage }, healthHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }, healthTitle: { color: colors.ink, fontSize: 19, fontFamily: 'Georgia', marginTop: 6 }, healthNumber: { fontSize: 29, color: colors.forest, fontFamily: 'Georgia' }, healthPercent: { fontSize: 15 }, chart: { height: 104, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 }, chartColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }, bar: { width: 13, maxHeight: 78, borderRadius: 7, backgroundColor: '#A8B99F' }, barToday: { backgroundColor: colors.forest }, chartDay: { color: colors.muted, fontSize: 10, marginTop: 8 }, chartDayToday: { color: colors.forest, fontWeight: '800' }, chartNote: { color: colors.muted, fontSize: 11, marginTop: 8 }, footer: { marginTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, footerText: { color: colors.muted, fontSize: 9, letterSpacing: 1.2, fontWeight: '800' }, gallery: { color: colors.forest, fontSize: 11, fontWeight: '700' }
});
