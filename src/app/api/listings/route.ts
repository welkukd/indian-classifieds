import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Get category_id and subcategory_id from slugs
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", body.category)
    .single();

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id")
    .eq("slug", body.subCategory)
    .eq("category_id", category?.id)
    .single();

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", body.city)
    .single();

  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: user.id,
      category_id: category?.id || null,
      subcategory_id: subcategory?.id || null,
      city_id: city?.id || null,
      title: body.title,
      description: body.description,
      price: body.price,
      price_type: body.priceType,
      condition: body.condition,
      locality: body.locality,
      pincode: body.pincode,
      images: body.images || [],
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    // Mock listings for demo when Supabase not configured
    const mockListings = [
      {
        id: "1",
        title: "iPhone 15 Pro Max 256GB Natural Titanium",
        price: 134900,
        priceType: "negotiable",
        condition: "like_new",
        category: "Electronics",
        subCategory: "Mobiles",
        city: "Mumbai",
        locality: "Andheri West",
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"],
        postedAt: "2025-01-15T10:30:00Z",
        views: 245,
        isFeatured: true,
        isSaved: false,
        description: "Barely used iPhone 15 Pro Max 256GB in Natural Titanium. No scratches, battery health 100%. Comes with original box, charger, and case. Purchased 2 months ago.",
        user_id: "demo-user",
        status: "active",
      },
      {
        id: "2",
        title: "Honda City 2022 VX CVT Petrol",
        price: 1250000,
        priceType: "negotiable",
        condition: "used",
        category: "Vehicles",
        subCategory: "Cars",
        city: "Delhi",
        locality: "Rohini",
        images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"],
        postedAt: "2025-01-14T14:20:00Z",
        views: 512,
        isFeatured: false,
        isSaved: true,
        description: "Single owner Honda City VX CVT 2022 model. 15,000 km driven. Full service history, zero accidents. Black colour. Insurance valid till 2026.",
        user_id: "demo-user",
        status: "active",
      },
      {
        id: "3",
        title: "2 BHK Flat for Rent in Koramangala",
        price: 35000,
        priceType: "fixed",
        condition: "like_new",
        category: "Property",
        subCategory: "Flats for Rent",
        city: "Bangalore",
        locality: "Koramangala",
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        postedAt: "2025-01-13T09:15:00Z",
        views: 890,
        isFeatured: true,
        isSaved: false,
        description: "Semi-furnished 2 BHK in prime Koramangala. 2 bathrooms, balcony, modular kitchen, AC in master bedroom. Gated society with gym, pool, power backup. Metro 500m.",
        user_id: "demo-user",
        status: "active",
      },
      {
        id: "4",
        title: "React Developer - Full Time Remote",
        price: 1500000,
        priceType: "fixed",
        condition: "new",
        category: "Jobs",
        subCategory: "IT & Software",
        city: "Pune",
        locality: "Koregaon Park",
        images: [],
        postedAt: "2025-01-12T11:00:00Z",
        views: 340,
        isFeatured: false,
        isSaved: false,
        description: "Hiring Senior React Developer (3+ years). Remote-first company. Stack: React, TypeScript, Next.js, Node.js. Competitive salary + equity. Apply with portfolio.",
        user_id: "demo-user",
        status: "active",
      },
      {
        id: "5",
        title: "Royal Enfield Classic 350 2023 Model",
        price: 195000,
        priceType: "negotiable",
        condition: "used",
        category: "Vehicles",
        subCategory: "Bikes & Scooters",
        city: "Chennai",
        locality: "Adyar",
        images: ["https://images.unsplash.com/photo-1558981403-c5f9899a580f?w=800"],
        postedAt: "2025-01-11T16:45:00Z",
        views: 156,
        isFeatured: false,
        isSaved: true,
        description: "Classic 350 Chrome Bronze 2023 model. 3,200 km only. All stock, never modified. Service done at authorized center. Helmet and lock included.",
        user_id: "demo-user",
        status: "active",
      },
      {
        id: "6",
        title: "MacBook Pro 14 M3 Pro 18GB 512GB Space Black",
        price: 184900,
        priceType: "negotiable",
        condition: "like_new",
        category: "Electronics",
        subCategory: "Laptops",
        city: "Hyderabad",
        locality: "Gachibowli",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"],
        postedAt: "2025-01-10T12:30:00Z",
        views: 678,
        isFeatured: true,
        isSaved: false,
        description: "MacBook Pro 14 M3 Pro chip, 18GB unified memory, 512GB SSD. Space Black. Purchased November 2024. AppleCare+ valid. No scratches, includes box and 96W charger.",
        user_id: "demo-user",
        status: "active",
      },
    ];

    let filtered = mockListings;
    if (category && category !== "all") {
      filtered = filtered.filter(l => l.category.toLowerCase() === category.toLowerCase());
    }
    if (city && city !== "all") {
      filtered = filtered.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json({ data: paginated, count: filtered.length });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const city = searchParams.get("city");
  const query = searchParams.get("q");
  const condition = searchParams.get("condition")?.split(",").filter(Boolean);
  const priceType = searchParams.get("price_type")?.split(",").filter(Boolean);
  const priceMin = searchParams.get("price_min") ? parseFloat(searchParams.get("price_min")!) : null;
  const priceMax = searchParams.get("price_max") ? parseFloat(searchParams.get("price_max")!) : null;
  const sortBy = searchParams.get("sort") || "newest";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (parseInt(searchParams.get("page") || "1") - 1) * limit;

  const { data, error, count } = await supabase.rpc("search_listings", {
    p_category_slug: category,
    p_subcategory_slug: subcategory,
    p_city_slug: city,
    p_query: query,
    p_condition: condition || null,
    p_price_type: priceType || null,
    p_price_min: priceMin,
    p_price_max: priceMax,
    p_sort_by: sortBy,
    p_limit: limit,
    p_offset: offset,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  const totalCount = data?.[0]?.total_count || 0;
  return NextResponse.json({ data, count: totalCount });
}