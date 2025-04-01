import { supabase } from "@/utils/supabase";
import { VeggieType } from "@/lib/definitions";
import { GrowingCondition } from "@/lib/definitions";
import { uploadImageToStorage } from "@/utils/uploadImage";

// Create a new vegetable
export const createVeggie = async (veggie: VeggieType) => {
  try {
    // Check if a veggie with the same name already exists (case-insensitive)
    const { data: existingVeggie, error: checkError } = await supabase
      .from("veggies")
      .select("name")
      .ilike("name", veggie.name) // Use ilike for case-insensitive comparison
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Handle unexpected errors (ignore "PGRST116" which means no rows found)
      throw new Error(checkError.message);
    }

    if (existingVeggie) {
      // If a veggie with the same name exists, return an error
      return {
        success: false,
        message:
          "A vegetable with this name already exists. Please use a different name.",
      };
    }

    let imageUrl = null;

    // Upload the main image to Supabase Storage if an image is provided
    if (veggie.image) {
      const fileName = `veggie-${Date.now()}.jpg`; // Generate a unique file name
      imageUrl = await uploadImageToStorage(
        veggie.image,
        fileName,
        "veggie-images"
      ); // Specify the bucket name
    }

    // Upload images for each stage and update the stages array
    const updatedStages = await Promise.all(
      veggie.stages.map(async (stage, index) => {
        if (stage.imageUrl) {
          const stageFileName = `veggie-stage-${index + 1}-${Date.now()}.jpg`;
          const stageImageUrl = await uploadImageToStorage(
            stage.imageUrl,
            stageFileName,
            "veggie-images"
          );
          return { ...stage, imageUrl: stageImageUrl };
        }
        return stage;
      })
    );

    // Insert the vegetable data into the database
    const { error } = await supabase.from("veggies").insert([
      {
        name: veggie.name,
        description: veggie.description,
        type: veggie.type,
        image: imageUrl, // Save the main image URL in the database
        stages: updatedStages, // Save the updated stages with image URLs
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Vegetable added successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Fetch all vegetables
export const getAllVeggies = async (
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  type?: string
) => {
  try {
    const offset = (page - 1) * limit; // Calculate the starting index

    // Build the query
    let query = supabase
      .from("veggies")
      .select("*", { count: "exact" }) // Fetch total count for pagination
      .range(offset, offset + limit - 1); // Fetch records within the range

    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    // Apply type filter if type is provided
    if (type) {
      query = query.eq("type", type);
    }

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data,
      total: count, // Total number of records
      totalPages: Math.ceil((count ?? 0) / limit), // Calculate total pages
      page,
      limit,
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Fetch a specific vegetable by ID
export const getVeggieById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("veggies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Update an existing vegetable
export const updateVeggie = async (
  id: string,
  updatedVeggie: Partial<VeggieType>
) => {
  try {
    // Check if a veggie with the same name already exists (excluding the current veggie, case-insensitive)
    const { data: existingVeggie, error: checkError } = await supabase
      .from("veggies")
      .select("id, name")
      .ilike("name", updatedVeggie.name || "") // Use ilike for case-insensitive comparison
      .neq("id", id) // Exclude the current veggie
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Handle unexpected errors (ignore "PGRST116" which means no rows found)
      throw new Error(checkError.message);
    }

    if (existingVeggie) {
      // If a veggie with the same name exists, return an error
      return {
        success: false,
        message:
          "A vegetable with this name already exists. Please use a different name.",
      };
    }

    let imageUrl = updatedVeggie.image;

    // Upload the main image to Supabase Storage if a new image is provided
    if (updatedVeggie.image && !updatedVeggie.image.startsWith("http")) {
      const fileName = `veggie-${id}-${Date.now()}.jpg`; // Generate a unique file name
      imageUrl = await uploadImageToStorage(
        updatedVeggie.image,
        fileName,
        "veggie-images"
      ); // Specify the bucket name
    }

    // Upload images for each stage and update the stages array
    const updatedStages = await Promise.all(
      (updatedVeggie.stages || []).map(async (stage, index) => {
        if (stage.imageUrl && !stage.imageUrl.startsWith("http")) {
          const stageFileName = `veggie-stage-${id}-${
            index + 1
          }-${Date.now()}.jpg`;
          const stageImageUrl = await uploadImageToStorage(
            stage.imageUrl,
            stageFileName,
            "veggie-images"
          );
          return { ...stage, imageUrl: stageImageUrl };
        }
        return stage;
      })
    );

    // Prepare the payload for updating the database
    const updatePayload = {
      ...updatedVeggie,
      image: imageUrl, // Save the main image URL
      stages: updatedStages, // Save the updated stages with image URLs
    };

    // Remove the `id` field from the update payload if it exists
    const { id: _, ...cleanedPayload } = updatePayload;

    // Update the vegetable in the database
    const { error } = await supabase
      .from("veggies")
      .update(cleanedPayload)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Vegetable updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
// Delete a vegetable by ID
export const deleteVeggie = async (id: string) => {
  try {
    const { error } = await supabase.from("veggies").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Vegetable deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Fetch recommended vegetables with related veggie data
export const getRecommendedVeggies = async () => {
  try {
    // Fetch all recommended veggies and their related veggie data
    const { data, error } = await supabase.from("recommended_veggie") // Replace with your actual table name
      .select(`
        id,
        veggie_id,
        created_at,
        veggies (
          id,
          name,
          description,
          image,
          type
        )
      `); // Fetch related columns from the "veggies" table

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data, // Return the fetched data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Save growing requirements to the database.
 * @param veggieId - The ID of the veggie to update.
 * @param growingRequirements - The array of growing conditions to save.
 * @returns A success or error response.
 */
export const saveGrowingRequirements = async (
  veggieId: string,
  growingRequirements: GrowingCondition[]
) => {
  try {
    // Upload images for each growing condition
    const updatedGrowingRequirements = await Promise.all(
      growingRequirements.map(async (condition, index) => {
        if (condition.image && !condition.image.startsWith("http")) {
          // Generate a unique file name for the image
          const fileName = `growing-condition-${veggieId}-${
            index + 1
          }-${Date.now()}.jpg`;

          // Upload the image to Supabase storage
          const imageUrl = await uploadImageToStorage(
            condition.image,
            fileName,
            "veggie-images/growing-requirements" // Specify the bucket name
          );

          // Return the updated condition with the uploaded image URL
          return { ...condition, image: imageUrl };
        }

        // If the image is already a URL, return the condition as is
        return condition;
      })
    );

    // Update the growing_requirement column in the database
    const { data, error } = await supabase
      .from("veggies") // Replace with your table name
      .update({ growing_requirement: updatedGrowingRequirements })
      .eq("id", veggieId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Error saving growing requirements:", err.message);
    return { success: false, message: err.message };
  }
};
