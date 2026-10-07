import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = (v: string | undefined) =>
  !v || v.includes("your-project") || v.includes("eyJhbG...here");

export const createClient = async () => {
  if (isPlaceholder(url) || isPlaceholder(key)) return null;
  const cookieStore = await cookies();
  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
    },
  });
};

export const isSupabaseConfigured = () => !isPlaceholder(url) && !isPlaceholder(key);