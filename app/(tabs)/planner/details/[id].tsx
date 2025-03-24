import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getVeggieById } from "@/lib/api/veggie";
import { VeggieType } from "@/lib/definitions";

export default function VeggieDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [veggie, setVeggie] = useState<VeggieType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVeggieDetails = async () => {
      try {
        setLoading(true);
        const fetchedVeggie = await getVeggieById(id as string);
        if (fetchedVeggie.success && fetchedVeggie.data) {
          setVeggie(fetchedVeggie.data);
        } else {
          throw new Error(
            fetchedVeggie.message || "Failed to fetch veggie details."
          );
        }
      } catch (err: any) {
        console.error("Error fetching veggie details:", err.message);
        setError("Failed to load veggie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVeggieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!veggie) {
    return <Text style={styles.errorText}>Veggie not found.</Text>;
  }

  const handlePlantPress = () => {
    // Navigate to a planting screen or perform an action
    console.log("Plant button pressed for:", veggie.name);
    // router.push(`/planner/plant/${veggie.id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {veggie.image && (
        <Image source={{ uri: veggie.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{veggie.name}</Text>
      <Text style={styles.type}>Type: {veggie.type}</Text>
      <Text style={styles.description}>{veggie.description}</Text>

      {/* Plant Button */}
      <TouchableOpacity style={styles.plantButton} onPress={handlePlantPress}>
        <Text style={styles.plantButtonText}>Plant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  type: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  plantButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
  },
  plantButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
