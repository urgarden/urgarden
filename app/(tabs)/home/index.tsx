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
import { vegiImage } from "@/lib/config";
import { StatusBar } from "expo-status-bar";
import Background from "@/components/Background";

// Define the type for recommended veggies
type RecommendedVeggie = {
  id: number;
  veggie_id: number;
  created_at: string;
  veggies: {
    id: number;
    name: string;
    description: string;
    image: string;
    type: string;
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const [recommendedVeggies, setRecommendedVeggies] = useState<
    RecommendedVeggie[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const handleVeggiePress = (veggie: RecommendedVeggie) => {
    router.push(`/home/details/${veggie.veggie_id}` as any);
  };

  const trendingVeggieImages = vegiImage.map((plant) => plant.image);

  // Fetch recommended veggies on component mount
  useEffect(() => {
    const fetchVeggies = async () => {
      setLoading(true); // Set loading to true before fetching data
      const result = await getRecommendedVeggies();

      if (result.success && result.data) {
        setRecommendedVeggies(
          result.data.map((item: any) => ({
            ...item,
            veggies: Array.isArray(item.veggies)
              ? item.veggies[0]
              : item.veggies,
          }))
        );
      } else {
        console.error("Error fetching recommended veggies:", result.message);
      }
      setLoading(false); // Set loading to false after fetching data
    };

    fetchVeggies();
  }, []);

  return (
    <Background>
      <StatusBar style="dark" backgroundColor="#fff" />
      <View style={styles.contentContainer}>
        {/* Trending Vegetables Carousel */}
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>
            Urgarden A Mobile Based Planner for Vegetables Urban Gardening
          </Text>
        </View>
        <ImagePreviewer imageUrls={trendingVeggieImages} />

        {/* List of All Vegetables */}
        <View style={styles.recContainer}>
          <Text style={styles.recTitle}>Recommended Vegetables</Text>
        </View>

        <FlatList
          style={{ width: "100%", paddingTop: 10 }}
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
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.loadingText}>
                No recommended vegetables found.
              </Text>
            )
          }
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    width: "110%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    marginTop: 40,
    alignSelf: "center",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  recContainer: {
    width: "110%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    backgroundColor: "#fff",
    zIndex: 1,
  },

  recTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
