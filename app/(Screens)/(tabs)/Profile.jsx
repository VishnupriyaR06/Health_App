import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- Header Gradient ---------------- */}
        <LinearGradient
          colors={["#A0E3E8", "#FFFFFF"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.hiText}>Hi</Text>
              <Text style={styles.nameText}>Name</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ---------------- Track Food Card ---------------- */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>🍽️ Track Food</Text>
            <TouchableOpacity>
              <Text style={styles.plusIcon}>＋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Want to Start</Text>
            <Text style={styles.subCardSubtitle}>
              intermittent fasting
            </Text>
          </View>

          {/* Meal Progress */}
          <View style={styles.mealRow}>
            <View style={styles.mealCol}>
              <Text>Breakfast</Text>
              <Text style={styles.percent}>35%</Text>
            </View>

            <View style={styles.mealCol}>
              <Text>Lunch</Text>
              <Text style={styles.percent}>40%</Text>
            </View>

            <View style={styles.mealCol}>
              <Text>Dinner</Text>
              <Text style={styles.percent}>20%</Text>
            </View>

            <View style={styles.mealCol}>
              <Text>Snacks</Text>
              <Text style={styles.percent}>5%</Text>
            </View>
          </View>
        </View>

        {/* ---------------- Big Card Section ---------------- */}
        <View style={styles.bigCard}>
          {renderItem("⚖️", "Weight", "0 kg of 3 kg Gained")}
          {renderItem("🔥", "Workout", "Goal: 854 cal")}
          {renderItem("👣", "Step", "Goal: 10,000 steps")}
          {renderItem("💤", "Sleep", "Set Up Sleep Goal")}
          {renderItem("💧", "Water", "Goal: 8 glasses")}

          {/* Track More */}
          <View style={styles.moreRow}>
            <Text style={styles.morePlus}>＋</Text>
            <Text style={styles.moreText}>Track More</Text>
          </View>

          {/* Up Arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>⌃</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Reusable Item Component ---------------- */

function renderItem(icon, title, subtitle) {
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.plusIcon}>＋</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  header: {
    height: 150,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#FFF",
    marginRight: 15,
  },
  hiText: {
    fontSize: 16,
    color: "#555",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    marginHorizontal: 20,
    marginTop: -40,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plusIcon: {
    fontSize: 24,
    color: "#555",
  },

  subCard: {
    backgroundColor: "#F3F3F3",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  subCardTitle: {
    fontWeight: "600",
  },
  subCardSubtitle: {
    color: "#666",
    fontSize: 12,
  },

  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  mealCol: {
    alignItems: "center",
  },
  percent: {
    fontWeight: "bold",
  },

  bigCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#F3F3F3",
    borderRadius: 20,
    padding: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    color: "#666",
    fontSize: 12,
  },

  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  morePlus: {
    fontSize: 26,
    marginRight: 10,
  },
  moreText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  arrowContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  arrow: {
    fontSize: 22,
  },
});
