import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import FlashMessage from "react-native-flash-message";
import * as Notifications from "expo-notifications";
import { BACKGROUND_NOTIFICATION_TASK } from "@/task/notificationTask";
import { requestNotificationPermissions } from "@/hooks/requestPermission";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const registerBackgroundTask = async () => {
  try {
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log("Background notification task registered.");
  } catch (error) {
    console.error("Error registering background notification task:", error);
  }
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    registerBackgroundTask(); // Call the function here
  }, []);

  if (!loaded) {
    return null; // Show nothing until fonts are loaded
  }

  useEffect(() => {
    const requestPermissions = async () => {
      await requestNotificationPermissions();
    };

    requestPermissions();
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <FlashMessage position="bottom" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="forgot-password"
          options={{ headerTitle: "Forgot Password" }}
        />
        <Stack.Screen
          name="reset-password"
          options={{ headerTitle: "Reset Password" }}
        />
        <Stack.Screen name="signup" options={{ headerBackTitle: "" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
