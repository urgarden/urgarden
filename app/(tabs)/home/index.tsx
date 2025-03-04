import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import BackButton from "@/components/buttons/BackButton";
import Carousel from "react-native-snap-carousel";

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

  const renderCarouselItem = ({
    item,
  }: {
    item: { id: string; name: string; image: string };
  }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <Text style={styles.carouselText}>{item.name}</Text>
    </View>
  );

  const filteredVeggies = allVeggies.filter((veggie) =>
    veggie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>
        Urgarden: A Mobile-based Planner for Vegetables Urban Gardening
      </Text>

      {/* Search Component */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Vegetables..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Trending Vegetables Carousel */}
      <Text style={styles.sectionTitle}>Trending Vegetables</Text>
      <Carousel
        data={trendingVeggies}
        renderItem={renderCarouselItem}
        sliderWidth={300}
        itemWidth={250}
        loop={true}
      />

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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  carouselItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  carouselImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  carouselText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
