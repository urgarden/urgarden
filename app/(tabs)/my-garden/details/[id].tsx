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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Display the veggie image */}
      {plant.veggie?.image && (
        <Image source={{ uri: plant.veggie.image }} style={styles.image} />
      )}

      {/* Display the veggie name */}
      <Text style={styles.title}>{plant.veggie?.name || "Unknown Veggie"}</Text>

      {/* Display the veggie description */}
      <Text style={styles.description}>
        {plant.veggie?.description || "No description available."}
      </Text>

      {/* Display the plant status */}
      <Text style={[styles.status, { color: getStatusColor(plant.status) }]}>
        Status: {plant.status}
      </Text>

      {/* Display additional plant details */}
      <Text style={styles.details}>
        <Text style={styles.detailsLabel}>Date Created:</Text>{" "}
        {new Date(plant.created_at).toLocaleString()}
      </Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
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
    color: "#4CAF50",
  },
  stageCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  currentStageCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  stageImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  stageContent: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  stageDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  stageStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  currentStageStatus: {
    color: "#FF5722",
  },
  timeLeft: {
    fontSize: 14,
    color: "#FF5722",
    marginTop: 4,
    fontStyle: "italic",
    alignSelf: "flex-end",
  },
});
