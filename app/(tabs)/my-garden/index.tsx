import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAllByUserId, deletePlant } from "@/lib/api/garden";
import { useUserStore } from "@/lib/stores/userStore";
import { GetAllByUserIdResult, PlantType } from "@/lib/definitions";
import { getStatusColor } from "@/utils/getStatusColor";
import Background from "@/components/Background";

export default function MyGardenScreen() {
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null); // Selected plant for the modal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal visibility
  const userId = useUserStore((state) => state.userDetails?.id);
  const router = useRouter();

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) {
        setError("Please login to start planting and managing your garden.");
        setLoading(false);
        return;
      }
      const result: GetAllByUserIdResult = await getAllByUserId(userId);

      if (result.success) {
        setPlants(result.data || []);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch plants.");
      }
    } catch (err: any) {
      console.error("Error fetching plants:", err.message);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPlants();
  };

  const handleDelete = async () => {
    if (!selectedPlant || !userId) return;

    try {
      // Clear notifications for the deleted plant
      const stages = selectedPlant.veggie?.stages || [];
      for (let i = 0; i < stages.length; i++) {
        const notificationKey = `${selectedPlant.id}-${i}`;
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationKey);
        } catch (error) {}
      }

      // Delete the plant from the database
      const result = await deletePlant(userId, selectedPlant.id.toString());
      if (result.success) {
        Alert.alert("Success", "Plant deleted successfully!");
        fetchPlants(); // Refresh the plant list
      } else {
        Alert.alert("Error", result.message || "Failed to delete plant.");
      }
    } catch (err: any) {
      console.error("Error deleting plant:", err.message);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setModalVisible(false); // Close the modal
    }
  };

  if (!userId) {
    return (
      <Background>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Signup and login to start planting.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")} // Redirect to login page
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  if (loading && !refreshing) {
    return (
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <Background>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          My Garden
        </ThemedText>
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/my-garden/details/${item.id}` as any)
              } // Navigate to the details screen
            >
              <View style={styles.card}>
                {item.veggie?.image && (
                  <Image
                    source={{ uri: item.veggie.image }}
                    style={styles.cardImage}
                  />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    {item.veggie?.name || "Unknown Veggie"}
                  </Text>
                  <Text style={styles.cardDescription}>
                    {item.veggie?.description || "No description available."}
                  </Text>
                  <Text
                    style={[
                      styles.cardStatus,
                      { color: getStatusColor(item.status) },
                    ]}
                  >
                    Status: {item.status}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.kebabMenu}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent triggering navigation
                    setSelectedPlant(item);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.kebabMenuText}>⋮</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {/* Modal for Delete and Cancel */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Plant</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    position: "relative",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  cardStatus: {
    fontSize: 14,
    color: "#4CAF50",
  },
  kebabMenu: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  kebabMenuText: {
    fontSize: 24,
    color: "#888",
    padding: 8,
    paddingHorizontal: 14,
    marginTop: -20,
    marginRight: -10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f44336",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  modalCloseButton: {
    backgroundColor: "#ccc",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 30,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
