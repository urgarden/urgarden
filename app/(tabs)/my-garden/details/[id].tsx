import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getPlanById } from "@/lib/api/garden"; // API to fetch plant details
import { Stage } from "@/lib/definitions";

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get the dynamic ID from the route
  const [plant, setPlant] = useState<any>(null); // State to store plant details
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const result = await getPlanById(Number(id)); // Fetch plant details by ID
        if (result.success) {
          setPlant(result.data); // Set the fetched plant data
        }
      } catch (err) {
        console.error("Error fetching plant details:", (err as Error).message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPlantDetails();
  }, [id]);

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

  const renderStageIndicator = (stage: any, index: number) => {
    const isCurrentStage = plant.status === "ongoing" && index === 0;
    const isCompletedStage = index < 1;

    return (
      <View key={stage.stageNumber} style={styles.stageCard}>
        <Image source={{ uri: stage.imageUrl }} style={styles.stageImage} />
        <View style={styles.stageContent}>
          <Text style={styles.stageTitle}>{stage.title}</Text>
          <Text style={styles.stageDescription}>{stage.description}</Text>
          <Text style={styles.stageStatus}>
            {isCurrentStage
              ? "Current Stage"
              : isCompletedStage
              ? "Completed"
              : "Upcoming"}
          </Text>
        </View>
      </View>
    );
  };

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
      <Text style={styles.status}>Status: {plant.status}</Text>

      {/* Display additional plant details */}
      <Text style={styles.details}>
        <Text style={styles.detailsLabel}>Date Created:</Text>{" "}
        {new Date(plant.created_at).toLocaleString()}
      </Text>

      {/* Display the stages */}
      <Text style={styles.sectionTitle}>Stages</Text>
      {plant.veggie?.stages?.map((stage: Stage, index: number) =>
        renderStageIndicator(stage, index)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16, // Add padding to the content inside the ScrollView
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
    objectFit: "contain",
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
});
