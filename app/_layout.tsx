import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useMemo } from 'react'; // 👈 Added useMemo
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
  const currentTheme = useThemeStore((s) => s.theme); // 👈 Active theme subscription (0=Light, 1=Dark, 2=Glass)
  const setTheme = useThemeStore((s) => s.setTheme);

  // Units
  const isMetric = useUnitsStore((s) => s.isMetric);
  const toggleUnit = useUnitsStore((s) => s.toggleUnit);

  // 🚀 Dynamically compute colors based on theme index
  const headerTextColor = useMemo(() => {
    return currentTheme === 0 ? '#000' : '#fff'; // Black for Light mode, White for Dark/Glass
  }, [currentTheme]);

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.22)' },
          headerTitleStyle: { fontWeight: 'bold' },
          headerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.22)' },
          headerTintColor: headerTextColor, // 👈 ✅ Title and back arrows turn black in light mode
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowExtraBar((prev) => !prev)}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={headerTextColor} // 👈 ✅ Settings icon turns black in light mode
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
            style={styles.button3}
          >
            <Text style={{ color: '#fff' }}>
              {isMetric ? 'kg' : 'lbs'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Update StatusBar dynamically to match screen visibility */}
      <StatusBar style={currentTheme === 0 ? "dark" : "light"} />
    </>
  );
}

const styles = StyleSheet.create({
  extraBar: {
    position: 'absolute',
    top: 90, // 👈 Adjusted lower so it sits cleanly below your transparent header
    right: 20, // 👈 Adjusted closer to the right under the settings button
    flexDirection: 'column',
    zIndex: 999, // 👈 Raised zIndex to make sure it floats cleanly over the cards
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