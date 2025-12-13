import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";   // <-- IMPORT ROUTER

export default function BMI() {
  const { gender, age, weight, height } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const router = useRouter(); // <-- INITIALIZE ROUTER
 
  // 🔹 Convert params to numbers
  const weightKg = Number(weight);
  const heightCm = Number(height);
  const heightM = heightCm / 100;
 
  // 🔹 Calculate BMI
  const bmi =
    weightKg > 0 && heightM > 0
      ? (weightKg / (heightM * heightM)).toFixed(1)
      : "0.0";
 
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
    pathname: "/(tabs)/Home",
    params: {
      age,
      gender,
      weight,
      height,
    },
  });
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{t("yourData")}</Text>
      <Text style={styles.subtitle}>{t("bmiDescription")}</Text>
 
      {/* Image */}
      <View style={styles.imageContainer}>
        {/* <Image
          source={require("../../assets/images/image83.png")}
          style={styles.image}
        /> */}
      </View>
 
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

           {/* Continue Button */}
                  <TouchableOpacity style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
        </View>
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
 
  imageContainer: {
    alignItems: "center",
    marginVertical: 25,
  },
 
  image: {
    width: 190,
    height: 190,
    resizeMode: "contain",
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
  },
 
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});