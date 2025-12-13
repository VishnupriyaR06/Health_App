import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function TrainingLevel() {
  const router = useRouter();
  const [selected, setSelected] = useState("Beginner");

  const levels = ["Beginner", "Intermediate", "Professional"];

  const handleContinue = () => {
    router.push("/(tabs)/Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Your Training Level</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      {/* Level Buttons */}
      <View style={styles.buttonContainer}>
        {levels.map((level) => {
          const isActive = selected === level;

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                isActive && styles.activeButton,
              ]}
              onPress={() => setSelected(level)}
            >
              <Text
                style={[
                  styles.levelText,
                  isActive && styles.activeText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 40,
  },
  levelButton: {
    borderWidth: 1,
    borderColor: "#4FC3C7",
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 16,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4FC3C7",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4FC3C7",
  },
  activeText: {
    color: "#fff",
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: "#4FC3C7",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
