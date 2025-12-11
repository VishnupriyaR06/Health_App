import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/Weight")}>
        <Text style={styles.text}>Weight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Height")}>
        <Text style={styles.text}>Height</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    padding: 15,
    backgroundColor: "#39C5CC",
    marginVertical: 10,
    borderRadius: 10,
  },
  text: { color: "white", fontSize: 20, fontWeight: "bold" },
});
