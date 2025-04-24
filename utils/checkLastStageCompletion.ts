import { updateGardenStatusById } from "@/lib/api/garden";
import { PlantType } from "@/lib/definitions";

export const checkLastStageCompletion = async (plantData: PlantType, setPlant: (plant: PlantType) => void) => {
    const createdAt = new Date(plantData.created_at); // Parse the creation date
    const currentDate = new Date(); // Get the current date
    const stages = plantData.veggie.stages;

    let stageStartDate = new Date(createdAt);
    for (let i = 0; i < stages.length; i++) {
      const stageEndDate = new Date(
        stageStartDate.getTime() + stages[i].stageEndDays * 24 * 60 * 60 * 1000
      );

      if (currentDate > stageEndDate && i === stages.length - 1) {
        // If the last stage is completed, update the status to "done"
        if (plantData.status !== "done") {
          try {
            const updateResult = await updateGardenStatusById(
              plantData.id,
              "done"
            );
            if (updateResult.success) {
              setPlant({ ...plantData, status: "done" }); // Update the local state
            } else {
              console.error(
                "Failed to update garden status:",
                updateResult.message
              );
            }
          } catch (err) {
            console.error(
              "Error updating garden status:",
              (err as Error).message
            );
          }
        }
      } else if (currentDate <= stageEndDate) {
        break;
      }

      stageStartDate = stageEndDate; // Move to the next stage
    }
  };
