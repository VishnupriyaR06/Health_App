import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Let’s get started by setting up your profile
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(Screens)/(auth)/Register")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { marginBottom: 30 },
  button: {
    backgroundColor: "#39C5CC",
    padding: 15,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18 },
});
