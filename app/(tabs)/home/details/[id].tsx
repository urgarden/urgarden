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
import { saveGrowingRequirements } from "@/lib/api/veggie";
import { GrowingCondition, VeggieType } from "@/lib/definitions";
import { addPlant } from "@/lib/api/garden";
import { useUserStore } from "@/lib/stores/userStore";
import PlantForm from "@/components/planner/GrowingFormModal";
import GrowingRequirementDetails from "@/components/planner/GrowingDetails";
import GrowthStages from "@/components/planner/GrowthStage";
import Background from "@/components/Background";

export default function VeggieDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [veggie, setVeggie] = useState<VeggieType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // State to control modal visibility

  const { userDetails } = useUserStore();
  const isAdmin = userDetails?.role === "admin"; // Check if the user is an admin

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

  const handleFormSubmit = async (formData: GrowingCondition[]) => {
    try {
      if (!id) {
        Alert.alert("Error", "Veggie ID is missing. Please try again.");
        return;
      }

      // Call the API to save growing requirements
      const result = await saveGrowingRequirements(id as string, formData);

      if (result.success) {
        Alert.alert("Success", "Growing requirements saved successfully!");
        setVeggie((prevVeggie) => {
          if (!prevVeggie) return null; // Ensure prevVeggie is not null
          return {
            ...prevVeggie,
            growing_requirement: formData, // Update the local state with the new data
          };
        });
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to save growing requirements."
        );
      }
    } catch (err) {
      console.error("Error saving growing requirements:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsModalVisible(false); // Close the modal after submission
    }
  };

  return (
    <Background>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {veggie.image && (
          <Image source={{ uri: veggie.image }} style={styles.image} />
        )}
        <Text style={styles.title}>{veggie.name}</Text>
        <Text style={styles.type}>Type: {veggie.type}</Text>
        <Text style={styles.description}>{veggie.description}</Text>

        {/* Growth Stages */}
        <GrowthStages
          stages={(veggie.stages || []).map((stage) => ({
            ...stage,
            imageUrl: stage.imageUrl ?? undefined, // Convert null to undefined
          }))}
        />

        {/* Growing Requirements */}
        <GrowingRequirementDetails
          growingRequirements={veggie.growing_requirement || []}
        />

        {/* Plant Button */}
        <TouchableOpacity style={styles.plantButton} onPress={handlePlantPress}>
          <Text style={styles.plantButtonText}>Plant</Text>
        </TouchableOpacity>

        {/* Redirect to Growing Form Button (Visible only for Admins) */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.adminButtonText}>Add Growing Requirement</Text>
          </TouchableOpacity>
        )}

        {/* PlantForm Modal */}
        <PlantForm
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)} // Close the modal
          onSubmit={handleFormSubmit} // Handle form submission
        />
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
    alignItems: "center",
  },
  image: {
    width: "120%",
    height: 250,
    marginBottom: 16,
    marginTop: -16,
    objectFit: "cover",
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
    marginBottom: 32,
  },
  plantButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  adminButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  adminButtonText: {
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
