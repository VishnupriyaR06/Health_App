import { Text, View } from "react-native";

export default function CircularProgress({ progress }) {
  const percentage = Math.round(progress * 100);
  return (
    <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20 }}>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 10,
          borderColor: "#00bfff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>{percentage}%</Text>
      </View>
    </View>
  );
}
