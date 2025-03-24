import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getVeggieById } from "@/lib/api/veggie"; // API function to fetch veggie details

export default function VeggieDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the veggie ID from the URL
  const [veggie, setVeggie] = useState<any>(null); // State to store veggie details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchVeggieDetails = async () => {
      try {
        setLoading(true);
        const fetchedVeggie = await getVeggieById(id as string); // Fetch veggie details by ID
        setVeggie(fetchedVeggie);
        console.log("Fetched veggie details:", fetchedVeggie);
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: veggie.image }} style={styles.image} />
      <Text style={styles.title}>{veggie.name}</Text>
      <Text style={styles.description}>{veggie.description}</Text>
      <Text style={styles.type}>Type: {veggie.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: "#666",
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
