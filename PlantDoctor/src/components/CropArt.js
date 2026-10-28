import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { colors } from '../theme';

const art = {
 tomato: { ground: '#718654', leaf: '#A7BC73', detail: '#D5D99D', fruit: '#D96B45' },
 wheat: { ground: '#9C8955', leaf: '#D4C27C', detail: '#F0DF9E', fruit: '#B88943' },
 rice: { ground: '#617D65', leaf: '#B4C997', detail: '#E1D9A6', fruit: '#E2C983' },
 field: { ground: '#657D58', leaf: '#A9BC7B', detail: '#D5D89D', fruit: '#D7A65D' },
};

export default function CropArt({ crop = 'field', style }) {
 const palette = art[crop.toLowerCase()] || art.field;
 return <View style={[styles.root, style]}>
  <Svg width="100%" height="100%" viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice">
   <Path d="M0 0h360v240H0z" fill={palette.ground} />
   <Circle cx="286" cy="48" r="22" fill="#E9DDAA" opacity=".78" />
   <Path d="M0 167c56-27 91-16 139-5 64 14 121-20 221-11v89H0Z" fill="#3F6045" opacity=".55" />
   <Path d="M0 193c71-17 119 5 177-4 73-11 118-3 183 5v46H0Z" fill="#294C37" opacity=".6" />
   <Path d="M175 230c-6-50-4-96 1-148m-1 106c-29-38-48-53-78-70m78 54c31-37 56-48 88-62m-88 34c-4-28-20-46-42-67m45 87c19-27 43-41 66-51" fill="none" stroke={palette.detail} strokeWidth="3" strokeLinecap="round" />
   <Path d="M168 155c-29 3-53-10-68-37 31-3 55 9 68 37Zm7-26c3-29 20-49 49-59-1 31-16 51-49 59Zm-2 45c-21-2-39-14-50-36 27 0 44 12 50 36Zm7-9c15-26 36-38 65-38-11 26-31 39-65 38Z" fill={palette.leaf} />
   <Path d="M178 128c8-24 22-41 44-54m-44 74c-24-17-42-30-66-30m66 55c21-20 38-31 58-34" fill="none" stroke={palette.detail} strokeWidth="1.7" strokeLinecap="round" opacity=".8" />
   <Ellipse cx="131" cy="196" rx="11" ry="15" fill={palette.fruit} /><Ellipse cx="225" cy="177" rx="10" ry="14" fill={palette.fruit} /><Path d="M128 181q4 5 8 0m86-17q3 5 7 0" fill="none" stroke={palette.detail} strokeWidth="2" />
   <Path d="M32 215h296" stroke={palette.detail} strokeOpacity=".32" strokeWidth="1" />
  </Svg>
 </View>;
}
const styles = StyleSheet.create({ root: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', backgroundColor: '#657D58' } });
