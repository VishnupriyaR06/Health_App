import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Water() {
  const router = useRouter();
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);

  const params = useLocalSearchParams();
  const weightParam = params.weight;
  const heightParam = params.height;

  useEffect(() => {
    const loadData = async () => {
      const w = Number(weightParam) || 0;
      const h = Number(heightParam) || 0;
      setWeight(w);
      setHeight(h);
      setDailyGoal(Math.round(w * 33)); // ml water goal
    };
    loadData();
  }, [weightParam, heightParam]);

 const handleSave = async () => {
  await AsyncStorage.setItem("dailyGoal", dailyGoal.toString());
  await AsyncStorage.setItem("waterToday", "0");
  await AsyncStorage.setItem("lastUpdatedDate", new Date().toDateString());

  router.push({
    pathname: "/Water/dashboard",
    params: {
      weight: weight.toString(),
      height: height.toString(),
    },
  });
};

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Your weight: {weight} kg
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Your height: {height} cm
      </Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Your daily water goal: {(dailyGoal / 1000).toFixed(2)} Liters
      </Text>

      <Button title="Save & Continue" onPress={handleSave} />
    </View>
  );
}
