import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent("Supabase not configured")}`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent("Supabase unavailable")}`);
  }

  if (code) {
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`);
    }

    if (user) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          verified: user.app_metadata?.provider === "google" ? true : false,
        });
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}