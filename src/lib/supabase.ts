import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const getValidUrl = (url: string) => {
  if (!url) return "https://placeholder-project.supabase.co";
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  try {
    new URL(formattedUrl);
    return formattedUrl;
  } catch {
    return "https://placeholder-project.supabase.co";
  }
};

const finalUrl = getValidUrl(supabaseUrl);
const finalKey = supabaseAnonKey.trim() || "placeholder-anon-key";

// Use a singleton instance of the Supabase client
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const isSupabaseConfigured = () => {
    // If the provided url is valid and the key is set, it's considered configured
    return finalUrl !== "https://placeholder-project.supabase.co" && finalKey !== "placeholder-anon-key" && finalKey.length > 0;
};
