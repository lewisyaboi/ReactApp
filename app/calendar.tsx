import { useRouter, useFocusEffect } from "expo-router";
import { useMemo, useState, useCallback } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles, COLORS } from "../assets/styles";
import { useThemeStore } from "../assets/themeStore";

const STORAGE_KEY_PREFIX = "workout-day-";

export default function CalendarScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  const themedColors = useMemo(() => ({
    ...COLORS,
    back: theme === 0 ? "#EEE" : theme === 2 ? "#888" : "#000",
    conback: theme === 0 ? "#FFF" : "rgba(255, 255, 255, 0.22)",
    text: theme === 0 ? "#000" : theme === 2 ? "#FFF" : "#FFF",
    success: "#4CAF50",
  }), [theme]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...globalStyles,
        container: { ...globalStyles.container, backgroundColor: themedColors.back },
        appTitle: { ...globalStyles.appTitle, color: themedColors.text },
        date: { ...globalStyles.date, color: themedColors.text },
        subtitle: { ...globalStyles.subtitle, color: themedColors.text },
        card: { ...globalStyles.card, backgroundColor: themedColors.conback },
        dayText: { ...globalStyles.dayText, color: themedColors.text },
        focusText: { ...globalStyles.focusText, color: themedColors.text },
        exercisesText: { ...globalStyles.exercisesText, color: themedColors.text },
        footer: { ...globalStyles.footer, color: themedColors.text },
        arrow: { ...globalStyles.arrow, color: themedColors.text, fontSize: 24, fontWeight: "bold" },
        done: { color: themedColors.success, fontSize: 28, fontWeight: "bold" },
      }),
    [themedColors]
  );

  const loadWorkoutDates = useCallback(async () => {
    try {
      let marks: any = {};
      for (let i = 1; i <= 4; i++) {
        const data = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${i}`);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.completedAt) {
            // Use the date exactly as saved in storage
            const dateKey = parsed.completedAt; 
            marks[dateKey] = {
              workoutLabel: `D${i}`, // Custom property to display on calendar
              customStyles: {
                container: {
                  backgroundColor: themedColors.success,
                  borderRadius: 8,
                  elevation: 3,
                },
                text: {
                  color: 'white',
                  fontWeight: 'bold',
                }
              }
            };
          }
        }
      }
      setMarkedDates(marks);
    } catch (e) {
      console.error("Error loading calendar dates", e);
    }
  }, [themedColors.success]);

  useFocusEffect(
    useCallback(() => {
      loadWorkoutDates();
    }, [loadWorkoutDates])
  );

return (
  /* 1. Apply background to SafeAreaView to cover top/bottom notches */
  <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: themedColors.back, flex: 1 }]}>
    
    {/* 2. ScrollView style must match the theme background */}
    <ScrollView 
      style={{ backgroundColor: themedColors.back }} 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
      bounces={false} /* Optional: stops the 'white bounce' on iOS */
    >
      {/* 3. The main View container needs to fill the ScrollView */}
      <View style={[styles.container, { flex: 1, backgroundColor: themedColors.back, paddingBottom: 0, paddingTop: 30, }]}>
          <Text style={[styles.subtitle, { textAlign: 'center'}]}>Calendar</Text>

      <Calendar
        key={theme}
        markingType={'custom'}
        markedDates={markedDates}
        dayComponent={({ date, state, marking }: any) => {
          const isToday = new Date().toISOString().split('T')[0] === date.dateString;
          return (
            <TouchableOpacity 
              style={{ 
                width: 40, 
                height: 45, 
                alignItems: 'center', 
                justifyContent: 'center',
                ...(marking?.customStyles?.container || {}),
                borderWidth: isToday && !marking ? 1 : 0,
                borderColor: themedColors.success
              }}
            >
              <Text style={{ 
                color: marking ? 'white' : (state === 'disabled' ? '#999' : themedColors.text),
                fontWeight: marking ? 'bold' : 'normal'
              }}>
                {date.day}
              </Text>
              {marking?.workoutLabel && (
                <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold' }}>
                  {marking.workoutLabel}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        theme={{
          calendarBackground: 'transparent',
          monthTextColor: themedColors.text,
          textSectionTitleColor: themedColors.text,
          arrowColor: themedColors.text,
        }}
        style={{
          backgroundColor: themedColors.conback,
          borderRadius: 15,
          padding: 10,
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.35)',
          marginBottom: 20,
        }}
      />

      {/* Container for both Columns */}
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
        
        {/* LEFT COLUMN */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: themedColors.text, fontWeight: 'bold', marginBottom: 8, paddingLeft: 4,  textAlign: 'center'  }}>
            Stored Workouts
          </Text>
          <TouchableOpacity style={[styles.card, { margin: 0, height: 150 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(markedDates).length > 0 ? (
                Object.entries(markedDates).map(([date, data]: any) => (
                  <Text key={date} style={{ color: themedColors.text, marginBottom: 4 }}>
                    {data.workoutLabel} — {date}
                  </Text>
                ))
              ) : (
                <Text style={{ color: themedColors.text, opacity: 0.6 }}>No sessions found.</Text>
              )}
            </ScrollView>
          </TouchableOpacity>
        </View>

        {/* RIGHT COLUMN */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: themedColors.text, fontWeight: 'bold', marginBottom: 8,  textAlign: 'center' }}>
            Statistics
          </Text>
          <TouchableOpacity style={[styles.card, { margin: 0, height: 150, justifyContent: 'center', alignItems: 'center', flexDirection:'column' }]}>
            <Text style={{ color: themedColors.text, fontSize: 32, fontWeight: 'bold' }}>
              {Object.keys(markedDates).length}
            </Text>
            <Text style={{ color: themedColors.text, fontSize: 12, opacity: 0.8 }}>Total Sessions</Text>
          </TouchableOpacity>
        </View>

      </View>

      <TouchableOpacity 
        style={[globalStyles.backButton, { marginTop: 'auto', alignItems: 'center' }]} 
        onPress={() => router.back()}>
        <Text style={globalStyles.backText}>Back to Plan</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);

}
