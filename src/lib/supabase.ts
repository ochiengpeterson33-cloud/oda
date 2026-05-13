import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

const supabaseUrl = isValidUrl(envUrl) ? envUrl : "https://placeholder-project.supabase.co";
const supabaseAnonKey = envKey && envKey.length > 10 ? envKey : "placeholder-anon-key";

// Use a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    return isValidUrl(envUrl) && envKey !== undefined && envKey.length > 10;
};
