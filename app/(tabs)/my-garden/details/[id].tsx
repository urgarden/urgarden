import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getPlantById } from "@/lib/api/garden"; // Import the update API
import { Stage, PlantType } from "@/lib/definitions";
import { getStatusColor } from "@/utils/getStatusColor";
import { RenderStageIndicator } from "@/components/my-garden/RenderStage";
import { checkLastStageCompletion } from "@/utils/checkLastStageCompletion";
import { useStageNotifications } from "@/hooks/useStageNotification";
import Background from "@/components/Background";

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get the dynamic ID from the route
  const [plant, setPlant] = useState<PlantType>(); // State to store plant details
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const result = await getPlantById(Number(id)); // Fetch plant details by ID
        if (result.success) {
          setPlant(result.data); // Set the fetched plant data
          checkLastStageCompletion(result.data, setPlant); // Check if the last stage is completed
        }
      } catch (err) {
        console.error("Error fetching plant details:", (err as Error).message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPlantDetails();
  }, [id]);

  // Call useStageNotifications here
  useStageNotifications(plant);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    );
  }

  if (!plant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plant not found.</Text>
      </View>
    );
  }

  return (
    <Background>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.loader}>
          {/* Display the veggie image */}
          {plant.veggie?.image && (
            <Image source={{ uri: plant.veggie.image }} style={styles.image} />
          )}

          {/* Display the veggie name */}
          <Text style={styles.title}>
            {plant.veggie?.name || "Unknown Veggie"}
          </Text>

          {/* Display the veggie description */}
          <Text style={styles.description}>
            {plant.veggie?.description || "No description available."}
          </Text>

          {/* Display the plant status */}
          <Text
            style={[styles.status, { color: getStatusColor(plant.status) }]}
          >
            Status: {plant.status}
          </Text>

          {/* Display additional plant details */}
          <Text style={styles.details}>
            <Text style={styles.detailsLabel}>Date Created:</Text>{" "}
            {new Date(plant.created_at).toDateString()}
          </Text>
        </View>

        {/* Display the stages */}
        <Text style={styles.sectionTitle}>Stages</Text>
        {plant.veggie?.stages?.map((stage: Stage, index: number) => (
          <RenderStageIndicator
            key={index}
            plant={plant}
            stage={stage}
            index={index}
          />
        ))}
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  scrollContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  image: {
    width: "120%",
    height: 250,
    marginBottom: 16,
    marginTop: -16,
    objectFit: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  detailsLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});
