import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import {
  Alert,
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, globalStyles } from "../../assets/styles";
import { useThemeStore } from "../../assets/themeStore";
import { useUnitsStore } from "@/assets/unitStore"; // adjust path if needed

const STORAGE_KEY_PREFIX = "workout-day-";
const TEMPLATE_KEY_PREFIX = "workout-template-";

// Conversion constants
const KG_TO_LBS = 2.20462262185;

// Helpers – always store in kg, convert only for display / input
const displayWeight = (weightKg: number, isMetric: boolean): string => {
  if (isMetric) return weightKg.toFixed(1);
  const lbs = weightKg * KG_TO_LBS;
  return lbs >= 10 ? lbs.toFixed(0) : lbs.toFixed(1);
};

const inputToKg = (value: string, isMetric: boolean): number => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return isMetric ? num : num / KG_TO_LBS;
};

// Initial fallback data – weights in kg
const initialWorkoutData: Record<
  string,
  {
    day: string;
    focus: string;
    exercises: { name: string; sets: string; reps: string; weight: number }[];
  }
> = {
  "1": {
  day: "Day 1",
  focus: "Squat",
  exercises: [
    { name: "Pause Squat", sets: "1", reps: "1", weight: 185 },
    { name: "Pause Squat", sets: "3", reps: "4", weight: 145 },
    { name: "Leg Press", sets: "3", reps: "10", weight: 150 },
    { name: "Split Squats", sets: "3", reps: "7", weight: 25 },
    { name: "Leg Curls", sets: "3", reps: "12", weight: 65 },
    { name: "Leg Extensions", sets: "3", reps: "12", weight: 65 },
  ],
},
"2": {
  day: "Day 2",
  focus: "Bench",
  exercises: [
    { name: "Pause Bench Press", sets: "1", reps: "1", weight: 135 },
    { name: "Pause Bench Press", sets: "3", reps: "5", weight: 105 },
    { name: "Incline Press", sets: "3", reps: "8", weight: 60 },
    { name: "Fly's", sets: "3", reps: "10", weight: 60 },
    { name: "Tricep Extensions", sets: "3", reps: "12", weight: 40 },
    { name: "Tricep overhead", sets: "3", reps: "12", weight: 70 },
  ],
},
"3": {
  day: "Day 3",
  focus: "Deadlift",
  exercises: [
    { name: "Deadlift", sets: "1", reps: "2", weight: 205 },
    { name: "Deadlift", sets: "1", reps: "8", weight: 210 },
    { name: "Coan Deadlift", sets: "3", reps: "5", weight: 80 },
    { name: "RDL or Rack Pull", sets: "3", reps: "8", weight: 65 },
    { name: "Lat Pull Down", sets: "3", reps: "12", weight: 70 },
    { name: "Bicep Curls", sets: "3", reps: "12", weight: 35 },
  ],
},
"4": {
  day: "Day 4",
  focus: "Accessories",
  exercises: [
    { name: "Larson Bench Press", sets: "1", reps: "2", weight: 130 },
    { name: "CG Pause Bench Press", sets: "1", reps: "2", weight: 120 },
    { name: "CG Pause Bench Press", sets: "3", reps: "5", weight: 90 },
    { name: "Pause Deadlift", sets: "4", reps: "2", weight: 185 },
    { name: "Seated Rows", sets: "2", reps: "12", weight: 70 },
    { name: "Shoulder Press", sets: "3", reps: "8", weight: 60 },
  ],
},
};

type ExerciseTemplate = {
  done?: boolean;
  name: string;
  sets: string;
  reps: string;
  weight: number;   // always in kg
  
};

type Exercise = ExerciseTemplate & {
  done: boolean;
};

export default function DayDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [templateExercises, setTemplateExercises] = useState<ExerciseTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useThemeStore((state) => state.theme);
  const isMetric = useUnitsStore((state) => state.isMetric); // live subscription

  const themedColors = useMemo(
    () => ({
      ...COLORS,
      back: theme === 0 ? "#EEE" : theme === 2 ? "#888" : "#000",
      conback: theme === 0 ? "#FFF" : "rgba(255, 255, 255, 0.22)",
      text: theme === 0 ? "#000" : theme === 2 ? "#FFF" : "#FFF"
    }),
    [theme]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ...globalStyles,
        container: { backgroundColor: themedColors.back },
        subtitle: { ...globalStyles.subtitle, marginBottom:0, margin:25, color: themedColors.text },
        card: { ...globalStyles.card, backgroundColor: themedColors.conback },
        exerciseName: { ...globalStyles.exerciseName, color: themedColors.text },
        exercisesText: { ...globalStyles.exercisesText, color: themedColors.text },
        input: {
          color: themedColors.text,
          borderWidth: 1,
          borderRadius: 6,
          padding: 8,
        },
        row: {
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        },
        actionButton: {
          position: 'absolute',
          top: 5,               // adjust padding from top
          right: 5,             // distance from right edge

          zIndex: 10,
        },
        saveButton: {
          backgroundColor: "#4CAF50",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        },
        cancelButton: {
          backgroundColor: "#f44336",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 8,
        },
        headerRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        },
      }),
    [themedColors]
  );

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dayKey = `${STORAGE_KEY_PREFIX}${id}`;
        const templateKey = `${TEMPLATE_KEY_PREFIX}${id}`;

        // Load template (weights in kg)
        let loadedTemplate: ExerciseTemplate[] = [];
        const savedTemplate = await AsyncStorage.getItem(templateKey);
        if (savedTemplate) {
          loadedTemplate = JSON.parse(savedTemplate);
        } else {
          loadedTemplate = initialWorkoutData[id]?.exercises || [];
        }

        // Load progress
        const savedProgress = await AsyncStorage.getItem(dayKey);
        let progressMap: Record<number, boolean> = {};
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          parsed.exercises?.forEach((ex: any, idx: number) => {
            if (ex.done !== undefined) progressMap[idx] = !!ex.done;
          });
        }

        const fullExercises = loadedTemplate.map((ex, idx) => ({
          ...ex,
          done: progressMap[idx] ?? false,
        }));

        setExercises(fullExercises);
        setTemplateExercises(loadedTemplate);
      } catch (e) {
        console.error("Load error", e);
        Alert.alert("Error", "Could not load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

    useEffect(() => {
    if (isLoading || exercises.length === 0) return;

    const saveProgress = async () => {
      try {
        const key = `${STORAGE_KEY_PREFIX}${id}`;
        
        // 1. Check if every exercise in the list is checked/done
        const allDone = exercises.every(ex => ex.done === true);
        
        // 2. Create the date string (matching the format in your Home Screen)
        const now = new Date();
// This creates YYYY-MM-DD using your local time instead of UTC
const localISODate = // Add this to test: '2026-03-14';
now.getFullYear() + '-' + 
String(now.getMonth() + 1).padStart(2, '0') + '-' + 
String(now.getDate()).padStart(2, '0');

const data = {
  exercises: exercises.map(({ name, sets, reps, weight, done }) => ({
    name, sets, reps, weight, done,
  })),
  completedAt: allDone ? localISODate : null, // Saves as "2024-10-24"
};

        await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error("Save progress error", e);
      }
    };

    saveProgress();
  }, [exercises, id, isLoading]);

  const saveTemplate = async () => {
  try {
    const key = `${TEMPLATE_KEY_PREFIX}${id}`;
    await AsyncStorage.setItem(key, JSON.stringify(templateExercises));

    // Rebuild exercises using the new template + try to keep done status by name
    setExercises((currentExercises) => {
      const nameToDone = new Map(
        currentExercises.map(ex => [ex.name.trim().toLowerCase(), ex.done])
      );

      return templateExercises.map((tempEx) => {
        const key = tempEx.name.trim().toLowerCase();
        const previousDone = nameToDone.get(key) ?? false;
        return {
          ...tempEx,
          done: previousDone,
        };
      });
    });

    setIsEditMode(false);
    Alert.alert("Saved", "Workout template updated!");
  } catch (e) {
    Alert.alert("Error", "Could not save changes");
  }
};
const resetToDefault = async () => {
  Alert.alert(
    "Reset to Default",
    "This will revert all changes and restore the original workout template for this day. Are you sure?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          try {
            const templateKey = `${TEMPLATE_KEY_PREFIX}${id}`;
            // Remove the saved (possibly corrupted) template from storage
            await AsyncStorage.removeItem(templateKey);

            // Get the original from initialWorkoutData
            const defaultExercises = initialWorkoutData[id]?.exercises || [];

            // Update local template state
            setTemplateExercises(defaultExercises);

            // Also update displayed exercises, trying to preserve done status by name
            setExercises((current) => {
              const nameToDone = new Map(
                current.map((ex) => [ex.name.trim().toLowerCase(), ex.done])
              );

              return defaultExercises.map((defEx) => {
                const key = defEx.name.trim().toLowerCase();
                return {
                  ...defEx,
                  done: nameToDone.get(key) ?? false,
                };
              });
            });

            Alert.alert("Reset Complete", "Template restored to original values.");
            // Optional: exit edit mode automatically after reset
            // setIsEditMode(false);
          } catch (e) {
            console.error("Reset error", e);
            Alert.alert("Error", "Could not reset template");
          }
        },
      },
    ]
  );
};

  const cancelEdit = () => {
    setTemplateExercises(
      exercises.map(({ name, sets, reps, weight,done }) => ({ name, sets, reps, weight,done }))
    );
    setIsEditMode(false);
  };

  const updateExercise = (index: number, field: keyof ExerciseTemplate, value: string | number) => {
    setTemplateExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const addExercise = () => {
    setTemplateExercises((prev) => [
      ...prev,
      { name: "New Exercise", sets: "3", reps: "10-12", weight: 0, done:false },
    ]);
  };

  const removeExercise = (index: number) => {
    Alert.alert("Remove Exercise", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setTemplateExercises((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const toggleDone = (index: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, done: !ex.done } : ex))
    );
  };

  if (!initialWorkoutData[id]) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <Text>Day not found</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView
  style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 100, backgroundColor: themedColors.back,               // same as your original
  }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>{initialWorkoutData[id].focus}</Text>
          {!isEditMode ? (
            <View style={{ marginTop:25, marginRight:25}}>
            <TouchableOpacity onPress={() => setIsEditMode(true)}>
              <Ionicons name="pencil" size={24} color={themedColors.text} />
            </TouchableOpacity></View>
          ) : (
            <View style={{ flexDirection: "row", gap: 16, marginTop:25, marginRight:25 }}>
              <TouchableOpacity onPress={addExercise}>
                <Ionicons name="add-circle" size={28} color="#4CAF50"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetToDefault}>
                <Ionicons name="refresh-circle" size={28} color="#FFA500"/>
              </TouchableOpacity>
            </View>
          )}
        </View>
  {/* Header is already outside — we just render the list items directly */}
  {(isEditMode ? templateExercises : exercises).map((item, index) => (
    <View key={index} style={[styles.card, { padding: 12 }]}>
      {isEditMode ? (
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={item.name}
            onChangeText={(text) => updateExercise(index, "name", text)}
            placeholder="Exercise name"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={item.sets}
            onChangeText={(text) => updateExercise(index, "sets", text)}
            keyboardType="numeric"
            placeholder="Sets"
          />
          <TextInput
            style={styles.input}
            value={item.reps}
            onChangeText={(text) => updateExercise(index, "reps", text)}
            placeholder="Reps (e.g. 8-12)"
          />
          <TextInput
            style={styles.input}
            value={displayWeight(item.weight, isMetric)}
            onChangeText={(text) => {
              const kgValue = inputToKg(text, isMetric);
              updateExercise(index, "weight", kgValue);
            }}
            keyboardType="decimal-pad"
            placeholder={`Weight (${isMetric ? "kg" : "lbs"})`}
          />

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeExercise(index)}
          >
            <Ionicons name="trash" size={24} color="#f44336" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={globalStyles.checkboxContainer}
            onPress={() => toggleDone(index)}
          >
            <View
              style={[
                globalStyles.checkbox,
                item.done && globalStyles.checkboxDone,
              ]}
            >
              {item.done && <Text style={globalStyles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exercisesText}>
              {item.sets} sets × {item.reps}
            </Text>
            <Text style={styles.exercisesText}>
              Weight: {displayWeight(item.weight, isMetric)} {isMetric ? "kg" : "lbs"}
            </Text>
          </View>

          <Text style={{ color: item.done ? "#4CAF50" : "#888" }}>
            {item.done ? "Done" : ""}
          </Text>
        </View>
      )}
    </View>
  ))}

  {/* Footer content — same as ListFooterComponent */}
  {isEditMode && (
    <>
      <TouchableOpacity style={styles.saveButton} onPress={saveTemplate}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
      </TouchableOpacity>
    </>
  )}

  {!isEditMode && (
    <TouchableOpacity style={globalStyles.backButton}><Link href={{pathname: "/"}}>
      <Text style={globalStyles.backText}>Back to Plan</Text>
    </Link></TouchableOpacity>
  )}</View>
</ScrollView>
    </SafeAreaView>
  );
}