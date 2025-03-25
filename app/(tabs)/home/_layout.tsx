import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Veggie Details",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
