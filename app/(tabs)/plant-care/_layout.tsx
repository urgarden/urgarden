import { Stack } from "expo-router";

const PlantCareLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Plant Care", headerShown: false }}
      />
      <Stack.Screen name="organic" options={{ title: "Organic" }} />
      <Stack.Screen name="ideas" options={{ title: "Gardening Ideas" }} />
    </Stack>
  );
};

export default PlantCareLayout;
