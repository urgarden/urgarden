import { supabaseServerClient } from "../server";
import { SignUpData, SignUpResponse } from "@/lib/definitions";

export const signup = async (formData: SignUpData): Promise<SignUpResponse> => {
  try {
    // Signup using Supabase's signUp function
    const { data: authData, error: authError } =
      await supabaseServerClient.auth.signUp({
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
    const { error: insertError, data } = await supabaseServerClient
      .from("users")
      .insert([
        {
          user_id: user?.id,
          username: formData.username,
          email: formData.email,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      // If there is an error inserting user data, delete the user from auth
      if (user?.id) {
        await supabaseServerClient.auth.admin.deleteUser(user.id);
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
    const { error: authError } =
      await supabaseServerClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(authError.message);
    }

    return {
      message: "Login successful!",
      error: false,
      status: 200,
    };
  } catch (error: any) {
    return { error: true, message: error.message, status: 400 };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabaseServerClient.auth.signOut();
    if (error) {
      throw new Error("Failed to log out user");
    }
  } catch (error) {
    throw new Error("Failed to log out user");
  }
};
