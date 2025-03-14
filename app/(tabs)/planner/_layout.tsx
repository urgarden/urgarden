import { Stack } from "expo-router";

const PlannerLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Planner", headerShown: false }}
      />
      <Stack.Screen name="add" options={{ title: "Add New Veggie" }} />
      <Stack.Screen name="details/[id]" options={{ title: "Veggie Details" }} />
    </Stack>
  );
};

export default PlannerLayout;
