import { Link, useFocusEffect } from "expo-router";           // ← add useFocusEffect
import { useState, useMemo, useCallback } from "react";      // ← add useCallback
import {
  ScrollView,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles, COLORS } from "../assets/styles";
import { useThemeStore } from "../assets/themeStore";

const today = 'Friday 13 March 2026';//new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(/,/g, "");

const STORAGE_KEY_PREFIX = "workout-day-";

const initialPlan = [
  { id: "1", day: "Day 1", focus: "Squat",// exercisesSummary: "Bench Press, Incline Press, Dips" 
  },
  { id: "2", day: "Day 2", focus: "Bench",// exercisesSummary: "Pull-Ups, Rows, Curls"
  },
  { id: "3", day: "Day 3", focus: "Deadlift",// exercisesSummary: "Squats, Deadlifts, Lunges" 
  },
  { id: "4", day: "Day 4", focus: "Accessories",// exercisesSummary: "Overhead Press, Raises, Plank" 
  },
];

export default function HomeScreen() {
  const [plan] = useState(initialPlan);
  const [completedDays, setCompletedDays] = useState<Record<string, { done: boolean, date?: string }>>({});
  const theme = useThemeStore((state) => state.theme);

  const themedColors = useMemo(
    () => ({
      ...COLORS,
      back: theme === 0 ? "#EEE" : theme === 2 ? "#888" : "#000",
      conback: theme === 0 ? "#FFF" : "rgba(255, 255, 255, 0.22)",
      text: theme === 0 ? "#000" : theme === 2 ? "#FFF" : "#FFF",
      success: "#4CAF50",
    }),
    [theme]
  );

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

   const loadCompletions = useCallback(async () => {
    try {
      const newCompleted: Record<string, { done: boolean, date?: string }> = {};

      for (const day of initialPlan) {
        const key = `${STORAGE_KEY_PREFIX}${day.id}`;
        const saved = await AsyncStorage.getItem(key);

        if (saved) {
          const parsed = JSON.parse(saved);
          const exercises = parsed.exercises || [];
          const allDone = exercises.length > 0 && exercises.every((ex: any) => ex.done === true);
          
          newCompleted[day.id] = { 
            done: allDone, 
            // We assume your day detail screen saves the 'date' into the object when finished
            date: allDone ? parsed.completedAt || today : undefined 
          };
        } else {
          newCompleted[day.id] = { done: false };
        }
      }
      setCompletedDays(newCompleted);
    } catch (e) {
      console.error("Failed to load completion status", e);
    }
  }, []);

  // This runs every time the home screen regains focus (including after back navigation)
  useFocusEffect(
    useCallback(() => {
      loadCompletions();
    }, [loadCompletions])
  );

  return (
  <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: themedColors.back, flex: 1 }]}>
    <ScrollView 
      style={{ backgroundColor: themedColors.back }} 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, { flex: 1, paddingBottom: 20 }]}>
        
        {/* Header Section */}
        <View style={globalStyles.headerRow}>
          <Image source={require("../assets/images/logo.png")} style={globalStyles.logo} />
          <View style={globalStyles.titleColumn}>
            <Text style={styles.appTitle}>LIFT GOOD!</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
        </View>

        {/* Buttons Row */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}>
          <Link href="/calendar" asChild style={[styles.card, { flex: 1 }]}>
            <TouchableOpacity>
              <Text style={[styles.dayText, { textAlign: "center" }]}>Profile</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/calendar" asChild style={[styles.card, { flex: 1 }]}>
            <TouchableOpacity>
              <Text style={[styles.dayText, { textAlign: "center" }]}>Statistics</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.subtitle}>Weekly Workout Plan</Text>

        {/* --- REPLACED FLATLIST WITH THIS MAP --- */}
        {plan.map((item) => {
          const completed = completedDays[item.id];
          const isCompleted = completed?.done;

          return (
            <Link
              key={item.id}
              href={{
                pathname: "/day/[id]",
                params: { id: item.id, dayName: item.day },
              }}
              asChild
            >
              <TouchableOpacity style={styles.card}>
                <View style={globalStyles.cardContent}>
                  <Text style={[styles.dayText, { marginTop: 20, marginBottom: 20 }]}>
                    {item.day} - {item.focus}
                  </Text>
                </View>

                {isCompleted ? (
                  <Text style={[styles.done, { fontSize: 16 }]}>Done</Text>
                ) : (
                  <Text style={styles.arrow}>→</Text>
                )}
              </TouchableOpacity>
            </Link>
          );
        })}

        {/* Footer Component from FlatList moved here */}
        <TouchableOpacity
          style={[globalStyles.backButton, { marginTop: 20 }]}
          onPress={() => {/* Add your logic here */}}
        >
          <Text style={globalStyles.backText}>Complete Week</Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { marginTop: 20, textAlign: 'center' }]}>
          Tap a day to see exercises
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}
