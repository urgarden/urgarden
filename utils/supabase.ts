import "react-native-url-polyfill/auto";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = Constants.expoConfig?.extra || {};

export const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
