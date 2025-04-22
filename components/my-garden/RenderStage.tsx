import React from "react";
import { PlantType, Stage } from "@/lib/definitions";
import { View, Text, Image, StyleSheet } from "react-native";
import { useStageNotifications } from "@/hooks/useStageNotification";

export const RenderStageIndicator = ({
  plant,
  stage,
  index,
}: {
  plant: PlantType;
  stage: Stage;
  index: number;
}) => {
  // Use the custom hook for notifications
  useStageNotifications(plant);

  const createdAt = new Date(plant.created_at); // Parse the ISO 8601 timestamp into a Date object
  const currentDate = new Date(); // Get the current date

  // Calculate the start date for the current stage
  let stageStartDate = new Date(createdAt); // Start with the creation date
  for (let i = 0; i < index; i++) {
    const previousStageDays = plant.veggie.stages[i].stageEndDays; // Get the days of the previous stage
    stageStartDate = new Date(
      stageStartDate.getTime() + previousStageDays * 24 * 60 * 60 * 1000
    ); // Add days in milliseconds
  }

  // Calculate the end date for the current stage
  const stageEndDate = new Date(
    stageStartDate.getTime() + stage.stageEndDays * 24 * 60 * 60 * 1000
  ); // Add days in milliseconds

  // Determine the stage status
  let stageStatus = "Upcoming";
  let timeLeft = null; // Time left for the current stage
  if (currentDate >= stageStartDate && currentDate <= stageEndDate) {
    stageStatus = "Current Stage";
    const timeDifference = stageEndDate.getTime() - currentDate.getTime(); // Difference in milliseconds

    // Convert time difference to days, hours, and minutes
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor(
      (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
    );

    timeLeft = { days, hours, minutes };
  } else if (currentDate > stageEndDate) {
    stageStatus = "Completed";
  }

  // Highlight the "Current Stage" visually
  const isCurrentStage = stageStatus === "Current Stage";

  return (
    <View
      key={stage.stageNumber}
      style={[
        styles.stageCard,
        isCurrentStage && styles.currentStageCard, // Apply highlight style if current stage
      ]}
    >
      {stage.imageUrl ? (
        <Image source={{ uri: stage.imageUrl }} style={styles.stageImage} />
      ) : null}
      <View style={styles.stageContent}>
        <Text style={styles.stageTitle}>{index + 1 + ". " + stage.title}</Text>
        <Text style={styles.stageDescription}>{stage.description}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              styles.stageStatus,
              isCurrentStage && styles.currentStageStatus, // Highlight status text
            ]}
          >
            {stageStatus}
          </Text>
          <Text>{stage.stageEndDays} days</Text>
        </View>
        {isCurrentStage && timeLeft !== null && (
          <Text style={styles.timeLeft}>
            {timeLeft.days > 0 &&
              `${timeLeft.days} day${timeLeft.days > 1 ? "s" : ""} `}
            {timeLeft.hours > 0 &&
              `${timeLeft.hours} hour${timeLeft.hours > 1 ? "s" : ""} `}
            {timeLeft.minutes > 0 &&
              `${timeLeft.minutes} minute${timeLeft.minutes > 1 ? "s " : " "}`}
            left
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stageCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  currentStageCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  stageImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  stageContent: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  stageDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  stageStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  currentStageStatus: {
    color: "#FF5722",
  },
  timeLeft: {
    fontSize: 14,
    color: "#FF5722",
    marginTop: 4,
    fontStyle: "italic",
    alignSelf: "flex-end",
  },
});
