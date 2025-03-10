import React from "react";
import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import ImagePreviewer from "@/components/ImagePrev";
import { useSearch } from "@/hooks/useSearch";
import VeggieItem from "@/components/home/VeggieItem"; // Add this line to import VeggieItem
import { useRouter } from "expo-router";
import { Veggie } from "@/lib/definitions";
import { vegiImage } from "@/lib/config";

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
      {/* Back Button */}
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
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 90,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "80%",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
