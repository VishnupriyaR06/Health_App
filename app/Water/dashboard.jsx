import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import CircularProgress from "./components/CircularProgress";
import AddWaterSheet from "./components/AddWaterSheet";

export default function Dashboard() {
  const [waterToday, setWaterToday] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);

  const loadData = async () => {
    const today = new Date().toDateString();
    const lastDate = await AsyncStorage.getItem("lastUpdatedDate");
    let water = await AsyncStorage.getItem("waterToday");
    water = water ? parseInt(water) : 0;

    if (lastDate !== today) {
      water = 0;
      await AsyncStorage.setItem("waterToday", "0");
      await AsyncStorage.setItem("lastUpdatedDate", today);
    }

    setWaterToday(water);
    const goal = await AsyncStorage.getItem("dailyGoal");
    if (goal) setDailyGoal(parseInt(goal));
  };

  useEffect(() => {
    loadData();
    scheduleNotifications();
  }, []);

  const addWater = async (amount) => {
    const newTotal = waterToday + amount;
    setWaterToday(newTotal);
    await AsyncStorage.setItem("waterToday", newTotal.toString());
  };

const scheduleNotifications = async () => {
  if (Device.isDevice) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Example: schedule notification every 1 hour
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hydration Reminder",
        body: "Time to drink water 💧",
      },
      trigger: {
        seconds: 60, // 1 hour
        repeats: true, // must be true to repeat
        type: "timeInterval", // required
      },
    });
  }
};

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Today Water Intake</Text>
      <CircularProgress progress={waterToday / dailyGoal} />
      <Text style={{ marginTop: 10 }}>
        {waterToday} ml / {dailyGoal} ml
      </Text>
      <AddWaterSheet addWater={addWater} />
    </View>
  );
}
