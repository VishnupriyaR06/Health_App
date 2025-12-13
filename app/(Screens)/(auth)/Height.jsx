import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter,useLocalSearchParams } from "expo-router";
 
const { width } = Dimensions.get("window");
const ITEM_WIDTH = 20;
 
export default function Height() {
  const router = useRouter();  
   
    const { gender, age , weight } = useLocalSearchParams();
  const scrollRef = useRef();
  const [height, setHeight] = useState(170);
 
 
  const MIN = 120;
  const MAX = 220;
  const range = MAX - MIN;
 
  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const value = Math.round(x / ITEM_WIDTH) + MIN;
 
    if (value >= MIN && value <= MAX) {
      setHeight(value);
    }
  };
 
   const handleContinue = () => {
    router.push({
      pathname: "/BMI",
      params: { gender, age, weight, height },
    });
  };



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
 
        <Text style={styles.title}>What Is Your Height?</Text>
        <Text style={styles.subtitle}>Scroll to adjust your height</Text>
 
        <View style={styles.valueRow}>
          <Text style={styles.value}>{height}</Text>
          <Text style={styles.unit}>cm</Text>
        </View>
 
        {/* Pointer Arrow */}
        <View style={styles.arrow} />
 
        {/* Ruler */}
        <View style={styles.rulerBox}>
          <ScrollView
            horizontal
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: width / 2 - 20 }}
          >
            {Array.from({ length: range + 1 }).map((_, i) => {
              const val = MIN + i;
              const isMajor = val % 5 === 0;
 
              return (
                <View key={i} style={styles.tickContainer}>
                  <View
                    style={[
                      styles.tick,
                      { height: isMajor ? 30 : 15, backgroundColor: isMajor ? "#333" : "#666" },
                    ]}
                  />
 
                  {isMajor && (
                    <Text style={styles.tickLabel}>{val}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
 
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
 
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
 
  title: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  subtitle: { textAlign: "center", color: "#666", marginVertical: 10 },
 
  valueRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 10 },
  value: { fontSize: 55, fontWeight: "700" },
  unit: { fontSize: 20, marginLeft: 4, color: "#666", marginBottom: 8 },
 
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
  },
 
  rulerBox: {
    height: 120,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#EEE",
    marginTop: 20,
  },
 
  tickContainer: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },
 
  tick: {
    width: 2,
    backgroundColor: "#666",
  },
 
  tickLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
  },
 
  button: {
    marginTop: 30,
    width: "90%",
    padding: 15,
    backgroundColor: "#39C5CC",
    borderRadius: 10,
    alignItems: "center",
  },
 
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});