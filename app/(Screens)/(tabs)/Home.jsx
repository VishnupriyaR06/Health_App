import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const calculateCalories = ({ age, gender, weight, height }) => {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultiplier = 1.55; // moderate (you can change later)

  return Math.round(bmr * activityMultiplier);
};

export default function Home() {
  const { age, gender, weight, height } = useLocalSearchParams();

  const dailyCalories = calculateCalories({
    age: Number(age),
    gender,
    weight: Number(weight),
    height: Number(height),
  });

  const burnedCalories = 238; // example (steps/workout later)
  const progress = Math.min(
    (burnedCalories / dailyCalories) * 100,
    100
  );

  
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.hi}>Hi</Text>
          <Text style={styles.name}>Name</Text>
        </View>
      </View>

      {/* CALORIES CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconCircle} />
          <Text style={styles.cardTitle}>Calories</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.smallText}>{burnedCalories}</Text>
<Text style={styles.smallText}>{dailyCalories}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View
  style={[
    styles.progressFill,
    { width: `${progress}%` },
  ]}
/>
        </View>

        {/* Goals */}
        <View style={styles.goal}>
          <View style={styles.iconCircle} />
          <Text style={styles.goalText}>Goal Name</Text>
        </View>

        <View style={styles.goal}>
          <View style={styles.iconCircle} />
          <Text style={styles.goalText}>Goal Name</Text>
        </View>
      </View>

      {/* OTHER EXERCISES */}
      <View style={styles.exerciseCard}>
        <Text style={styles.sectionTitle}>Other Exercises</Text>

        <View style={styles.grid}>
          <Exercise icon="barbell-outline" label="Weight" />
          <Exercise icon="walk-outline" label="Workout" />
          <Exercise icon="footsteps-outline" label="Step" />
          <Exercise icon="moon-outline" label="Sleep" />
          <Exercise icon="water-outline" label="Water" />
          <Exercise icon="add" label="Add" />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* EXERCISE BUTTON */
function Exercise({ icon, label }) {
  return (
    <TouchableOpacity style={styles.exerciseItem}>
      <View style={styles.exerciseIcon}>
        <Ionicons name={icon} size={22} color="#555" />
      </View>
      <Text style={styles.exerciseText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    marginRight: 12,
  },
  hi: {
    fontSize: 14,
    color: "#333",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  smallText: {
    fontSize: 12,
    color: "#666",
  },
  progressBg: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "35%",
    height: "100%",
    backgroundColor: "#4FC3C7",
  },
  goal: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  goalText: {
    fontSize: 14,
    color: "#444",
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  exerciseItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  exerciseText: {
    fontSize: 12,
    color: "#555",
  },
});
