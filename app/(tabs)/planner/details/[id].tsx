import { StyleSheet, View, Text, Image, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Veggies } from "@/lib/config";

const VeggieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const veggieId = parseInt(id as string, 10);
  const veggie = Object.values(Veggies)
    .flat()
    .find((v) => v.id === veggieId);

  if (!veggie) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Vegetable not found</Text>
      </View>
    );
  }

  const handlePlantPress = () => {
    // Handle the plant action here
    console.log(`Planting ${veggie.name}`);
  };

  return (
    <View style={styles.container}>
      <Image source={veggie.image} style={styles.image} />
      <Text style={styles.name}>{veggie.name}</Text>
      <Text style={styles.description}>{veggie.description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Plant" onPress={handlePlantPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default VeggieDetails;
