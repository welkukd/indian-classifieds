import { type NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.next({ request });

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/post", "/dashboard", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}