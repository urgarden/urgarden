import { supabase } from "@/utils/supabase";

// Define possible statuses for a plant
export type PlantStatus = "ongoing" | "done" | "canceled";

// Function to add a plant to the garden table
export async function addPlant(userId: string, veggieId: string) {
  try {
    // Check if the plant already exists for the user
    const { data: existingPlant, error: checkError } = await supabase
      .from("garden")
      .select("*")
      .eq("user_id", userId)
      .eq("veggie_id", veggieId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return {
        success: false,
        message: checkError.message,
      };
    }

    if (existingPlant) {
      return {
        success: false,
        message: "You have already planted this veggie.",
      };
    }

    // Insert the new plant with default status as "ongoing"
    const { data, error } = await supabase.from("garden").insert([
      {
        user_id: userId,
        veggie_id: veggieId,
        status: "ongoing", // Default status
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error("Error adding plant:", err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
}

// Function to delete a plant from the garden table
export async function deletePlant(userId: string, veggieId: string) {
  try {
    const { error } = await supabase
      .from("garden")
      .delete()
      .eq("user_id", userId)
      .eq("veggie_id", veggieId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Plant deleted successfully.",
    };
  } catch (err: any) {
    console.error("Error deleting plant:", err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
}

// Function to cancel a plant (update its status to "canceled")
export async function cancelPlant(userId: string, veggieId: string) {
  try {
    const { error } = await supabase
      .from("garden")
      .update({ status: "canceled" }) // Update status to "canceled"
      .eq("user_id", userId)
      .eq("veggie_id", veggieId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Plant status updated to canceled.",
    };
  } catch (err: any) {
    console.error("Error canceling plant:", err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
}
// Function to get all plants for a specific user and include related veggie data
export async function getAllByUserId(userId: string) {
  try {
    // Fetch all plants where the user_id matches
    const { data: gardenData, error: gardenError } = await supabase
      .from("garden")
      .select("*")
      .eq("user_id", userId);

    if (gardenError) {
      return {
        success: false,
        message: gardenError.message,
      };
    }

    if (!gardenData || gardenData.length === 0) {
      return {
        success: true,
        data: [], // Return an empty array if no plants are found
      };
    }

    // Fetch related veggie data for each plant
    const enrichedData = await Promise.all(
      gardenData.map(async (plant) => {
        const { data: veggieData, error: veggieError } = await supabase
          .from("veggies")
          .select("*")
          .eq("id", plant.veggie_id)
          .single();

        if (veggieError) {
          console.error(
            `Error fetching veggie data for veggie_id ${plant.veggie_id}:`,
            veggieError.message
          );
        }

        return {
          ...plant,
          veggie: veggieData || null, // Attach the related veggie data or null if not found
        };
      })
    );

    return {
      success: true,
      data: enrichedData, // Return the enriched data with related veggie details
    };
  } catch (err: any) {
    console.error("Error fetching plants by user ID:", err);
    return {
      success: false,
      message: err.message || "An unexpected error occurred.",
    };
  }
}

// Fetch a specific plant by ID and include related veggie data
export const getPlanById = async (id: number) => {
  try {
    // Fetch the plant data by ID
    const { data: plantData, error: plantError } = await supabase
      .from("garden")
      .select("*")
      .eq("id", id)
      .single();

    if (plantError) {
      throw new Error(plantError.message);
    }

    // Fetch the related veggie data using the veggie_id from the plant data
    const { data: veggieData, error: veggieError } = await supabase
      .from("veggies")
      .select("*")
      .eq("id", plantData.veggie_id)
      .single();

    if (veggieError) {
      console.error(
        `Error fetching veggie data for veggie_id ${plantData.veggie_id}:`,
        veggieError.message
      );
    }

    // Combine the plant data and veggie data into one object
    const combinedData = {
      ...plantData,
      veggie: veggieData || null, // Attach the veggie data or null if not found
    };

    return { success: true, data: combinedData };
  } catch (error: any) {
    console.error("Error fetching plant by ID:", error.message);
    return { success: false, message: error.message };
  }
};
