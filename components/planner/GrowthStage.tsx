import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Stage {
  stageNumber: number;
  title: string;
  description: string;
  stageEndDays: number;
  imageUrl?: string;
}

interface GrowthStagesProps {
  stages: (Stage & { imageUrl: string | null | undefined })[];
}
const GrowthStages: React.FC<GrowthStagesProps> = ({ stages }) => {
  if (!stages || stages.length === 0) {
    return <Text style={styles.noStagesText}>No growth stages available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Growth Stages</Text>
      {stages
        .sort((a, b) => a.stageNumber - b.stageNumber) // Sort stages by stageNumber
        .map((stage) => (
          <View key={stage.stageNumber} style={styles.stageContainer}>
            {stage.imageUrl && (
              <Image
                source={{ uri: stage.imageUrl }}
                style={styles.stageImage}
              />
            )}
            <View style={styles.stageDetails}>
              <Text style={styles.stageTitle}>
                Stage {stage.stageNumber}: {stage.title}
              </Text>
              <Text style={styles.stageDescription}>{stage.description}</Text>
              <Text style={styles.stageEndDays}>
                {stage.stageEndDays}{" "}
                {+stage.stageEndDays === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    borderTopColor: "#ddd",
    paddingTop: 24,
    textAlign: "left",
  },
  stageContainer: {
    flexDirection: "row",
    padding: 16,
    borderColor: "#ccc",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  stageImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  stageDetails: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  stageDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  stageEndDays: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
  },
  noStagesText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
});

export default GrowthStages;
