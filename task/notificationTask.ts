import * as TaskManager from "expo-task-manager";


export const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

// Define a task to handle background notifications
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Error handling background notification:", error);
    return;
  }

  if (data) {
    console.log("Received background notification:", data);
  }
});
