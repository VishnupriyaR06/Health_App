import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const userData = { name, phone, email, password };
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      Alert.alert("Success", "Account created successfully!");
      router.push("/(Screens)/(auth)/Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(Screens)/(auth)/Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#39C5CC",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18 },
  link: { textAlign: "center", marginTop: 20, color: "#39C5CC" },
});
