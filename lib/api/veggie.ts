import { supabase } from "@/utils/supabase";
import { VeggieForm } from "@/lib/definitions";

// Create a new vegetable
export const createVeggie = async (veggie: VeggieForm) => {
  try {
    const { error } = await supabase.from("veggies").insert([
      {
        name: veggie.name,
        description: veggie.description,
        type: veggie.type,
        image: veggie.image,
        stages: veggie.stages,
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
export const getAllVeggies = async () => {
  try {
    const { data, error } = await supabase.from("veggies").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
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
  updatedVeggie: Partial<VeggieForm>
) => {
  try {
    const { error } = await supabase
      .from("veggies")
      .update(updatedVeggie)
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
