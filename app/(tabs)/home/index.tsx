import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import ImagePreviewer from "@/components/ImagePrev";

const trendingVeggies = [
  { id: "1", name: "Tomato", image: "https://example.com/tomato.jpg" },
  { id: "2", name: "Carrot", image: "https://example.com/carrot.jpg" },
  { id: "3", name: "Lettuce", image: "https://example.com/lettuce.jpg" },
];

const allVeggies = [
  { id: "1", name: "Tomato" },
  { id: "2", name: "Carrot" },
  { id: "3", name: "Lettuce" },
  { id: "4", name: "Cucumber" },
  { id: "5", name: "Pepper" },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVeggies = allVeggies.filter((veggie) =>
    veggie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingVeggieImages = trendingVeggies.map((veggie) => veggie.image);

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
        <Text style={styles.sectionTitle}>Trending Vegetables</Text>
        <ImagePreviewer imageUrls={trendingVeggieImages} />

        {/* List of All Vegetables */}
        <Text style={styles.sectionTitle}>All Vegetables</Text>
        <FlatList
          data={filteredVeggies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.veggieItem}>
              <Text style={styles.veggieText}>{item.name}</Text>
            </View>
          )}
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
    marginBottom: 20,
    width: "80%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    marginTop: 20,
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
