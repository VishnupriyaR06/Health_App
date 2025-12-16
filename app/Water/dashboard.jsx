import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
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

  /* ✅ GET PARAMS */
  const { weight, height } = useLocalSearchParams();

  /* ✅ CONVERT PARAMS */
  const userWeight = weight ? Number(weight) : null;
  const userHeight = height ? Number(height) : null;

  /* -------------------- LOAD DATA -------------------- */
  const loadData = async () => {
    try {
      const today = new Date().toDateString();
      const lastDate = await AsyncStorage.getItem("lastUpdatedDate");

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

      let goal = 2000;
      if (userWeight && userWeight > 0) {
        goal = userWeight * 35;
      }

      setDailyGoal(goal);
      await AsyncStorage.setItem("dailyGoal", goal.toString());

      const lastAmt = await AsyncStorage.getItem("lastAddedAmount");
      setLastAddedAmount(lastAmt ? parseInt(lastAmt) : 0);
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [userWeight])
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
      Alert.alert("🎉 Goal Achieved!", "You reached your water goal!");
    }
  };

  /* -------------------- REMOVE WATER -------------------- */
  const removeWater = async () => {
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

  /* -------------------- NOTIFICATIONS -------------------- */
  const scheduleNotifications = async () => {
    if (!Device.isDevice) return;

    const scheduled = await AsyncStorage.getItem("notificationsScheduled");
    if (scheduled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Hydration Reminder",
        body: "Time to drink water!",
        sound: true,
      },
      trigger: { seconds: 7200, repeats: true },
    });

    await AsyncStorage.setItem("notificationsScheduled", "true");
  };

  useEffect(() => {
    scheduleNotifications();
  }, []);

  const progress = waterToday / dailyGoal;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hydration Tracker</Text>
        <Text style={styles.headerSubtitle}>
          Height: {userHeight ?? "--"} cm | Weight: {userWeight ?? "--"} kg
        </Text>
      </View>

      {/* PROGRESS */}
      <CircularProgress
        progress={progress}
        waterToday={waterToday}
        dailyGoal={dailyGoal}
      />

      {/* STATS */}
      <View style={styles.statsContainer}>
        <Stat value={waterToday} label="ml consumed" />
        <Stat value={dailyGoal - waterToday} label="ml remaining" />
        <Stat value={`${userWeight ?? "--"} kg`} label="Weight" />
        <Stat value={`${userHeight ?? "--"} cm`} label="Height" />
      </View>

      {/* QUICK ADD */}
      <View style={styles.quickButtonsContainer}>
        {[150, 250, 500].map((amt) => (
          <QuickButton key={amt} amount={amt} onPress={addWater} />
        ))}
      </View>

      {/* CUSTOM INPUT */}
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

      {/* REMOVE */}
      <TouchableOpacity style={styles.backspaceButton} onPress={removeWater}>
        <Text style={styles.backspaceButtonText}>
          <Ionicons name="backspace-outline" size={18} /> Remove Water
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* -------------------- STAT COMPONENT -------------------- */
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
