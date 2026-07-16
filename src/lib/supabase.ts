import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in environment variables. Please check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
