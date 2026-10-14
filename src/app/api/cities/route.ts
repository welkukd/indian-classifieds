import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MOCK_CITIES = [
  { id: "1", name: "Mumbai", slug: "mumbai", state: "Maharashtra", is_metro: true, sort_order: 1, is_active: true },
  { id: "2", name: "Delhi", slug: "delhi", state: "Delhi", is_metro: true, sort_order: 2, is_active: true },
  { id: "3", name: "Bangalore", slug: "bangalore", state: "Karnataka", is_metro: true, sort_order: 3, is_active: true },
  { id: "4", name: "Hyderabad", slug: "hyderabad", state: "Telangana", is_metro: true, sort_order: 4, is_active: true },
  { id: "5", name: "Chennai", slug: "chennai", state: "Tamil Nadu", is_metro: true, sort_order: 5, is_active: true },
  { id: "6", name: "Kolkata", slug: "kolkata", state: "West Bengal", is_metro: true, sort_order: 6, is_active: true },
  { id: "7", name: "Pune", slug: "pune", state: "Maharashtra", is_metro: true, sort_order: 7, is_active: true },
  { id: "8", name: "Ahmedabad", slug: "ahmedabad", state: "Gujarat", is_metro: true, sort_order: 8, is_active: true },
  { id: "9", name: "Surat", slug: "surat", state: "Gujarat", is_metro: false, sort_order: 9, is_active: true },
  { id: "10", name: "Jaipur", slug: "jaipur", state: "Rajasthan", is_metro: false, sort_order: 10, is_active: true },
  { id: "11", name: "Lucknow", slug: "lucknow", state: "Uttar Pradesh", is_metro: false, sort_order: 11, is_active: true },
  { id: "12", name: "Kanpur", slug: "kanpur", state: "Uttar Pradesh", is_metro: false, sort_order: 12, is_active: true },
  { id: "13", name: "Nagpur", slug: "nagpur", state: "Maharashtra", is_metro: false, sort_order: 13, is_active: true },
  { id: "14", name: "Indore", slug: "indore", state: "Madhya Pradesh", is_metro: false, sort_order: 14, is_active: true },
  { id: "15", name: "Thane", slug: "thane", state: "Maharashtra", is_metro: false, sort_order: 15, is_active: true },
  { id: "16", name: "Bhopal", slug: "bhopal", state: "Madhya Pradesh", is_metro: false, sort_order: 16, is_active: true },
  { id: "17", name: "Visakhapatnam", slug: "visakhapatnam", state: "Andhra Pradesh", is_metro: false, sort_order: 17, is_active: true },
  { id: "18", name: "Pimpri-Chinchwad", slug: "pimpri-chinchwad", state: "Maharashtra", is_metro: false, sort_order: 18, is_active: true },
  { id: "19", name: "Patna", slug: "patna", state: "Bihar", is_metro: false, sort_order: 19, is_active: true },
  { id: "20", name: "Vadodara", slug: "vadodara", state: "Gujarat", is_metro: false, sort_order: 20, is_active: true },
  { id: "21", name: "Ghaziabad", slug: "ghaziabad", state: "Uttar Pradesh", is_metro: false, sort_order: 21, is_active: true },
  { id: "22", name: "Ludhiana", slug: "ludhiana", state: "Punjab", is_metro: false, sort_order: 22, is_active: true },
  { id: "23", name: "Agra", slug: "agra", state: "Uttar Pradesh", is_metro: false, sort_order: 23, is_active: true },
  { id: "24", name: "Nashik", slug: "nashik", state: "Maharashtra", is_metro: false, sort_order: 24, is_active: true },
  { id: "25", name: "Faridabad", slug: "faridabad", state: "Haryana", is_metro: false, sort_order: 25, is_active: true },
  { id: "26", name: "Meerut", slug: "meerut", state: "Uttar Pradesh", is_metro: false, sort_order: 26, is_active: true },
  { id: "27", name: "Rajkot", slug: "rajkot", state: "Gujarat", is_metro: false, sort_order: 27, is_active: true },
  { id: "28", name: "Kalyan-Dombivli", slug: "kalyan-dombivli", state: "Maharashtra", is_metro: false, sort_order: 28, is_active: true },
  { id: "29", name: "Vasai-Virar", slug: "vasai-virar", state: "Maharashtra", is_metro: false, sort_order: 29, is_active: true },
  { id: "30", name: "Varanasi", slug: "varanasi", state: "Uttar Pradesh", is_metro: false, sort_order: 30, is_active: true },
];

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: MOCK_CITIES });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ data: MOCK_CITIES });
  }

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Cities fetch error:", error);
    return NextResponse.json({ data: MOCK_CITIES });
  }

  return NextResponse.json({ data: data || MOCK_CITIES });
}