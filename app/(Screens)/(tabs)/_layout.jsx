
import { Tabs } from "expo-router";
import CurvedBottomBar from "../(nav)/CurvedBottom";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => {
        const routeName =
          props.state.routes[props.state.index].name;

        // 🚫 Hide curved bottom bar on Chat screen
        if (routeName === "Chat") {
          return null;
        }

        return <CurvedBottomBar {...props} />;
      }}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Chat" />
      <Tabs.Screen name="Goal" />
      <Tabs.Screen name="Snap" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}
