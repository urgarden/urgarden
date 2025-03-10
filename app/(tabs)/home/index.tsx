import React from "react";
import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import ImagePreviewer from "@/components/ImagePrev";
import { useSearch } from "@/hooks/useSearch";
import VeggieItem from "@/components/home/VeggieItem"; // Add this line to import VeggieItem
import { useRouter } from "expo-router";
import { Veggie } from "@/lib/definitions";

// Import local images using require
const tomato = require("@/assets/images/tomato.jpg");
const carrot = require("@/assets/images/carrot.jpg");
const cabage = require("@/assets/images/cabage.jpg");
const cucumber = require("@/assets/images/cucumber.jpg");
const pepper = require("@/assets/images/pepper.jpg");

const vegiImage = [
  { id: "1", name: "Tomato", image: tomato },
  { id: "2", name: "Carrot", image: carrot },
  { id: "3", name: "Cabage", image: cabage },
  { id: "4", name: "Cucumber", image: cucumber },
  { id: "5", name: "Pepper", image: pepper },
];

export default function HomeScreen() {
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredVeggies,
  } = useSearch(vegiImage);
  const router = useRouter();

  const handleVeggiePress = (veggie: Veggie) => {
    router.push(`/veggie/${veggie.id}` as any);
  };

  const trendingVeggieImages = vegiImage.map((plant) => plant.image);

  return (
    <View style={styles.container}>
      <BackButton />

      {/* Search Component */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Vegetables..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.contentContainer}>
        {/* Trending Vegetables Carousel */}
        <ImagePreviewer imageUrls={trendingVeggieImages} />

        {/* List of All Vegetables */}
        <Text style={styles.sectionTitle}>Popular Vegetables</Text>
        <FlatList
          data={filteredVeggies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VeggieItem item={item} onPress={() => handleVeggiePress(item)} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    width: "100%",
    padding: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  searchInput: {
    height: 40,
    marginTop: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "90%",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  veggieItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  veggieText: {
    fontSize: 18,
    color: "#333",
  },
});
