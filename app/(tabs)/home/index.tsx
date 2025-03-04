import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import BackButton from "@/components/buttons/BackButton";
import ImagePreviewer from "@/components/ImagePrev";
import { useSearch } from "@/hooks/useSearch";
import { Link, useNavigation } from "expo-router";

// Import local images using require
const tomato = require("@/assets/images/tomato.jpg");
const carrot = require("@/assets/images/carrot.jpg");
const cabage = require("@/assets/images/cabage.jpg");
const cucumber = require("@/assets/images/cucumber.jpg");
const pepper = require("@/assets/images/pepper.jpg");

const trendingVeggies = [
  { id: "1", name: "Tomato", image: tomato },
  { id: "2", name: "Carrot", image: carrot },
  { id: "3", name: "cabage", image: cabage },
  { id: "4", name: "Pepper", image: pepper },
  { id: "5", name: "Cucumber", image: cucumber },
];

const allVeggies = [
  { id: "1", name: "Tomato" },
  { id: "2", name: "Carrot" },
  { id: "3", name: "Cabage" },
  { id: "4", name: "Cucumber" },
  { id: "5", name: "Pepper" },
];

interface Veggie {
  id: string;
  name: string;
  image?: any;
}

const VeggieItem = ({
  item,
  onPress,
}: {
  item: Veggie;
  onPress: () => void;
}) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.veggieItem, { transform: [{ scale }] }]}>
        <Text style={styles.veggieText}>{item.name}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function HomeScreen() {
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredVeggies,
  } = useSearch(allVeggies);

  interface Veggie {
    id: string;
    name: string;
    image?: any;
  }

  const nav = useNavigation();

  const handleVeggiePress = (veggie: Veggie) => {
    // nav.navigate(`/veggie/${veggie.id}` as never);
  };

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
        <ImagePreviewer imageUrls={trendingVeggieImages} />

        {/* List of All Vegetables */}
        <Text style={styles.sectionTitle}>All Vegetables</Text>
        <FlatList
          data={filteredVeggies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VeggieItem item={item} onPress={() => handleVeggiePress(item)} />
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
