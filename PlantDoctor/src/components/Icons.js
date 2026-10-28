import React from 'react';
import Svg, { Path, Circle, Line } from 'react-native-svg';

function Icon({ name, size = 20, color = '#1F3D2B', strokeWidth = 1.8 }) {
 const common = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
 const paths = {
  Leaf: <><Path {...common} d="M20 4c-8 0-14 4-14 11a5 5 0 0 0 5 5c7 0 11-6 9-16Z"/><Path {...common} d="M4 20c3-5 7-8 12-11"/></>,
  Camera: <><Path {...common} d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><Circle {...common} cx="12" cy="13" r="4"/></>,
  ArrowRight: <><Path {...common} d="M5 12h14M12 5l7 7-7 7"/></>,
  ArrowUpRight: <><Path {...common} d="M7 17 17 7M7 7h10v10"/></>,
  Bookmark: <><Path {...common} d="M6 4h12v17l-6-4-6 4V4Z"/></>,
  Share2: <><Circle {...common} cx="18" cy="5" r="3"/><Circle {...common} cx="6" cy="12" r="3"/><Circle {...common} cx="18" cy="19" r="3"/><Path {...common} d="m8.6 10.7 6.8-4.4m-6.8 7 6.8 4.3"/></>,
  CloudSun: <><Path {...common} d="M20 15.5a4.5 4.5 0 0 0-4.5-4.5 6 6 0 0 0-11.3 2A3.5 3.5 0 0 0 5 20h11a4 4 0 0 0 4-4.5Z"/><Circle {...common} cx="17" cy="6" r="3"/><Path {...common} d="M17 1v1m0 8v1m5-5h-1m-8 0h-1"/></>,
  MapPin: <><Path {...common} d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><Circle {...common} cx="12" cy="10" r="2.5"/></>,
  WifiOff: <><Path {...common} d="m3 3 18 18M10.6 10.6a3 3 0 0 1 4.2 4.2M5 8a11 11 0 0 1 11-2m3 2a11 11 0 0 1 2 2M2 11a14 14 0 0 1 3-2m5 11h4"/></>,
  ArrowLeft: <><Path {...common} d="M19 12H5m7 7-7-7 7-7"/></>,
  CircleCheck: <><Circle {...common} cx="12" cy="12" r="9"/><Path {...common} d="m8 12 3 3 5-6"/></>,
  Sprout: <><Path {...common} d="M12 22v-9m0 3c-5 0-8-3-8-8 5 0 8 3 8 8Zm0-3c0-5 3-8 8-8 0 5-3 8-8 8Z"/></>,
  ShieldCheck: <><Path {...common} d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><Path {...common} d="m9 12 2 2 4-4"/></>,
 };
 return <Svg width={size} height={size} viewBox="0 0 24 24">{paths[name] || <Line {...common} x1="5" y1="12" x2="19" y2="12" />}</Svg>;
}
export const Leaf = (p) => <Icon name="Leaf" {...p} />;
export const Camera = (p) => <Icon name="Camera" {...p} />;
export const ArrowRight = (p) => <Icon name="ArrowRight" {...p} />;
export const ArrowUpRight = (p) => <Icon name="ArrowUpRight" {...p} />;
export const Bookmark = (p) => <Icon name="Bookmark" {...p} />;
export const Share2 = (p) => <Icon name="Share2" {...p} />;
export const CloudSun = (p) => <Icon name="CloudSun" {...p} />;
export const MapPin = (p) => <Icon name="MapPin" {...p} />;
export const WifiOff = (p) => <Icon name="WifiOff" {...p} />;
export const ArrowLeft = (p) => <Icon name="ArrowLeft" {...p} />;
export const CircleCheck = (p) => <Icon name="CircleCheck" {...p} />;
export const Sprout = (p) => <Icon name="Sprout" {...p} />;
export const ShieldCheck = (p) => <Icon name="ShieldCheck" {...p} />;
