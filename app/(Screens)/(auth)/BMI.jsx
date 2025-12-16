import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function BMI() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBmi] = useState("0.0");

  // Load all user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedGender = await AsyncStorage.getItem("userGender");
        const storedAge = await AsyncStorage.getItem("userAge");
        const storedWeight = await AsyncStorage.getItem("userWeight");
        const storedHeight = await AsyncStorage.getItem("userHeight");

        if (storedGender) setGender(storedGender);
        if (storedAge) setAge(Number(storedAge));
        if (storedWeight) setWeight(Number(storedWeight));
        if (storedHeight) setHeight(Number(storedHeight));
      } catch (error) {
        console.log("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  // Calculate BMI whenever weight or height changes
  useEffect(() => {
    const heightM = height / 100;
    const calculatedBmi =
      weight > 0 && heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : "0.0";
    setBmi(calculatedBmi);

    // Save BMI to AsyncStorage
    const saveBmi = async () => {
      try {
        await AsyncStorage.setItem("userBMI", calculatedBmi.toString());
      } catch (error) {
        console.log("Error saving BMI:", error);
      }
    };
    saveBmi();
  }, [weight, height]);

  // 🔹 BMI Category
  const getBMICategory = (bmiValue) => {
    const bmiNum = Number(bmiValue);
    if (bmiNum < 18.5) return t("underweight");
    if (bmiNum < 25) return t("normal");
    if (bmiNum < 30) return t("overweight");
    return t("obese");
  };

  const handleContinue = () => {
    router.push({
      pathname: "/TrainingLevel",
      params: {
        gender: gender,
        age: age.toString(),
        weight: weight.toString(),
        height: height.toString(),
        bmi: bmi.toString(),
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{t("yourData")}</Text>
      <Text style={styles.subtitle}>{t("bmiDescription")}</Text>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{t("gender")}: {gender}</Text>
          <Text style={styles.infoText}>{t("age")}: {age}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{t("weight")}: {weight} kg</Text>
          <Text style={styles.infoText}>{t("height")}: {height} cm</Text>
        </View>

        {/* BMI Result */}
        <View style={styles.bmiBox}>
          <Text style={styles.bmiValue}>{bmi}</Text>
          <Text style={styles.bmiLabel}>
            {t("bmi")} • {getBMICategory(bmi)}
          </Text>
        </View>

        {/* Language Switch */}
        <View style={styles.langRow}>
          <TouchableOpacity onPress={() => i18n.changeLanguage("ta")}>
            <Text style={styles.langText}>தமிழ்</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => i18n.changeLanguage("en")}>
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4FAFB",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
    color: "#0F172A",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginVertical: 10,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 25,
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  infoText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  bmiBox: {
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 25,
    borderRadius: 18,
    backgroundColor: "#ECFEFF",
  },

  bmiValue: {
    fontSize: 46,
    fontWeight: "800",
    color: "#06B6D4",
  },

  bmiLabel: {
    fontSize: 17,
    marginTop: 6,
    fontWeight: "600",
    color: "#0F172A",
  },

  langRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
  },

  langText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0891B2",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E0F2FE",
  },

  button: {
    marginTop: 40,
    backgroundColor: "#39C5CC",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
