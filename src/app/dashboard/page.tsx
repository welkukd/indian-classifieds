import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Grid, Heart, User, BarChart3, Clock, CheckCircle, Pause, Trash2, Edit, Settings } from "lucide-react";
import DashboardContent from "./DashboardContent";

export const metadata = {
  title: "Dashboard - DesiList",
  description: "Manage your ads, saved listings, and profile on DesiList",
};

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: listings, count } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: saved } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    listings: listings || [],
    savedCount: saved?.length || 0,
    profile: profile || null,
    totalAds: count,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-500 mb-6">Please sign in to access your dashboard</p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Ads",
      value: data.totalAds?.toString() || "0",
      icon: <Grid className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Active",
      value: data.listings.filter(l => l.status === "active").length.toString(),
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Sold",
      value: data.listings.filter(l => l.status === "sold").length.toString(),
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Saved",
      value: data.savedCount.toString(),
      icon: <Heart className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⬣</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DesiList</span>
            </Link>
            <Link
              href="/post"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post New Ad
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-3xl font-bold">
            {data.profile?.name?.charAt(0) || data.user.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.profile?.name || data.user.email}
              </h1>
              {data.profile?.verified && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">
              {data.profile?.phone || data.user.email} • Member since {new Date(data.profile?.created_at || data.user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className={`bg-white rounded-2xl p-5 border border-gray-100 ${stat.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <DashboardContent listings={data.listings} />

        {/* Upgrade Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Boost Your Ads</h2>
              <p className="opacity-90 max-w-lg">
                Get more views, faster responses, and higher engagement with our premium features.
                Featured ads get 3x more views on average.
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="flex-shrink-0 px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";