import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, globalStyles } from "../assets/styles";
import { useThemeStore } from "../assets/themeStore";

const today = new Date()
  .toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  .replace(/,/g, "");

const STORAGE_KEY_PREFIX = "workout-day-";

const initialPlan = [
  {
    id: "1",
    day: "Day 1",
    focus: "Squat",
  },
  {
    id: "2",
    day: "Day 2",
    focus: "Bench",
  },
  {
    id: "3",
    day: "Day 3",
    focus: "Deadlift",
  },
  {
    id: "4",
    day: "Day 4",
    focus: "Accessories",
  },
];

export default function HomeScreen() {
  const [plan] = useState(initialPlan);
  const [completedDays, setCompletedDays] = useState<
    Record<string, { done: boolean; date?: string }>
  >({});
  const theme = useThemeStore((state) => state.theme);
  const headerHeight = useHeaderHeight();

  const themedColors = useMemo(
    () => ({
      ...COLORS,
      back: theme === 0 ? "#EEE" : theme === 2 ? "#888" : "#000",
      conback: theme === 0 ? "#FFF" : "rgba(255, 255, 255, 0.22)",
      text: theme === 0 ? "#000" : theme === 2 ? "#FFF" : "#FFF",
      success: "#4CAF50",
    }),
    [theme],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...globalStyles,
        container: {
          ...globalStyles.container,
          backgroundColor: themedColors.back,
        },
        appTitle: { ...globalStyles.appTitle, color: themedColors.text },
        date: { ...globalStyles.date, color: themedColors.text },
        subtitle: { ...globalStyles.subtitle, color: themedColors.text },
        card: { ...globalStyles.card, backgroundColor: themedColors.conback },
        dayText: { ...globalStyles.dayText, color: themedColors.text },
        focusText: { ...globalStyles.focusText, color: themedColors.text },
        exercisesText: {
          ...globalStyles.exercisesText,
          color: themedColors.text,
        },
        footer: { ...globalStyles.footer, color: themedColors.text },
        arrow: {
          ...globalStyles.arrow,
          color: themedColors.text,
          fontSize: 24,
          fontWeight: "bold",
        },
        done: { color: themedColors.success, fontSize: 28, fontWeight: "bold" },
      }),
    [themedColors],
  );

  const loadCompletions = useCallback(async () => {
    try {
      const newCompleted: Record<string, { done: boolean; date?: string }> = {};

      for (const day of initialPlan) {
        const key = `${STORAGE_KEY_PREFIX}${day.id}`;
        const saved = await AsyncStorage.getItem(key);

        if (saved) {
          const parsed = JSON.parse(saved);
          const exercises = parsed.exercises || [];
          const allDone =
            exercises.length > 0 &&
            exercises.every((ex: any) => ex.done === true);

          newCompleted[day.id] = {
            done: allDone,
            date: allDone ? parsed.completedAt || today : undefined,
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

  useFocusEffect(
    useCallback(() => {
      loadCompletions();
    }, [loadCompletions]),
  );

  return (
    <SafeAreaView
      style={[globalStyles.safeArea, { backgroundColor: themedColors.back }]}
    >
      <ScrollView
        style={{ backgroundColor: themedColors.back }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: headerHeight }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { flex: 1, paddingBottom: 20 }]}>
          {/* Header Section */}
          <View style={globalStyles.headerRow}>
            <img src="/logo.png" style={globalStyles.logo} />
            <View style={globalStyles.titleColumn}>
              <Text style={styles.appTitle}>LIFT GOOD</Text>
              <Text style={styles.date}>{today}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}>
            <Link href="/Profile" asChild style={[styles.card, { flex: 1 }]}>
              <TouchableOpacity>
                <Text style={[styles.dayText, { textAlign: "center" }]}>
                  Profile
                </Text>
              </TouchableOpacity>
            </Link>
            <Link href="/Calendar" asChild style={[styles.card, { flex: 1 }]}>
              <TouchableOpacity>
                <Text style={[styles.dayText, { textAlign: "center" }]}>
                  Statistics
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.subtitle}>Weekly Workout Plan</Text>

          {plan.map((item) => {
  const completed = completedDays[item.id];
  const isCompleted = completed?.done;

  return (
    /* ✅ Fixed: Points directly to `/[id]` using the numeric value string.
       If your dynamic file is strictly at the root tier (`app/[id].tsx`), 
       it's safer to use an explicit route object to prevent conflict index routing:
    */
    <Link 
      key={item.id} 
      href={{
        pathname: "/[id]",
        params: { id: item.id }
      }} 
      asChild
    >
      <TouchableOpacity style={styles.card}>
        <View style={globalStyles.cardContent}>
          <Text
            style={[
              styles.dayText,
              { marginTop: 20, marginBottom: 20 },
            ]}
          >
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

          <TouchableOpacity
            style={[globalStyles.backButton, { marginTop: 20 }]}
            onPress={() => {
              /* Add your logic here */
            }}
          >
            <Text style={globalStyles.backText}>Complete Week</Text>
          </TouchableOpacity>

          <Text style={[styles.footer, { marginTop: 20, textAlign: "center" }]}>
            Tap a day to see exercises
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
