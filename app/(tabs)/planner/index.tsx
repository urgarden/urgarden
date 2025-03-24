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
import { useRouter } from "expo-router";
import { categories } from "@/lib/config";
import { getAllVeggies } from "@/lib/api/veggie"; // Import the API function

export default function PlannerScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Set to true for demonstration
  const [veggies, setVeggies] = useState<any[]>([]); // State to store fetched veggies
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();

  useEffect(() => {
    const fetchVeggies = async () => {
      try {
        setLoading(true);
        const fetchedVeggies = await getAllVeggies(); // Fetch veggies from the database
        setVeggies(fetchedVeggies);
      } catch (err: any) {
        console.error("Error fetching veggies:", err.message);
        setError("Failed to load veggies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVeggies();
  }, []);

  const handleTypePress = (type: string | null) => {
    setSelectedType(type);
  };

  const handleVeggiePress = (veggieId: string) => {
    router.push(`/planner/details/${veggieId}`);
  };

  const handleAddVeggiePress = () => {
    router.push(`/planner/add`);
  };

  const filteredVeggies = selectedType
    ? veggies.filter(
        (veggie) =>
          veggie.type === selectedType &&
          veggie.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : veggies.filter((veggie) =>
        veggie.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">PLANNER</ThemedText>

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
              selectedType === type.value && styles.selectedButton,
            ]}
            onPress={() => handleTypePress(type.value)}
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
        onChangeText={setSearchQuery}
      />

      {/* Add Vegetable Button */}
      {isAdmin && (
        <View style={styles.addButtonContainer}>
          <Button title="Add Vegetable" onPress={handleAddVeggiePress} />
        </View>
      )}

      {/* List of Vegetables */}
      <View
        style={{ flex: 14, paddingHorizontal: 16, backgroundColor: "#f0f0f0" }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredVeggies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <VeggieItem
                item={item}
                onPress={() => handleVeggiePress(item.id.toString())}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 16,
    height: "auto",
    marginHorizontal: 16,
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
