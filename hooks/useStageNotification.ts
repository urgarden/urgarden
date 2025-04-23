import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { PlantType, Stage } from "@/lib/definitions";

export const useStageNotifications = (plant: PlantType | undefined) => {
  // Use a ref to track scheduled notifications
  const scheduledNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!plant) return; // Handle undefined plant
    handleStageNotifications(plant);
  }, [plant]);

  const handleStageNotifications = async (plantData: PlantType) => {
    const createdAt = new Date(plantData.created_at);
    const currentDate = new Date();
    const stages = plantData.veggie.stages;

    let stageStartDate = new Date(createdAt);

    for (let i = 0; i < stages.length; i++) {
      const stageEndDate = new Date(
        stageStartDate.getTime() + stages[i].stageEndDays * 24 * 60 * 60 * 1000
      );

      // Check if the current date is within this stage
      if (currentDate >= stageStartDate && currentDate <= stageEndDate) {
        const notificationKey = `${plantData.id}-${i}`; // Unique key for plant and stage

     
        // Check if this notification has already been scheduled
        if (!scheduledNotificationsRef.current.has(notificationKey)) {
      
          await scheduleNotification(stages[i], stageEndDate, i, stages.length);
          scheduledNotificationsRef.current.add(notificationKey); // Mark as scheduled
        } else {
      
        }
        break; // Stop the loop after scheduling one notification
      }

      // Move to the next stage
      stageStartDate = stageEndDate;
    }
  };

  const scheduleNotification = async (
    stage: Stage,
    stageEndDate: Date,
    index: number,
    totalStages: number
  ) => {
    const notificationContent = {
      title: `Stage ${index + 1} Complete`,
      body: `The "${stage.title}" stage has ended. ${
        index === totalStages - 1
          ? "This is the final stage of your plant's growth."
          : "The next stage is starting now!"
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
      content: notificationContent,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilStageEnd,
        repeats: false,
      },
    });

    console.log(
      `Notification scheduled for stage "${stage.title}" at ${stageEndDate}`
    );
  };
};