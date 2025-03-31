import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VeggieItem from "@/components/planner/VeggieItem";
import Pagination from "@/components/Pagination";
import { useRouter } from "expo-router";
import { categories } from "@/lib/config";
import { getAllVeggies } from "@/lib/api/veggie";
import { useUserStore } from "@/lib/stores/userStore";
import { deleteVeggie } from "@/lib/api/veggie";
import { showMessage } from "react-native-flash-message";
import { CategoryType } from "@/lib/definitions";

export default function PlannerScreen() {
  const [selectedType, setSelectedType] = useState<CategoryType | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [veggies, setVeggies] = useState<any[]>([]); // State to store fetched veggies
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page
  const [totalPages, setTotalPages] = useState<number>(1); // Total pages
  const [limit] = useState<number>(10); // Items per page
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { userDetails } = useUserStore();

  const isAdmin = userDetails?.role === "admin";

  const fetchVeggies = async (page: number) => {
    try {
      const result = await getAllVeggies(
        page,
        limit,
        searchQuery, // Pass the search query
        selectedType?.value // Pass the selected type
      );
      setLoading(false);

      if (result.success) {
        setVeggies(result.data ?? []);
        setTotalPages(result.totalPages ?? 1); // Update total pages with fallback
      } else {
        console.error("Failed to fetch veggies:", result.message);
      }
    } catch (err: any) {
      console.error("Error fetching veggies:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch veggies whenever the current page, search query, or selected type changes
  useEffect(() => {
    fetchVeggies(currentPage);
  }, [currentPage, searchQuery, selectedType]);

  const handleTypePress = (type: CategoryType | null) => {
    setSelectedType(type || undefined);
    setCurrentPage(1); // Reset to the first page when the type changes
  };

  const handleVeggiePress = (item: any) => {
    // Navigate to the details screen with the veggie ID
    router.push(`/planner/details/${item.id}`);
  };

  const handleAddVeggiePress = () => {
    router.push(`/planner/add`);
  };

  const handleEditVeggiePress = (veggieData: any) => {
    router.push({
      pathname: "/planner/add",
      params: { mode: "edit", veggie: JSON.stringify(veggieData) },
    });
  };

  const handleDeleteVeggie = async (id: any) => {
    try {
      const result = await deleteVeggie(id); // Call the delete API

      if (result.success) {
        // Filter out the deleted veggie from the state
        setVeggies((prevVeggies) =>
          prevVeggies.filter((veggie) => veggie.id !== id)
        );

        showMessage({
          message: "Vegetable deleted successfully!",
          type: "success",
        });
      } else {
        showMessage({
          message: "Error deleting vegetable.",
          description: result.message,
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting vegetable:", error);
      showMessage({
        message: "Error deleting vegetable.",
        type: "danger",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true); // Set the refreshing state to true
      setCurrentPage(1); // Reset to the first page
      await fetchVeggies(1); // Fetch the veggies for the first page
    } catch (error) {
      console.error("Error refreshing veggies:", error);
    } finally {
      setRefreshing(false); // Set the refreshing state to false
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={veggies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VeggieItem
            item={item}
            isAdmin={isAdmin}
            onPress={() => handleVeggiePress(item)}
            onEdit={() => handleEditVeggiePress(item)}
            onDelete={() => handleDeleteVeggie(item.id)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={refreshing} // Use the refreshing state
        onRefresh={handleRefresh} // Trigger handleRefresh on pull-to-refresh
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            <ThemedText type="title">Planner</ThemedText>

            {/* Sorting Buttons */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.buttonContainer}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  selectedType === null && styles.selectedButton,
                ]}
                onPress={() => handleTypePress(null)}
              >
                <Text style={styles.buttonText}>All</Text>
              </TouchableOpacity>
              {categories.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.button,
                    selectedType?.value === type.value && styles.selectedButton,
                  ]}
                  onPress={() => handleTypePress(type)}
                >
                  <Text style={styles.buttonText}>{type.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setCurrentPage(1);
              }}
            />

            {/* Add Vegetable Button */}
            {isAdmin && (
              <View style={styles.addButtonContainer}>
                <Button title="Add Vegetable" onPress={handleAddVeggiePress} />
              </View>
            )}
          </>
        }
        ListFooterComponent={
          veggies.length > 0 ? (
            <View style={styles.paginationContainer}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  paginationContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    height: 100,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    alignSelf: "flex-start",
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: -40,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  addButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
