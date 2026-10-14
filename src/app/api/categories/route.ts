import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MOCK_CATEGORIES = [
  { id: "1", slug: "electronics", name: "Electronics", icon: "Smartphone", color: "#3b82f6", sort_order: 1, is_active: true },
  { id: "2", slug: "vehicles", name: "Vehicles", icon: "Car", color: "#22c55e", sort_order: 2, is_active: true },
  { id: "3", slug: "property", name: "Property", icon: "Home", color: "#a855f7", sort_order: 3, is_active: true },
  { id: "4", slug: "jobs", name: "Jobs", icon: "Briefcase", color: "#f59e0b", sort_order: 4, is_active: true },
  { id: "5", slug: "services", name: "Services", icon: "Wrench", color: "#ec4899", sort_order: 5, is_active: true },
  { id: "6", slug: "fashion", name: "Fashion", icon: "Shirt", color: "#8b5cf6", sort_order: 6, is_active: true },
  { id: "7", slug: "home-garden", name: "Home & Garden", icon: "Sofa", color: "#06b6d4", sort_order: 7, is_active: true },
  { id: "8", slug: "books-hobbies", name: "Books & Hobbies", icon: "BookOpen", color: "#84cc16", sort_order: 8, is_active: true },
];

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: MOCK_CATEGORIES });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: MOCK_CATEGORIES });
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ data: MOCK_CATEGORIES });
  }

  return NextResponse.json({ data: data || MOCK_CATEGORIES });
}