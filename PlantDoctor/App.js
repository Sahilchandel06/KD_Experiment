/**
 * App.js — LeafLens Field Guide navigation root
 *
 * Sets up:
 *  - Font loading (Inter via @expo-google-fonts)
 *  - Navigation stack (Splash → Home → Result)
 *  - Safe area provider
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import SplashScreenComponent from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultScreen from './src/screens/ResultScreen';
import { colors } from './src/theme';

// Prevent auto-hide so we control when the splash goes away
SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

const LeafTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.forest,
    background: colors.background,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
    notification: colors.forest,
  },
};

export default function App() {
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <NavigationContainer theme={LeafTheme}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreenComponent} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
