import { Stack } from "expo-router";

const PlannerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Planner" }} />
      <Stack.Screen name="details/[id]" options={{ title: "Veggie Details" }} />
    </Stack>
  );
};

export default PlannerLayout;
