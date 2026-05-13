import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are read properly and trimmed to avoid invisible space issues
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

const formatUrl = (url: string) => {
  if (!url) return '';
  let formattedUrl = url;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  return formattedUrl;
};

export const isSupabaseConfigured = () => {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};

// We only use placeholders as a local development safeguard. 
// In production/Vercel, if they are missing, it will use empty strings which will lead to a loud clear error during init 
// or will be caught by isSupabaseConfigured() checks across the app.
const finalUrl = formatUrl(supabaseUrl) || "https://placeholder-project.supabase.co";
const finalKey = supabaseAnonKey || "placeholder-anon-key";

if (!isSupabaseConfigured()) {
  console.error(
    "⚠️ Supabase Configuration Error: Environment variables are missing or invalid.\n" +
    "Please check your Vercel dashboard or local .env file ensuring VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
