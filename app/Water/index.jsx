import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Water() {
  const router = useRouter();
  const [weight, setWeight] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const w = await AsyncStorage.getItem("weight");
      setWeight(parseFloat(w));
      setDailyGoal(Math.round(parseFloat(w) * 33)); // ml
    };
    loadData();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem("dailyGoal", dailyGoal.toString());
    await AsyncStorage.setItem("waterToday", "0");
    await AsyncStorage.setItem("lastUpdatedDate", new Date().toDateString());
    router.replace("/Water/dashboard");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Your daily water goal: {(dailyGoal / 1000).toFixed(2)} Liters
      </Text>
      <Button title="Save & Continue" onPress={handleSave} />
    </View>
  );
}
