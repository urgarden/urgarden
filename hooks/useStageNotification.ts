import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { PlantType, Stage } from "@/lib/definitions";

export const useStageNotifications = (plant: PlantType) => {
  useEffect(() => {
    if (plant) {
      handleStageNotifications(plant);
    }
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

      if (currentDate >= stageStartDate && currentDate <= stageEndDate) {
        scheduleNotification(stages[i], stageEndDate, i, stages.length);
        break;
      }

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
      data: {
        stageTitle: stage.title,
        isFinalStage: index === totalStages - 1,
      },
    };

    await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
          seconds: (stageEndDate.getTime() - Date.now()) / 1000,
          repeats: false,
        },
      }); 
  };
};