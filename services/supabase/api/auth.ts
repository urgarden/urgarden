import { supabaseServerClient } from "../server";
import { SignUpData, SignUpResponse } from "@/lib/definitions";

export const signup = async (data: SignUpData): Promise<SignUpResponse> => {
  try {
    // Signup using Supabase's signUp function
    const { data: authData, error: authError } =
      await supabaseServerClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData.user;

    if (!user) {
      throw new Error("User not found after signup.");
    }

    // Exclude the password and confirmPassword fields from the data
    const { password, confirmPassword, ...userData } = data;

    // Insert user data into the "users" table
    const { error: dbError } = await supabaseServerClient.from("users").insert({
      ...userData,
      userId: user.id,
      dateCreated: new Date().toISOString(),
    });

    if (dbError) {
      throw new Error(dbError.message);
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
