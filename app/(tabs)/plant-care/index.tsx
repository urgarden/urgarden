import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function PlantCareScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Plant Care</ThemedText>

      {/* Navigate to Organic Plant Care */}
      <Link href="/plant-care/organic" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Organic</Text>
        </TouchableOpacity>
      </Link>
      {/* Navigate to Gardening Ideas */}
      <Link href="/plant-care/gardening-ideas" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Gardening Ideas</Text>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
