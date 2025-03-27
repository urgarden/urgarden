import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ? "light" : "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",

          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-garden/index"
        options={{
          title: "My Garden",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="leaf.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-care/index"
        options={{
          title: "Plant Care",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="hand.tap.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
