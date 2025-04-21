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
import { Stage, PlantType } from "@/lib/definitions";

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams(); // Get the dynamic ID from the route
  const [plant, setPlant] = useState<PlantType>(); // State to store plant details
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

  const renderStageIndicator = (stage: Stage, index: number) => {
    const createdAt = new Date(plant.created_at); // Parse the ISO 8601 timestamp into a Date object
    const currentDate = new Date(); // Get the current date

    // Calculate the start date for the current stage
    let stageStartDate = new Date(createdAt); // Start with the creation date
    for (let i = 0; i < index; i++) {
      const previousStageDays = plant.veggie.stages[i].stageEndDays; // Get the days of the previous stage
      stageStartDate = new Date(stageStartDate.getTime() + previousStageDays * 24 * 60 * 60 * 1000); // Add days in milliseconds
    }

    // Calculate the end date for the current stage
    const stageEndDate = new Date(stageStartDate.getTime() + stage.stageEndDays * 24 * 60 * 60 * 1000); // Add days in milliseconds

    // Determine the stage status
    let stageStatus = "Upcoming";
    let timeLeft = null; // Time left for the current stage
    if (currentDate >= stageStartDate && currentDate <= stageEndDate) {
      stageStatus = "Current Stage";
      const timeDifference = stageEndDate.getTime() - currentDate.getTime(); // Difference in milliseconds
      timeLeft = Math.ceil(timeDifference / (24 * 60 * 60 * 1000)); // Convert to days
    } else if (currentDate > stageEndDate) {
      stageStatus = "Completed";
    }

    // Highlight the "Current Stage" visually
    const isCurrentStage = stageStatus === "Current Stage";

    return (
      <View
        key={stage.stageNumber}
        style={[
          styles.stageCard,
          isCurrentStage && styles.currentStageCard, // Apply highlight style if current stage
        ]}
      >
        {stage.imageUrl ? (
          <Image source={{ uri: stage.imageUrl }} style={styles.stageImage} />
        ) : null}
        <View style={styles.stageContent}>
          <Text style={styles.stageTitle}>{index + 1 + ". " + stage.title}</Text>
          <Text style={styles.stageDescription}>{stage.description}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={[
                styles.stageStatus,
                isCurrentStage && styles.currentStageStatus, // Highlight status text
              ]}
            >
              {stageStatus}
            </Text>
            <Text>{stage.stageEndDays} days</Text>
          </View>
          {isCurrentStage && timeLeft !== null && (
            <Text style={styles.timeLeft}>
              {timeLeft} day{timeLeft > 1 ? "s" : ""} left
            </Text>
          )}
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
