import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 40;

export default function Age() {
  const [age, setAge] = useState(28);
  const scrollRef = useRef();

  const MIN = 10;
  const MAX = 80;

  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const value = Math.round(x / ITEM_WIDTH) + MIN;

    if (value >= MIN && value <= MAX) {
      setAge(value);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>How Old Are You?</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>

        {/* Selected age */}
        <Text style={styles.ageNumber}>{age}</Text>

        {/* Arrow */}
        <View style={styles.arrow} />

        {/* Ruler */}
        <View style={styles.rulerBox}>
          <View style={styles.centerLineLeft} />
          <View style={styles.centerLineRight} />

          <ScrollView
            horizontal
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: width / 2 - ITEM_WIDTH }}
          >
            {Array.from({ length: MAX - MIN + 1 }).map((_, i) => {
              const value = MIN + i;

              return (
                <View key={i} style={styles.itemContainer}>
                  <Text
                    style={[
                      styles.itemText,
                      value === age && styles.selectedText,
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Continue */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
    paddingHorizontal: 20,
    fontSize: 13,
  },

  ageNumber: {
    fontSize: 55,
    fontWeight: "800",
    marginTop: 20,
  },

  arrow: {
    width: 0,
    height: 0,
    marginTop: 4,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#39C5CC",
  },

  rulerBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#EEE",
    marginTop: 20,
    justifyContent: "center",
  },

  centerLineLeft: {
    position: "absolute",
    left: width / 2 - ITEM_WIDTH / 2,
    height: 60,
    width: 2,
    backgroundColor: "#39C5CC",
  },

  centerLineRight: {
    position: "absolute",
    left: width / 2 + ITEM_WIDTH / 2,
    height: 60,
    width: 2,
    backgroundColor: "#39C5CC",
  },

  itemContainer: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },

  itemText: {
    fontSize: 22,
    color: "#999",
    fontWeight: "600",
  },

  selectedText: {
    fontSize: 28,
    color: "#333",
    fontWeight: "800",
  },

  button: {
    marginTop: 40,
    width: "90%",
    paddingVertical: 15,
    backgroundColor: "#39C5CC",
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
