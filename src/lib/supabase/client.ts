import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = (v: string | undefined) =>
  !v || v.includes("your-project") || v.includes("eyJhbG...here");

export const createClient = () => {
  if (isPlaceholder(url) || isPlaceholder(key)) return null;
  return createBrowserClient(url!, key!);
};

export const isSupabaseConfigured = () => !isPlaceholder(url) && !isPlaceholder(key);