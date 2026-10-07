import { Metadata } from "next";
import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "My Dashboard | DesiList",
  description: "Manage your ads, track performance, and boost your listings on DesiList.",
};

async function getDashboardData() {
  // In real app, fetch from Supabase
  return {
    stats: {
      activeAds: 5,
      totalViews: 1247,
      totalMessages: 23,
      savedSearches: 3,
    },
    myAds: [
      {
        id: "1",
        title: "iPhone 15 Pro Max 256GB Natural Titanium",
        price: 134900,
        priceType: "negotiable" as const,
        condition: "like_new" as const,
        category: "Electronics",
        subCategory: "Mobiles",
        city: "Mumbai",
        locality: "Bandra West",
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop"],
        postedAt: "2025-01-15T10:30:00Z",
        views: 247,
        status: "active" as const,
        isFeatured: true,
      },
      {
        id: "2",
        title: "MacBook Pro M3 14\" 18GB 512GB Space Black",
        price: 189900,
        priceType: "negotiable" as const,
        condition: "like_new" as const,
        category: "Electronics",
        subCategory: "Laptops",
        city: "Delhi",
        locality: "Connaught Place",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop"],
        postedAt: "2025-01-14T14:00:00Z",
        views: 178,
        status: "active" as const,
        isFeatured: false,
      },
      {
        id: "3",
        title: "Honda City 2022 V CVT Petrol",
        price: 1150000,
        priceType: "negotiable" as const,
        condition: "used" as const,
        category: "Vehicles",
        subCategory: "Cars",
        city: "Bangalore",
        locality: "Koramangala",
        images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"],
        postedAt: "2025-01-10T08:00:00Z",
        views: 89,
        status: "paused" as const,
        isFeatured: false,
      },
    ],
    savedListings: [
      {
        id: "4",
        title: "Royal Enfield Classic 350 2023 Model",
        price: 195000,
        priceType: "negotiable" as const,
        condition: "used" as const,
        category: "Vehicles",
        subCategory: "Bikes & Scooters",
        city: "Pune",
        locality: "Koregaon Park",
        images: ["https://images.unsplash.com/photo-1568772354582-6f1c5c7c6e3d?w=800&h=600&fit=crop"],
        postedAt: "2025-01-14T16:00:00Z",
        views: 267,
        status: "active" as const,
        isFeatured: false,
      },
    ],
    profile: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh@example.com",
      verified: true,
      rating: 4.8,
      adsCount: 12,
      joinedAt: "2024-06-15T00:00:00Z",
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent data={data} />
    </Suspense>
  );
}