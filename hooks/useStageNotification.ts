import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { PlantType, Stage } from "@/lib/definitions";

export const useStageNotifications = (plant: PlantType | undefined) => {
  // Use a ref to track scheduled notifications
  const scheduledNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!plant) return; // Handle undefined plant
    console.log(`useStageNotifications triggered for plant: ${plant.veggie.name}`);
    handleStageNotifications(plant);
  }, [plant]);

  const handleStageNotifications = async (plantData: PlantType) => {
    const createdAt = new Date(plantData.created_at);
    const stages = plantData.veggie.stages;

    console.log(`Starting notification scheduling for plant: ${plantData.veggie.name}`);
    console.log(`Plant created at: ${createdAt}`);
    console.log(`Total stages: ${stages.length}`);

    // Clear old notifications for this plant
    console.log(`Clearing old notifications for plant ID: ${plantData.id}`);
    await clearOldNotifications(plantData.id.toString(), stages.length);

    let stageStartDate = new Date(createdAt);

    for (let i = 0; i < stages.length; i++) {
      const stageEndDate = new Date(
        stageStartDate.getTime() + stages[i].stageEndDays * 24 * 60 * 60 * 1000
      );

      const notificationKey = `${plantData.id}-${i}`; // Unique key for plant and stage

      console.log(`Checking stage ${i + 1}:`);
      console.log(`Stage title: ${stages[i].title}`);
      console.log(`Stage start date: ${stageStartDate}`);
      console.log(`Stage end date: ${stageEndDate}`);
      console.log(`Notification key: ${notificationKey}`);

      // Skip scheduling for completed stages
      if (new Date() > stageEndDate) {
        console.log(`Skipping stage ${i + 1} as it is already completed.`);
        stageStartDate = stageEndDate; // Move to the next stage
        continue;
      }

      // Check if this notification has already been scheduled
      if (!scheduledNotificationsRef.current.has(notificationKey)) {
        console.log(`Scheduling notification for stage ${i + 1}: ${stages[i].title}`);
        await scheduleNotification(stages[i], stageEndDate, i, stages.length, stages, notificationKey);
        scheduledNotificationsRef.current.add(notificationKey); // Mark as scheduled
        console.log(`Notification for stage ${i + 1} added successfully.`);
      } else {
        console.log(`Notification for stage ${i + 1} already scheduled. Skipping.`);
      }

      // Move to the next stage
      stageStartDate = stageEndDate;
    }

    console.log("All notifications scheduled successfully.");
    console.log("Scheduled notifications:", Array.from(scheduledNotificationsRef.current));
  };

  const clearOldNotifications = async (plantId: string, totalStages: number) => {
    for (let i = 0; i < totalStages; i++) {
      const notificationKey = `${plantId}-${i}`;
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationKey);
        scheduledNotificationsRef.current.delete(notificationKey); // Remove from the ref
        console.log(`Cleared notification for key: ${notificationKey}`);
      } catch (error) {
        console.log(`No existing notification to clear for key: ${notificationKey}`);
      }
    }
  };

  const scheduleNotification = async (
    stage: Stage,
    stageEndDate: Date,
    index: number,
    totalStages: number,
    stages: Stage[],
    notificationKey: string
  ) => {
    const nextStageTitle = stages[index + 1]?.title || null; // Get the next stage title if it exists

    const notificationContent = {
      title: `Stage ${index + 1} Complete`,
      body: `The "${stage.title}" has ended. ${
        index === totalStages - 1
          ? "This is the final stage of your plant's growth."
          : `The next stage, "${nextStageTitle}", is starting now!`
      }`,
      data: {
        stageTitle: stage.title,
        isFinalStage: index === totalStages - 1,
      },
    };

    const secondsUntilStageEnd = Math.max(
      (stageEndDate.getTime() - Date.now()) / 1000,
      1 // Ensure at least 1 second to avoid scheduling issues
    );

    console.log("Scheduling Notification:", {
      content: notificationContent,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilStageEnd,
        repeats: false,
      },
    });

    await Notifications.scheduleNotificationAsync({
      identifier: notificationKey, // Use the notificationKey as the identifier
      content: notificationContent,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilStageEnd,
        repeats: false,
      },
    });

    console.log(`Notification scheduled for stage "${stage.title}" at ${stageEndDate}`);
  };
};