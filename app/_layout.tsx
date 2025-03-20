import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import FlashMessage from "react-native-flash-message";

import { useColorScheme } from "@/hooks/useColorScheme";
import { handleSessionAndRoutes } from "@/services/supabase/middleware";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const result = await handleSessionAndRoutes("/");
      if (result.redirect) {
        setInitialRoute(result.redirect);
        router.replace(
          result.redirect as typeof router.replace extends (
            path: infer P
          ) => any
            ? P
            : never
        ); // Redirect to the appropriate route
      } else {
        setInitialRoute("/(tabs)"); // Default to the main app if authenticated
      }
      SplashScreen.hideAsync();
    };

    if (loaded) {
      checkSession();
    }
  }, [loaded]);

  if (!loaded || initialRoute === null) {
    return null; // Show nothing until the session is checked
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FlashMessage position="bottom" />
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
