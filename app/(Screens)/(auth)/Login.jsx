import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const storedData = JSON.parse(data);
        if (email === storedData.email && password === storedData.password) {
          router.push("/(Screens)/(auth)/Gender");
        } else {
          Alert.alert("Error", "Invalid email or password");
        }
      } else {
        Alert.alert("Error", "No registered user found");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(Screens)/(auth)/Register")}>
        <Text style={styles.link}>Don’t have an account? Register</Text>
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
