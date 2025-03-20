import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage, // Use AsyncStorage for session persistence
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Not needed for React Native
    },
  }
);

// Middleware-like function to handle session and protected routes
export const handleSessionAndRoutes = async (route: string) => {
  try {
    // Get the current user session
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      return { redirect: "/login" }; // Redirect to login if no session
    }

    const user = session?.session?.user;

    // Handle protected routes
    if (route.startsWith("/protected") && !user) {
      return { redirect: "/login" }; // Redirect to login if user is not authenticated
    }

    // Handle public routes
    if (route === "/" && user) {
      return { redirect: "/protected" }; // Redirect to protected route if user is authenticated
    }

    return { user }; // Return the user if everything is fine
  } catch (err) {
    console.error("Error in session handling:", err);
    return { redirect: "/login" }; // Redirect to login on error
  }
};
