import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CurvedBottomBar({ state, navigation }) {
  return (
    <View style={styles.container}>
      {/* SVG Background */}
      <Svg width="100%" height="80" viewBox="0 0 400 40">
        <Path
          fill="#fff"
          d="
            M0 0
            H130
            C165 0 165 40 200 40
            C235 40 235 0 270 0
            H400
            V90
            H0
            Z
          "
        />
      </Svg>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
            >
              <Text style={{ color: isFocused ? "#000" : "#999" }}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  tabRow: {
    position: "absolute",
    bottom: 0,
    height: 80,
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
