"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Edit, Pause, CheckCircle, Trash2, BarChart3, Clock, Eye, 
  ArrowUpDown, Heart, MessageSquare, Shield, Star, User, Mail,
  MapPin, Tag, Menu, X, ChevronRight, ChevronLeft, Phone
} from "lucide-react";
import { Button, Badge, Card, CardContent, Avatar, Modal } from "@/components/ui";
import { formatPrice, formatRelativeTime, cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  priceType: "fixed" | "negotiable" | "exchange";
  condition: "new" | "like_new" | "used" | "fair";
  category: string;
  subCategory: string;
  city: string;
  locality: string;
  images: string[];
  postedAt: string;
  views: number;
  status: "active" | "paused" | "sold" | "draft";
  isFeatured: boolean;
}

interface DashboardData {
  stats: {
    activeAds: number;
    totalViews: number;
    totalMessages: number;
    savedSearches: number;
  };
  myAds: Listing[];
  savedListings: Listing[];
  profile: {
    name: string;
    phone: string;
    email: string;
    verified: boolean;
    rating: number;
    adsCount: number;
    joinedAt: string;
  };
}

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  paused: { label: "Paused", color: "bg-amber-100 text-amber-700", icon: Pause },
  sold: { label: "Sold", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-neutral-100 text-neutral-500", icon: Clock },
};

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  like_new: "Like New",
  used: "Good",
  fair: "Fair",
};

const priceTypeLabels: Record<string, string> = {
  fixed: "Fixed",
  negotiable: "Negotiable",
  exchange: "Exchange",
};

const tabs = [
  { id: "my-ads", label: "My Ads", icon: BarChart3 },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
] as const;

export default function DashboardContent({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["id"]>("my-ads");
  const [sortField, setSortField] = useState("postedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSortedListings = (listings: Listing[]) => {
    return [...listings].sort((a, b) => {
      const aVal = a[sortField as keyof Listing];
      const bVal = b[sortField as keyof Listing];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  };

  const handleDelete = (id: string) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = (id: string) => {
    // API call to delete
    setShowDeleteModal(null);
  };

  const handleToggleStatus = (listing: Listing) => {
    // API call to toggle status
  };

  const handleBoost = (listing: Listing) => {
    router.push(`/boost?listing=${listing.id}`);
  };

  if (activeTab === "my-ads") {
    const sortedAds = getSortedListings(data.myAds);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">My Ads</h2>
            <p className="text-sm text-neutral-500">{data.myAds.length} ad{data.myAds.length !== 1 ? "s" : ""} • {data.stats.activeAds} active</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/post" className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Post New Ad
            </Link>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortField(field);
              setSortOrder(order);
            }}
            className="input input-bordered w-full sm:w-48"
          >
            <option value="postedAt-desc">Newest first</option>
            <option value="postedAt-asc">Oldest first</option>
            <option value="views-desc">Most viewed</option>
            <option value="views-asc">Least viewed</option>
            <option value="price-desc">Price: High to low</option>
            <option value="price-asc">Price: Low to high</option>
          </select>
        </div>

        {/* Ads Grid */}
        {data.myAds.length === 0 ? (
          <Card variant="outlined" className="bg-white">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No ads yet</h3>
              <p className="text-neutral-500 mb-6">Start selling by posting your first ad — it's free!</p>
              <Link href="/post" className="btn btn-primary inline-flex">
                <Plus className="w-4 h-4" />
                Post Your First Ad
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAds.map((listing) => {
              const status = statusConfig[listing.status];
              const StatusIcon = status.icon;
              return (
                <Card key={listing.id} variant="outlined" className="bg-white hover:border-brand-300 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <Badge variant="brand" size="sm">{listing.category}</Badge>
                        {listing.isFeatured && <Badge variant="warning" size="sm">Featured</Badge>}
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          status.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <Link href={`/listing/${listing.id}`} className="group">
                        <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors">{listing.title}</h3>
                      </Link>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-bold text-brand-600">{formatPrice(listing.price)}</span>
                        <span className="text-sm text-neutral-500">({priceTypeLabels[listing.priceType]})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {listing.locality}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {listing.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          {conditionLabels[listing.condition]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                        <Button variant="ghost" size="sm" className="flex-1" leftIcon={<Edit className="w-3.5 h-3.5" />} onClick={() => router.push(`/post?edit=${listing.id}`)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1" leftIcon={listing.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />} onClick={() => handleToggleStatus(listing)}>
                          {listing.status === "active" ? "Pause" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1" leftIcon={<BarChart3 className="w-3.5 h-3.5" />} onClick={() => handleBoost(listing)}>
                          Boost
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-error-600 hover:bg-error-50" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => handleDelete(listing.id)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "saved") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Saved Listings</h2>
            <p className="text-sm text-neutral-500">{data.savedListings.length} saved item{data.savedListings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {data.savedListings.length === 0 ? (
          <Card variant="outlined" className="bg-white">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                <Heart className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No saved listings yet</h3>
              <p className="text-neutral-500 mb-6">Save listings you like to find them easily later</p>
              <Link href="/listings" className="btn btn-primary inline-flex">
                Browse Listings
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.savedListings.map((listing) => (
              <Card key={listing.id} variant="outlined" className="bg-white hover:border-brand-300 hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="brand" size="sm">{listing.category}</Badge>
                    </div>
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-error-500 transition-colors shadow-lg" aria-label="Remove from saved">
                      <Heart className="w-5 h-5 fill-current text-error-500" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <Link href={`/listing/${listing.id}`} className="group">
                      <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-brand-600 transition-colors">{listing.title}</h3>
                    </Link>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-bold text-brand-600">{formatPrice(listing.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {listing.locality}, {listing.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {listing.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-neutral-100">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/listing/${listing.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "messages") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Messages</h2>
          <p className="text-sm text-neutral-500">Your conversations with buyers and sellers</p>
        </div>

        <Card variant="outlined" className="bg-white">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-neutral-300" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Messages coming soon</h3>
            <p className="text-neutral-500 mb-6">Chat with buyers directly on WhatsApp for now</p>
            <Link href="/listings" className="btn btn-primary inline-flex">
              Browse Listings
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === "profile") {
    const { profile } = data;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Profile</h2>
          <p className="text-sm text-neutral-500">Manage your account and settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card variant="outlined" className="bg-white lg:col-span-1">
            <CardContent className="pt-0">
              <div className="text-center space-y-4 p-6">
                <Avatar name={profile.name} size="2xl" className="mx-auto ring-2 ring-white" />
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">{profile.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {profile.verified && (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                    <span className="flex items-center gap-1 text-sm text-neutral-500">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      {profile.rating}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Member since {new Date(profile.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center pt-4 border-t border-neutral-100">
                  <div className="p-3 rounded-xl bg-neutral-50">
                    <p className="text-2xl font-bold text-neutral-900">{profile.adsCount}</p>
                    <p className="text-xs text-neutral-500">Active Ads</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50">
                    <p className="text-2xl font-bold text-neutral-900">{data.stats.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Total Views</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="outlined" className="bg-white">
              <CardContent className="pt-0 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Full Name</p>
                      <p className="font-medium text-neutral-900">{profile.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Email</p>
                      <p className="font-medium text-neutral-900">{profile.email}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Phone</p>
                      <p className="font-medium text-neutral-900">+91 {profile.phone}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="bg-white">
              <CardContent className="pt-0 p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Account Settings</h3>
                <div className="space-y-3">
                  <Link href="/dashboard?tab=my-ads" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">My Ads</p>
                      <p className="text-sm text-neutral-500">Manage your active and past listings</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </Link>
                  <Link href="/dashboard?tab=saved" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">Saved Listings</p>
                      <p className="text-sm text-neutral-500">Items you've bookmarked</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">Privacy & Security</p>
                      <p className="text-sm text-neutral-500">Manage your data and privacy settings</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </Link>
                  <Link href="/help" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">Help & Support</p>
                      <p className="text-sm text-neutral-500">Get help with your account</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card variant="outlined" className="bg-white border-error-200">
              <CardContent className="pt-0 p-6">
                <Button variant="danger" className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}