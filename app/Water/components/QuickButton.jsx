import React from "react";
import { Button } from "react-native";

export default function QuickButton({ amount, onPress }) {
  return <Button title={`+${amount} ml`} onPress={() => onPress(amount)} color="#00bfff" />;
}
