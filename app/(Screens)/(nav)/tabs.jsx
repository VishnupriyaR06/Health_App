import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, TouchableOpacity, Image } from "react-native";
import CurvedBottombar from "../(nav)/CurvedBottom.jsx"; // your custom component

const Tab = createBottomTabNavigator();

/* ---------------- Custom Button for Curved Bar ---------------- */
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -15,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#fff",
        elevation: 5,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

/* ---------------- Tabs Navigation ---------------- */
export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        // hide default background
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          elevation: 0,
          borderTopWidth: 0,
          height: 70,
        },
      }}

      // Inject your curved bottom bar
      tabBar={(props) => <CurvedBottombar {...props} />}
    >
      {/* ---------------- Tab Screens ---------------- */}

      <Tab.Screen
  name="Home"
  options={{
    href: "/(tabs)/Home",
    tabBarIcon: () => (
      <Image
        source={require("../../../assets/images/home.png")}
        style={{ width: 22, height: 22 }}
      />
    ),
  }}
/>

    </Tab.Navigator>
  );
}
