import React, { useState } from "react";
import { View, TextInput } from "react-native";
import QuickButton from "./QuickButton";

export default function AddWaterSheet({ addWater }) {
  const [custom, setCustom] = useState("");

  const addCustom = () => {
    const val = parseInt(custom);
    if (!isNaN(val)) addWater(val);
    setCustom("");
  };

  return (
    <View style={{ width: "100%", marginTop: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        {[150, 250, 500].map((amt) => (
          <QuickButton key={amt} amount={amt} onPress={addWater} />
        ))}
      </View>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          value={custom}
          onChangeText={setCustom}
          placeholder="Custom ml"
          keyboardType="numeric"
          style={{ borderWidth: 1, flex: 1, marginRight: 10, padding: 5 }}
        />
        <QuickButton amount={parseInt(custom) || 0} onPress={addCustom} />
      </View>
    </View>
  );
}
