import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAllByUserId } from "@/lib/api/garden";
import { useUserStore } from "@/lib/stores/userStore";
import { GetAllByUserIdResult, PlantType } from "@/lib/definitions"; // Adjust the import path as needed

export default function MyGardenScreen() {
  const [plants, setPlants] = useState<PlantType[]>([]); // Use the Plant type
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useUserStore((state) => state.userDetails?.id);

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      if (!userId) {
        setError("User ID is not available.");
        setLoading(false);
        return;
      }
      const result: GetAllByUserIdResult = await getAllByUserId(userId); // Use the result type

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
    setRefreshing(true); // Start the refreshing indicator
    await fetchPlants();
  };

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
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        My Garden
      </ThemedText>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
              <Text style={styles.cardStatus}>Status: {item.status}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing} // Bind the refreshing state
        onRefresh={handleRefresh} // Bind the refresh handler
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 50,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    color: "#888",
  },
});
