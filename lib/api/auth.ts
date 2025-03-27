// import { supabaseServerClient } from "../../utils/supabase/server";
import { SignUpData, SignUpResponse } from "@/lib/definitions";
import { supabase } from "@/utils/supabase";

export const signup = async (formData: SignUpData): Promise<SignUpResponse> => {
  try {
    // Check if the email already exists in the "users" table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", formData.email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Handle unexpected errors (ignore "PGRST116" which means no rows found)
      throw new Error(checkError.message);
    }

    if (existingUser) {
      // If the email already exists, return an error
      return {
        message: "Email is already registered. Please use a different email.",
        error: true,
        status: 400,
      };
    }

    // Signup using Supabase's signUp function
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData.user;

    if (!user) {
      throw new Error("User not found after signup.");
    }

    // Save the additional user data in your database
    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id: user.id,
        username: formData.username,
        email: formData.email,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      // If there is an error inserting user data, delete the user from auth
      if (user.id) {
        await supabase.auth.admin.deleteUser(user.id);
      }

      return {
        message: insertError.message,
        error: true,
        status: 400,
      };
    }

    return {
      message: "Account successfully created!",
      error: false,
      status: 201,
    };
  } catch (error: any) {
    return { error: true, message: error.message, status: 400 };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<SignUpResponse> => {
  try {
    // Login using Supabase's signInWithPassword function
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData.user;

    if (!user) {
      throw new Error("User not found after login.");
    }

    // Retrieve user metadata (e.g., role)
    const role = user.user_metadata?.role || ""; // Default to an empty string if no role is found

    // Return user details along with the login response
    return {
      message: "Login successful!",
      error: false,
      status: 200,
      user: {
        id: user.id,
        email: user.email || "",
        role,
      },
    };
  } catch (error: any) {
    return { error: true, message: error.message, status: 400 };
  }
};
export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error("Failed to log out user");
    }
  } catch (error) {
    throw new Error("Failed to log out user");
  }
};
export const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp://192.168.1.53:8081/reset-password", // Use your app's deep link
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message:
        "Password reset email sent successfully. Please check your inbox.",
    };
  } catch (error: any) {
    console.error("Error in forgotPassword:", error.message);
    return {
      success: false,
      message:
        error.message || "An unexpected error occurred. Please try again.",
    };
  }
};
