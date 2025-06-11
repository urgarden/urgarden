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
    const stages = plantData.veggie.stages;



    // Clear old notifications for this plant
    await clearOldNotifications(plantData.id.toString(), stages.length);

    let stageStartDate = new Date(createdAt);

    for (let i = 0; i < stages.length; i++) {
      const stageEndDate = new Date(
        stageStartDate.getTime() + stages[i].stageEndDays * 24 * 60 * 60 * 1000
      );

      const notificationKey = `${plantData.id}-${i}`; // Unique key for plant and stage


      // Skip scheduling for completed stages
      if (new Date() > stageEndDate) {

        stageStartDate = stageEndDate; // Move to the next stage
        continue;
      }

      // Check if this notification has already been scheduled
      if (!scheduledNotificationsRef.current.has(notificationKey)) {
        
        await scheduleNotification(stages[i], stageEndDate, i, stages.length, stages, notificationKey);
        scheduledNotificationsRef.current.add(notificationKey); // Mark as scheduled

      } else {
       
      }

      // Move to the next stage
      stageStartDate = stageEndDate;
    }

   
  };

  const clearOldNotifications = async (plantId: string, totalStages: number) => {
    for (let i = 0; i < totalStages; i++) {
      const notificationKey = `${plantId}-${i}`;
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationKey);
        scheduledNotificationsRef.current.delete(notificationKey); // Remove from the ref
        
      } catch (error) {
        
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


    await Notifications.scheduleNotificationAsync({
      identifier: notificationKey, // Use the notificationKey as the identifier
      content: notificationContent,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilStageEnd,
        repeats: false,
      },
    });

    
  };
};