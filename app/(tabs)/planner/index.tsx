import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import VeggieItem from "@/components/home/VeggieItem"; // Import VeggieItem component

// Import local images using require
const tomato = require("@/assets/images/tomato.jpg");
const carrot = require("@/assets/images/carrot.jpg");
const cabage = require("@/assets/images/cabage.jpg");
const cucumber = require("@/assets/images/cucumber.jpg");
const pepper = require("@/assets/images/pepper.jpg");

const allVeggies = [
  { id: "1", name: "Tomato", type: "Fruit", image: tomato },
  { id: "2", name: "Carrot", type: "Root", image: carrot },
  { id: "3", name: "Cabage", type: "Leaf", image: cabage },
  { id: "4", name: "Cucumber", type: "Fruit", image: cucumber },
  { id: "5", name: "Pepper", type: "Fruit", image: pepper },
];

export default function PlannerScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypePress = (type: string | null) => {
    setSelectedType(type);
  };

  const filteredVeggies = selectedType
    ? allVeggies.filter((veggie) => veggie.type === selectedType)
    : allVeggies;

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
        {["Flower", "Leaf", "Root", "Fruit", "Bulb", "Stem"].map((type) => (
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

      {/* List of Vegetables */}
      <View style={{ flex: 14, padding: 16, backgroundColor: "#f0f0f0" }}>
        <FlatList
          data={filteredVeggies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VeggieItem item={item} onPress={() => {}} />
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
    height: 20,
    marginHorizontal: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  columnWrapper: {
    justifyContent: "space-between",
  },
});
