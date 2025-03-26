import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ImagePreviewer from "@/components/ImagePrev";
import VeggieItem from "@/components/planner/VeggieItem";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getRecommendedVeggies } from "@/lib/api/veggie"; // Import the API function
import { VeggieType } from "@/lib/definitions";
import { vegiImage } from "@/lib/config";

export default function HomeScreen() {
  const router = useRouter();
  const [recommendedVeggies, setRecommendedVeggies] = useState<VeggieType[]>(
    []
  );

  const handleVeggiePress = (veggie: VeggieType) => {
    router.push(`/home/details/${veggie.veggie_id}` as any);
  };

  const trendingVeggieImages = vegiImage.map((plant) => plant.image);

  // Fetch recommended veggies on component mount
  useEffect(() => {
    const fetchVeggies = async () => {
      const result = await getRecommendedVeggies();

      if (result.success) {
        setRecommendedVeggies(result.data);
      } else {
        console.error("Error fetching recommended veggies:", result.message);
      }
    };

    fetchVeggies();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Trending Vegetables Carousel */}
        <ImagePreviewer imageUrls={trendingVeggieImages} />

        {/* List of All Vegetables */}
        <Text style={styles.sectionTitle}>Recommended Vegetables</Text>

        <FlatList
          style={{ width: "100%" }}
          data={recommendedVeggies}
          keyExtractor={(item) => (item.id ?? "").toString()}
          renderItem={({ item }) => (
            <VeggieItem
              item={{
                ...item,
                image: item.veggies.image,
                name: item.veggies.name,
              }}
              onPress={() => handleVeggiePress(item)}
              onEdit={() => console.log("Edit", item.id)}
              onDelete={() => console.log("Delete", item.id)}
              isAdmin={false}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={{ paddingBottom: 20 }}
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
    backgroundColor: "#fff",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
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
