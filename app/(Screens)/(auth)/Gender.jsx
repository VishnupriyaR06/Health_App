import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";   // <-- IMPORT ROUTER
import { useLocalSearchParams } from "expo-router";
 
export default function Gender() {
  const [selectedGender, setSelectedGender] = useState(null);
  const router = useRouter(); // <-- INITIALIZE ROUTER
 
 
  const handleSelect = (gender) => {
    setSelectedGender(gender);
  };
const handleContinue = () => {
  if (!selectedGender) {
    alert("Please select a gender");
    return;
  }
 
  router.push({
    pathname: "/Age",
    params: { gender: selectedGender },
  });
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
       
        <Text style={styles.title}>What's Your Gender</Text>
 
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
 
        {/* Male */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleSelect("male")}
        >
          <View
            style={[
              styles.genderCircle,
              selectedGender === "male" && styles.selectedCircle,
            ]}
          >
            <FontAwesome5
              name="mars"
              size={50}
              color={selectedGender === "male" ? "white" : "#39C5CC"}
            />
          </View>
          <Text style={styles.label}>Male</Text>
        </TouchableOpacity>
 
        {/* Female */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleSelect("female")}
        >
          <View
            style={[
              styles.genderCircle,
              selectedGender === "female" && styles.selectedCircle,
            ]}
          >
            <FontAwesome5
              name="venus"
              size={50}
              color={selectedGender === "female" ? "white" : "#39C5CC"}
            />
          </View>
          <Text style={styles.label}>Female</Text>
        </TouchableOpacity>
 
        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
 
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
 
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
 
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
    paddingHorizontal: 20,
    fontSize: 13,
  },
 
  optionContainer: {
    alignItems: "center",
    marginTop: 20,
  },
 
  genderCircle: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#39C5CC",
    alignItems: "center",
    justifyContent: "center",
  },
 
  femaleCircle: {
    borderColor: "#39C5CC",
  },
 
  selectedCircle: {
    backgroundColor: "#39C5CC",
    borderColor: "#39C5CC",
  },
 
  label: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    color: "#222",
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