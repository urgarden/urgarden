import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import Background from "@/components/Background";

export default function PlantCareScreen() {
  return (
    <Background>
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
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "rgba(255, 255, 255, 0)",
    alignItems: "center",
    width: "100%",
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
