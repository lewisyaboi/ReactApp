import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemeStore } from '../assets/themeStore';
import { useUnitsStore } from '../assets/unitStore'; // ← new import

// Optional: define expected params
type DayRouteParams = {
  id: string;
  dayName?: string;
};

export default function RootLayout() {
  const [showExtraBar, setShowExtraBar] = useState(false);

  // Theme
  const theme = useThemeStore((s) => s.setTheme);

  // Units
  const isMetric = useUnitsStore((s) => s.isMetric);
  const toggleUnit = useUnitsStore((s) => s.toggleUnit);
  // or use setIsMetric if you prefer explicit true/false

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFF' },
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowExtraBar((prev) => !prev)}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                style={{ paddingLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="calendar" options={{ title: 'Statistics' }} />
        <Stack.Screen
          name="day/[id]"
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
            onPress={() => {setShowExtraBar(false); theme(0);}}
            style={styles.button1}>
          <Text style={{color: '#000'}}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {setShowExtraBar(false); theme(1);}}
            style={styles.button2}>
            <Text style={{color: '#fff'}}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {setShowExtraBar(false); theme(2);}}
            style={styles.button3}>
            <Text style={{color: '#fff'}}>Glass</Text>
          </TouchableOpacity>
          
          {/* New: Unit switch (kg / lbs) */}
          <TouchableOpacity
            onPress={() => {
              setShowExtraBar(false);
              toggleUnit();
            }}
            style={styles.button3}
          >
            <Text style={{color: '#fff'}}>
              {isMetric ? 'kg' : 'lbs'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="dark" backgroundColor="#f8f9fa" />
    </>
  );
}


const styles = StyleSheet.create({
  extraBar: {
    position: 'absolute',
    top: 100, // will sit right under header (adjust if needed)
    right:0,

    flexDirection: 'column',
    zIndex: 10, // above content but below header

  },
  extraBarText: {
    fontSize: 15,
    color: '#333',
  },
  button1:{
    backgroundColor: '#fff', padding:6, width:100
  },
  button2:{
    backgroundColor: '#000', padding:6, width:100
  },
  button3:{
    backgroundColor: '#888', padding:6, width:100
  }
});