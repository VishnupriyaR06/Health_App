import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TrainingLevel() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selected, setSelected] = useState("Beginner");
  const levels = ["Beginner", "Intermediate", "Professional"];

  const [userData, setUserData] = useState({
    weight: params.weight || "0",
    height: params.height || "0",
    age: params.age || "",
    gender: params.gender || "",
  });

  // Load saved training level if exists
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedLevel = await AsyncStorage.getItem("userTrainingLevel");
        if (storedLevel) setSelected(storedLevel);

        const storedWeight = await AsyncStorage.getItem("userWeight");
        const storedHeight = await AsyncStorage.getItem("userHeight");
        const storedAge = await AsyncStorage.getItem("userAge");
        const storedGender = await AsyncStorage.getItem("userGender");

        setUserData({
          weight: storedWeight || userData.weight,
          height: storedHeight || userData.height,
          age: storedAge || userData.age,
          gender: storedGender || userData.gender,
        });
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleContinue = async () => {
    try {
      // Save all data to AsyncStorage
      await AsyncStorage.setItem("userTrainingLevel", selected);
      await AsyncStorage.setItem("userWeight", userData.weight.toString());
      await AsyncStorage.setItem("userHeight", userData.height.toString());
      await AsyncStorage.setItem("userAge", userData.age.toString());
      await AsyncStorage.setItem("userGender", userData.gender);

      // Navigate to Home with params
      router.push({
        pathname: "/(tabs)/Home",
        params: {
          ...userData,
          level: selected,
        },
      });
    } catch (error) {
      console.log("Error saving training level:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Training Level</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      <View style={styles.buttonContainer}>
        {levels.map((level) => {
          const isActive = selected === level;
          return (
            <TouchableOpacity
              key={level}
              style={[styles.levelButton, isActive && styles.activeButton]}
              onPress={() => setSelected(level)}
            >
              <Text style={[styles.levelText, isActive && styles.activeText]}>
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginTop: 40 },
  subtitle: { fontSize: 14, color: "#777", textAlign: "center", marginTop: 12, lineHeight: 20 },
  buttonContainer: { marginTop: 40 },
  levelButton: { borderWidth: 1, borderColor: "#4FC3C7", paddingVertical: 14, borderRadius: 30, marginBottom: 16, alignItems: "center" },
  activeButton: { backgroundColor: "#4FC3C7" },
  levelText: { fontSize: 16, fontWeight: "600", color: "#4FC3C7" },
  activeText: { color: "#fff" },
  continueButton: { marginTop: 30, backgroundColor: "#4FC3C7", paddingVertical: 16, borderRadius: 30, alignItems: "center" },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
