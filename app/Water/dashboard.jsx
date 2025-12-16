import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* -------------------- QUICK BUTTON -------------------- */
function QuickButton({ amount, onPress }) {
  return (
    <TouchableOpacity
      style={styles.quickButton}
      onPress={() => onPress(amount)}
      activeOpacity={0.8}
    >
      <Text style={styles.quickButtonText}>+{amount} ml</Text>
    </TouchableOpacity>
  );
}

/* -------------------- CIRCULAR PROGRESS -------------------- */
function CircularProgress({ progress, waterToday, dailyGoal }) {
  const percentage = Math.min(100, Math.round(progress * 100));
  const remaining = Math.max(0, dailyGoal - waterToday);

  const getCircleColor = () => {
    if (progress < 0.3) return "#ff6b6b";
    if (progress < 0.7) return "#ffa726";
    if (progress < 1) return "#42a5f5";
    return "#4caf50";
  };

  return (
    <View style={styles.progressContainer}>
      <View style={styles.circleOuter}>
        <View style={[styles.circleInner, { borderColor: getCircleColor() }]}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.mlText}>
            {waterToday} / {dailyGoal} ml
          </Text>
        </View>
      </View>

      {remaining > 0 && (
        <Text style={{ marginTop: 10, color: "#666" }}>
          {remaining} ml remaining
        </Text>
      )}
    </View>
  );
}

/* -------------------- DASHBOARD -------------------- */
export default function Dashboard() {
  const [waterToday, setWaterToday] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [customInput, setCustomInput] = useState("");
  const [lastAddedAmount, setLastAddedAmount] = useState(0);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);

  const reminderRef = useRef(null);

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    try {
      const today = new Date().toDateString();
      const lastDate = await AsyncStorage.getItem("lastUpdatedDate");

      const storedWeight = await AsyncStorage.getItem("userWeight");
      const storedHeight = await AsyncStorage.getItem("userHeight");

      const userWeight = storedWeight ? Number(storedWeight) : null;
      const userHeight = storedHeight ? Number(storedHeight) : null;

      setWeight(userWeight);
      setHeight(userHeight);

      const goal = userWeight && userWeight > 0 ? userWeight * 35 : 2000;
      setDailyGoal(goal);
      await AsyncStorage.setItem("dailyGoal", goal.toString());

      let water = await AsyncStorage.getItem("waterToday");
      water = water ? parseInt(water) : 0;

      if (lastDate !== today) {
        water = 0;
        await AsyncStorage.multiSet([
          ["waterToday", "0"],
          ["lastUpdatedDate", today],
        ]);
      }

      setWaterToday(water);

      const lastAmt = await AsyncStorage.getItem("lastAddedAmount");
      setLastAddedAmount(lastAmt ? parseInt(lastAmt) : 0);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  /* -------------------- ADD WATER -------------------- */
  const addWater = async (amount) => {
    if (amount <= 0) return;

    const newTotal = waterToday + amount;
    setWaterToday(newTotal);
    setLastAddedAmount(amount);

    await AsyncStorage.multiSet([
      ["waterToday", newTotal.toString()],
      ["lastAddedAmount", amount.toString()],
    ]);

    setCustomInput("");

    if (newTotal >= dailyGoal) {
      Alert.alert("🎉 Goal Achieved!", "You reached your daily water goal!");
    }
  };

  /* -------------------- REMOVE WATER -------------------- */
  const removeWater = () => {
    if (waterToday === 0) return;

    Alert.alert("Remove Water", "Choose amount", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove 100 ml", onPress: () => removeAmount(100) },
      { text: "Remove Last Added", onPress: removeLastAdded },
    ]);
  };

  const removeAmount = async (amt) => {
    const newTotal = Math.max(0, waterToday - amt);
    setWaterToday(newTotal);
    await AsyncStorage.setItem("waterToday", newTotal.toString());
  };

  const removeLastAdded = async () => {
    if (lastAddedAmount > 0) {
      await removeAmount(lastAddedAmount);
      setLastAddedAmount(0);
    }
  };

  /* -------------------- HYDRATION REMINDER (NO EXPO NOTIFICATIONS) -------------------- */
  const startHydrationReminder = async () => {
    const alreadyStarted = await AsyncStorage.getItem("reminderStarted");
    if (alreadyStarted) return;

    reminderRef.current = setInterval(() => {
      Alert.alert("💧 Hydration Reminder", "Time to drink water!");
    }, 2 * 60 * 60 * 1000); // every 2 hours

    await AsyncStorage.setItem("reminderStarted", "true");
  };

  useEffect(() => {
    startHydrationReminder();
    return () => reminderRef.current && clearInterval(reminderRef.current);
  }, []);

  const progress = waterToday / dailyGoal;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hydration Tracker</Text>
        <Text style={styles.headerSubtitle}>
          Height: {height ?? "--"} cm | Weight: {weight ?? "--"} kg
        </Text>
      </View>

      <CircularProgress
        progress={progress}
        waterToday={waterToday}
        dailyGoal={dailyGoal}
      />

      <View style={styles.statsContainer}>
        <Stat value={waterToday} label="ml consumed" />
        <Stat value={Math.max(0, dailyGoal - waterToday)} label="ml remaining" />
        <Stat value={`${weight ?? "--"} kg`} label="Weight" />
        <Stat value={`${height ?? "--"} cm`} label="Height" />
      </View>

      <View style={styles.quickButtonsContainer}>
        {[150, 250, 500].map((amt) => (
          <QuickButton key={amt} amount={amt} onPress={addWater} />
        ))}
      </View>

      <View style={styles.customInputContainer}>
        <TextInput
          style={styles.customInput}
          value={customInput}
          onChangeText={setCustomInput}
          placeholder="Enter amount (ml)"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            const val = Number(customInput);
            if (val > 0) addWater(val);
          }}
        >
          <Text style={styles.actionButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backspaceButton} onPress={removeWater}>
        <Text style={styles.backspaceButtonText}>
          <Ionicons name="backspace-outline" size={18} /> Remove Water
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* -------------------- STAT -------------------- */
function Stat({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff", padding: 20 },
  header: { alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#1e90ff" },
  headerSubtitle: { color: "#555", marginTop: 4 },

  progressContainer: { alignItems: "center", marginVertical: 20 },
  circleOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#e6f7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  circleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: { fontSize: 36, fontWeight: "bold" },
  mlText: { fontSize: 16, color: "#666" },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  statBox: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1e90ff" },
  statLabel: { fontSize: 12, color: "#666" },

  quickButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickButton: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  quickButtonText: { color: "#fff", textAlign: "center" },

  customInputContainer: { flexDirection: "row", marginBottom: 12 },
  customInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  actionButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 10,
  },
  actionButtonText: { color: "#fff" },

  backspaceButton: {
    backgroundColor: "#ff6b6b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backspaceButtonText: { color: "#fff" },
});
