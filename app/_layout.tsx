import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useMemo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeStore } from '../assets/themeStore';
import { useUnitsStore } from '../assets/unitStore';

type DayRouteParams = {
  id: string;
  dayName?: string;
};

export default function RootLayout() {
  const [showExtraBar, setShowExtraBar] = useState(false);

  // Theme Subscriptions
  const currentTheme = useThemeStore((s) => s.theme); // (0=Light, 1=Dark, 2=Glass)
  const setTheme = useThemeStore((s) => s.setTheme);

  // Units
  const isMetric = useUnitsStore((s) => s.isMetric);
  const toggleUnit = useUnitsStore((s) => s.toggleUnit);

  // Dynamically compute colors based on theme index
  const headerTextColor = useMemo(() => {
    return currentTheme === 0 ? '#000' : '#fff';
  }, [currentTheme]);

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleAlign: 'center', // 🚀 FIXED: This centers the title on both Android and iOS
          headerTitleStyle: { fontWeight: 'bold' },
          headerTintColor: headerTextColor, 
          // Create a multi-layered background wrapper
          headerBackground: () => (
            <View style={StyleSheet.absoluteFillObject}>
              {/* Layer 1 (Bottom): Semi-transparent black overlay */}
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 
                currentTheme === 0 ? 'rgba(255, 255, 255, 0.9)' : currentTheme === 2 ? 'rgba(136, 136, 136, 0.9)' : 'rgba(0, 0, 0, 0.9)' }]} />
              {/* Layer 2 (Top): Your original light overlay */}
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255, 255, 255, 0.22)' }]} />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowExtraBar((prev) => !prev)}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={headerTextColor}
                style={{ paddingLeft: 5, marginRight: 20 }}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="calendar" options={{ title: 'Statistics' }} />
        <Stack.Screen
          name="[id]"
          options={({ route }) => ({
            title:
              (route.params as DayRouteParams | undefined)?.dayName ??
              'Workout Day',
          })}
        />
      </Stack>

      {/* The small container that appears below header when toggled */}
      {showExtraBar && (
        <View style={styles.extraBar}>
          <TouchableOpacity
            onPress={() => { setShowExtraBar(false); setTheme(0); }}
            style={styles.button1}>
            <Text style={{ color: '#000' }}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setShowExtraBar(false); setTheme(1); }}
            style={styles.button2}>
            <Text style={{ color: '#fff' }}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setShowExtraBar(false); setTheme(2); }}
            style={styles.button3}>
            <Text style={{ color: '#fff' }}>Glass</Text>
          </TouchableOpacity>
          
          {/* Unit switch (kg / lbs) */}
          <TouchableOpacity
            onPress={() => {
              setShowExtraBar(false);
              toggleUnit();
            }}
            style={[styles.button3, { backgroundColor: '#fff' }]}
          >
            <Text style={{ color: '#000' }}>
              {isMetric ? 'kg' : 'lbs'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style={currentTheme === 0 ? "dark" : "light"} />
    </>
  );
}

const styles = StyleSheet.create({
  extraBar: {
    position: 'absolute',
    top: 75, 
    right: 20, 
    flexDirection: 'column',
    zIndex: 999, 
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button1: {
    backgroundColor: '#fff', padding: 10, width: 100, alignItems: 'center'
  },
  button2: {
    backgroundColor: '#1C1C1E', padding: 10, width: 100, alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#333'
  },
  button3: {
    backgroundColor: '#444', padding: 10, width: 100, alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#555'
  }
});