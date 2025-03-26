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
  Alert,
} from "react-native";
import { getVeggieById } from "@/lib/api/veggie";
import { VeggieType } from "@/lib/definitions";
import { addPlant } from "@/lib/api/garden";
import { useUserStore } from "@/lib/stores/userStore";

export default function VeggieDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [veggie, setVeggie] = useState<VeggieType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useUserStore((state) => state.userDetails?.id);

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

  const handlePlantPress = async () => {
    try {
      if (!userId) {
        Alert.alert("Error", "User ID is missing. Please log in again.");
        return;
      }
      const result = await addPlant(userId, veggie.id?.toString() || ""); // Call the plantVeggie API
      if (result && result.success) {
        Alert.alert("Success", "Veggie planted successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to plant veggie.");
      }
    } catch (err: any) {
      console.error("Error planting veggie:", err.message);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }} // Ensure ScrollView takes full height
      contentContainerStyle={{
        ...styles.container,
        flexGrow: 1, // Ensure content grows and scrolls properly
      }}
    >
      {veggie.image && (
        <Image source={{ uri: veggie.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{veggie.name}</Text>
      <Text style={styles.type}>Type: {veggie.type}</Text>
      <Text style={styles.description}>{veggie.description}</Text>

      {/* Display Stages */}
      <Text style={styles.sectionTitle}>Growth Stages</Text>
      {veggie.stages
        .sort((a, b) => a.stageNumber - b.stageNumber) // Sort stages by stageNumber
        .map((stage) => (
          <View key={stage.stageNumber} style={styles.stageContainer}>
            {stage.imageUrl && (
              <Image
                source={{ uri: stage.imageUrl }}
                style={styles.stageImage}
              />
            )}
            <View style={styles.stageDetails}>
              <Text style={styles.stageTitle}>
                Stage {stage.stageNumber}: {stage.title}
              </Text>
              <Text style={styles.stageDescription}>{stage.description}</Text>
              <Text style={styles.stageEndDays}>
                {stage.stageEndDays}{" "}
                {+stage.stageEndDays === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>
        ))}

      {/* Plant Button */}
      <TouchableOpacity style={styles.plantButton} onPress={handlePlantPress}>
        <Text style={styles.plantButtonText}>Plant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 500,
  },
  image: {
    width: "100%",
    height: "30%",
    objectFit: "contain",
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
  },
  stageContainer: {
    width: "100%",
    height: "auto",
    padding: 16,
    gap: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    flexDirection: "row",
  },
  stageDetails: {
    marginBottom: 8,
    width: "65%",
  },
  stageImage: {
    width: "30%",
    height: "auto",
    borderRadius: 8,
    marginBottom: 8,
    objectFit: "cover",
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  stageDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  stageEndDays: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
  },
  plantButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
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
