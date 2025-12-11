import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Weight() {
  const scrollRef = useRef(null);
  const [weight, setWeight] = useState(75);
  const [unit, setUnit] = useState("kg");

  const itemWidth = 20;        // width of each tick (must match tickContainer.width)
  const max = 200;             // max tick value (0..199 or 1..200 depending on labels)
  const screenWidth = Dimensions.get("window").width;

  const sidePadding = screenWidth / 2 - itemWidth / 2;

  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const newValue = Math.round(x / itemWidth);
    // clamp between 0 and max - 1 (or max if you prefer)
    const clamped = Math.max(0, Math.min(newValue, max - 1));
    setWeight(clamped);
    // console.log appears in Metro terminal / DevTools
    console.log("Weight selected:", clamped);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: weight * itemWidth, animated: false });
    }
  }, [scrollRef]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>What Is Your Weight?</Text>

        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={styles.weightNumber}>{weight}</Text>
  <Text style={{ fontSize: 20, paddingTop:50,padding:10 }}>Kg</Text>
</View>

        <View style={styles.arrow} />

        <View style={[styles.centerLine, { left: screenWidth / 2 - 1 }]} />

        <View style={styles.scaleBackground}>
          <ScrollView
            horizontal
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
            snapToInterval={itemWidth}
            decelerationRate="fast"
            overScrollMode="never"
          >
            {Array.from({ length: max }).map((_, i) => (
              <View key={i} style={[styles.tickContainer, { width: itemWidth }]}>
                <View style={[styles.tick, { height: i % 10 === 0 ? 25 : 12 }]} />
                {i % 10 === 0 && <Text style={styles.label}>{i}</Text>}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.unitSwitch}>
          <TouchableOpacity
            style={[styles.unitButton, unit === "lb" && styles.activeUnit]}
            onPress={() => setUnit("lb")}
          >
            <Text style={[styles.unitText, unit === "lb" && styles.activeUnitText]}>lb</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.unitButton, unit === "kg" && styles.activeUnit]}
            onPress={() => setUnit("kg")}
          >
            <Text style={[styles.unitText, unit === "kg" && styles.activeUnitText]}>kg</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },

  title: {
    fontWeight: "bold",
    fontSize: 24,
    backgroundColor: "#C7E1FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    marginVertical: 10,
    color: "#555",
    paddingHorizontal: 10,
  },

  weightNumber: {
    fontSize: 60,
    fontWeight: "bold",
    marginTop: 20,
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#39C5CC",
    marginTop: 10,
    zIndex: 20,
  },

  centerLine: {
    width: 3,
    height: 70,
    backgroundColor: "#39C5CC",
    position: "absolute",
    top: 300, // tweak if needed to align visually with the scale
    zIndex: 15,
  },

  scaleBackground: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: 120,
    justifyContent: "center",
    marginTop: 20,
  },

  tickContainer: {
    alignItems: "center",
  },

  tick: {
    width: 2,
    backgroundColor: "#555",
  },

  label: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },

  unitSwitch: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 25,
    marginTop: 25,
    width: 140,
    height: 40,
    alignItems: "center",
    padding: 4,
  },

  unitButton: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  activeUnit: {
    backgroundColor: "#39C5CC",
  },

  unitText: {
    color: "#777",
    fontSize: 16,
  },

  activeUnitText: {
    color: "white",
    fontWeight: "bold",
  },

  continueButton: {
    marginTop: 30,
    backgroundColor: "#39C5CC",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  continueText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
