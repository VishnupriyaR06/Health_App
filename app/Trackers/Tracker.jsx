import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

/* ---------------- DATA ---------------- */

const newTrackers = [
  { title: "Sleep Tracker", icon: "sleep", color: "#5DA9FF" },
  { title: "Medicine Tracker", icon: "pill", color: "#6ED6A8" },
  { title: "Heart Rate Tracker", icon: "heart", color: "#FF6B6B" },
  { title: "Respiratory Rate Tracker", icon: "lungs", color: "#5AC8FA" },
  { title: "Blood Glucose Tracker", icon: "pulse", color: "#9B59B6" },
];

const yourTrackers = [
  { title: "Calorie Tracker", icon: "fire", color: "#FF9F43" },
  { title: "Water Tracker", icon: "water", color: "#1ABCFE" },
  { title: "Steps Tracker", icon: "walk", color: "#1ABC9C" },
  { title: "Workout Tracker", icon: "run", color: "#3498DB" },
  { title: "Weight Tracker", icon: "scale-bathroom", color: "#8E44AD" },
];

/* ---------------- COMPONENT ---------------- */

const TrackerItem = ({ title, icon, color }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.row}>
    <View style={[styles.iconCircle, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
    </View>
    <Text style={styles.rowText}>{title}</Text>
  </TouchableOpacity>
);

/* ---------------- SCREEN ---------------- */

export default function Trackers() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trackers</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* NEW TRACKERS */}
        <Text style={styles.sectionTitle}>New Trackers</Text>
        {newTrackers.map((item, index) => (
          <TrackerItem key={index} {...item} />
        ))}

        {/* SPACE */}
        <View style={{ height: 24 }} />

        {/* YOUR TRACKERS */}
        <Text style={styles.sectionTitle}>Your Trackers</Text>
        {yourTrackers.map((item, index) => (
          <TrackerItem key={index} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: "#000",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 12,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  rowText: {
    fontSize: 15,
    color: "#333",
  },
});
