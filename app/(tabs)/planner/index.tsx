import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VeggieItem from "@/components/home/VeggieItem"; // Import VeggieItem component
import { useRouter } from "expo-router";
import { Veggies } from "@/lib/config";

export default function PlannerScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleTypePress = (type: string | null) => {
    setSelectedType(type);
  };

  const handleVeggiePress = (veggieId: string) => {
    router.push(`/veggie/${veggieId}` as any);
  };

  const filteredVeggies = selectedType
    ? Veggies[selectedType as keyof typeof Veggies].filter((veggie) =>
        veggie.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Object.values(Veggies)
        .flat()
        .filter((veggie) =>
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
        {["leaf", "fruit", "bulb", "flower", "root"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              selectedType === type && styles.selectedButton,
            ]}
            onPress={() => handleTypePress(type)}
          >
            <Text style={styles.buttonText}>{type}</Text>
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

      {/* List of Vegetables */}
      <View
        style={{ flex: 14, paddingHorizontal: 16, backgroundColor: "#f0f0f0" }}
      >
        <FlatList
          data={filteredVeggies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <VeggieItem
                item={item}
                onPress={() => handleVeggiePress(item.id.toString())}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
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
    alignSelf: "flex-start", // Ensure button fits to text
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
    marginTop: -40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
