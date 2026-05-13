import { createClient } from "@supabase/supabase-js";

let envUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Automatically append https:// if the user forgot it
if (envUrl && !envUrl.startsWith('http')) {
  envUrl = `https://${envUrl}`;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const supabaseUrl = isValidUrl(envUrl) ? envUrl : "https://placeholder-project.supabase.co";
const supabaseAnonKey = envKey || "placeholder-anon-key";

console.log("Supabase URL configured:", !!envUrl, "Valid URL:", isValidUrl(envUrl));

// Use a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (url, init) => {
      return fetch(url, init).catch(err => {
        console.error("Supabase global fetch error:", err, "URL:", url);
        throw err;
      });
    }
  }
});

export const isSupabaseConfigured = () => {
    return supabaseUrl !== "https://placeholder-project.supabase.co" && supabaseAnonKey !== "placeholder-anon-key";
};
