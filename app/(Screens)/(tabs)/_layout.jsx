import { Tabs } from "expo-router";
import CurvedBottomBar from "../(nav)/CurvedBottom";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CurvedBottomBar {...props} />}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Chat" />
      <Tabs.Screen name="Goal" />
      <Tabs.Screen name="Snap" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}
