import { supabase } from "@/utils/supabase";
import { VeggieType } from "@/lib/definitions";
import * as FileSystem from "expo-file-system";

// Upload image to Supabase Storage
const uploadImageToStorage = async (imageUri: string, fileName: string) => {
  try {
    if (!imageUri) {
      throw new Error("Invalid image URI provided.");
    }

    // Read the file from the local URI as a binary file
    const file = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert the Base64 string to a Uint8Array
    const byteArray = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("veggie-images") // Replace with your Supabase storage bucket name
      .upload(fileName, byteArray, {
        contentType: "image/jpeg", // Adjust the MIME type as needed
        upsert: true, // Overwrite the file if it already exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("veggie-images")
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;

    return publicUrl;
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Create a new vegetable
export const createVeggie = async (veggie: VeggieType) => {
  try {
    let imageUrl = null;

    // Upload the main image to Supabase Storage if an image is provided
    if (veggie.image) {
      const fileName = `veggie-${Date.now()}.jpg`; // Generate a unique file name
      imageUrl = await uploadImageToStorage(veggie.image, fileName);
    }

    // Upload images for each stage and update the stages array
    const updatedStages = await Promise.all(
      veggie.stages.map(async (stage, index) => {
        if (stage.imageUrl) {
          const stageFileName = `veggie-stage-${index + 1}-${Date.now()}.jpg`;
          const stageImageUrl = await uploadImageToStorage(
            stage.imageUrl,
            stageFileName
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
    // Remove the `id` field from the update payload if it exists
    const { id: _, ...updatePayload } = updatedVeggie;

    const { error } = await supabase
      .from("veggies")
      .update(updatePayload) // Use the cleaned update payload
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
