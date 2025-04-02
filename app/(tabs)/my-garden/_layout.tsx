import { Stack } from "expo-router";

const MyGardenLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "My Garden", headerShown: false }}
      />
      <Stack.Screen name="details/[id]" options={{ title: "Details" }} />
    </Stack>
  );
};

export default MyGardenLayout;
