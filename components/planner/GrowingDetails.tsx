import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { GrowingCondition } from "@/lib/definitions";

interface GrowingRequirementDetailsProps {
  growingRequirements: GrowingCondition[];
}

const { width: screenWidth } = Dimensions.get("window");

const GrowingRequirementDetails: React.FC<GrowingRequirementDetailsProps> = ({
  growingRequirements,
}) => {
  const flatListRef = useRef<FlatList>(null);

  if (!growingRequirements || growingRequirements.length === 0) {
    return (
      <Text style={styles.noDataText}>No growing requirements available.</Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Growing Requirements</Text>
      <FlatList
        ref={flatListRef}
        data={growingRequirements}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true} // Enable horizontal scroll indicator
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 10, right: 0 }} // Adjust scroll indicator position
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <View style={styles.details}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={<View style={{ width: 16 }} />} // Add spacing at the end
      />
      <Text style={styles.scrollHint}>← Swipe to see more →</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "left",
    borderTopColor: "#ddd",
    paddingTop: 24,
  },
  card: {
    width: screenWidth - 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    objectFit: "scale-down",
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
  noDataText: {
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
  scrollHint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
});

export default GrowingRequirementDetails;
