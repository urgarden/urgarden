import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";

/**
 * Upload an image to Supabase Storage.
 * @param imageUri - The local URI of the image to upload.
 * @param fileName - The name of the file to save in the bucket.
 * @param bucketName - The name of the Supabase storage bucket.
 * @returns The public URL of the uploaded image.
 */
export const uploadImageToStorage = async (
  imageUri: string,
  fileName: string,
  bucketName: string
): Promise<string> => {
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
      .from(bucketName) // Use the provided bucket name
      .upload(fileName, byteArray, {
        contentType: "image/jpeg", // Adjust the MIME type as needed
        upsert: true, // Overwrite the file if it already exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    const publicUrl = publicUrlData.publicUrl;

    return publicUrl;
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};
