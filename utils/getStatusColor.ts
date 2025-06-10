import { PlantStatus } from "@/lib/definitions";

export const getStatusColor = (status: PlantStatus): string => {
  switch (status) {
    case "ongoing":
      return "#FFA500"; // Orange for ongoing
    case "done":
      return "#4CAF50"; // Green for done
    case "canceled":
      return "#F44336"; // Red for canceled
    default:
      return "#888"; // Default gray for unknown status
  }
};