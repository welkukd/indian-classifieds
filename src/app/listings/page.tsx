"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Filter, X, ChevronDown, ChevronUp, Grid, List, Heart, Clock, Tag } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: string;
  priceType: string;
  condition: string;
  category: string;
  subCategory: string;
  city: string;
  locality: string;
  images: string[];
  postedAt: string;
  views: number;
}

const mockListings: Listing[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "iPhone 15 Pro Max 256GB Natural Titanium",
    "Honda City 2022 V CVT Petrol - Single Owner",
    "2 BHK Flat for Rent - Fully Furnished",
    "Senior React Developer - Remote + Office",
    "MacBook Pro M3 14\" 18GB 512GB Space Black",
    "Royal Enfield Classic 350 2023 Model",
    "3 BHK Independent House for Sale",
    "Digital Marketing Executive - Fresher Welcome",
    "Samsung 55\" 4K Smart TV - 1 Year Old",
    "Bajaj Pulsar NS200 2022 - Well Maintained",
    "Designer Lehenga Choli - Worn Once",
    "Wooden King Bed with Storage - Teak",
    "Yamaha FZ-X 2023 Matte Green",
    "PG for Girls - AC Rooms, Food Included",
    "Canon EOS R6 Mark II + 24-105mm Lens",
    "Activa 6G 2023 Deluxe - Lady Driven",
    "Office Space for Rent - Prime Location",
    "Gym Equipment Set - Dumbbells, Bench, Rod",
    "Persian Cat Kitten - 3 Months Old",
    "Project Manager - 8+ Years Exp",
  ][i],
  price: [
    "₹1,34,900", "₹11,50,000", "₹35,000/month", "₹25-35 LPA",
    "₹1,89,900", "₹1,95,000", "₹1.2 Cr", "₹4-6 LPA",
    "₹45,000", "₹1,15,000", "₹25,000", "₹45,000",
    "₹1,35,000", "₹12,000/month", "₹2,10,000", "₹85,000",
    "₹55,000/month", "₹18,000", "₹45,000", "₹18-25 LPA",
  ][i],
  priceType: ["negotiable", "negotiable", "fixed", "fixed", "negotiable", "negotiable", "negotiable", "fixed", "fixed", "negotiable", "negotiable", "fixed", "negotiable", "fixed", "negotiable", "fixed", "fixed", "negotiable", "fixed", "fixed"][i],
  condition: ["like_new", "used", "like_new", "new", "like_new", "used", "used", "new", "used", "like_new", "like_new", "used", "like_new", "new", "like_new", "like_new", "new", "used", "new", "new"][i],
  category: ["Electronics", "Vehicles", "Property", "Jobs", "Electronics", "Vehicles", "Property", "Jobs", "Electronics", "Vehicles", "Fashion", "Home & Garden", "Vehicles", "Property", "Electronics", "Vehicles", "Property", "Sports & Fitness", "Pets", "Jobs"][i],
  subCategory: ["Mobiles", "Cars", "Flats for Rent", "IT & Software", "Laptops", "Bikes & Scooters", "Houses for Sale", "Sales & Marketing", "TVs & Audio", "Bikes & Scooters", "Women's Clothing", "Furniture", "Bikes & Scooters", "PG/Hostels", "Cameras", "Bikes & Scooters", "Commercial", "Gym Equipment", "Cats", "IT & Software"][i],
  city: ["Mumbai", "Bangalore", "Hyderabad", "Bangalore", "Delhi", "Pune", "Chennai", "Mumbai", "Kolkata", "Ahmedabad", "Delhi", "Bangalore", "Jaipur", "Lucknow", "Mumbai", "Hyderabad", "Pune", "Chennai", "Kolkata", "Delhi"][i],
  locality: ["Bandra West", "Koramangala", "Hitech City", "Whitefield", "Connaught Place", "Koregaon Park", "Anna Nagar", "Andheri East", "Salt Lake", "Satellite", "Lajpat Nagar", "Indiranagar", "C-Scheme", "Gomti Nagar", "Lower Parel", "Madhapur", "Baner", "T. Nagar", "New Alipore", "Gurgaon"][i],
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
  ],
  postedAt: [
    "2 hours ago", "4 hours ago", "1 hour ago", "30 mins ago",
    "5 hours ago", "3 hours ago", "6 hours ago", "2 hours ago",
    "1 day ago", "4 hours ago", "2 days ago", "5 hours ago",
    "3 hours ago", "1 hour ago", "4 hours ago", "2 hours ago",
    "1 day ago", "6 hours ago", "3 hours ago", "4 hours ago",
  ][i],
  views: Math.floor(Math.random() * 500) + 50,
}));

const categories = [
  "All", "Electronics", "Vehicles", "Property", "Jobs", "Services",
  "Fashion", "Home & Garden", "Books & Hobbies", "Sports & Fitness", "Pets"
];

const cities = [
  "All Cities", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Viewed" },
];

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

export default function ListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(mockListings);

  useEffect(() => {
    let result = [...mockListings];
    
    if (selectedCategory !== "All") {
      result = result.filter(l => l.category === selectedCategory);
    }
    if (selectedCity !== "All Cities") {
      result = result.filter(l => l.city === selectedCity);
    }
    
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")));
        break;
      case "price_high":
        result.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")));
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        // newest first (already in order)
        break;
    }
    
    setFilteredListings(result);
  }, [selectedCategory, selectedCity, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedCity("All Cities");
    setSortBy("newest");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedCity !== "All Cities";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Filters */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⬣</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DesiList</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/post" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors">
                <span className="text-xl">+</span>
                Post Free Ad
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* City Filter */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer max-w-[180px]"
                >
                  {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white text-amber-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white text-amber-600 shadow" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filteredListings.length}</span> results
              </p>
              {hasActiveFilters && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  {selectedCategory !== "All" && selectedCategory}
                  {selectedCategory !== "All" && selectedCity !== "All Cities" && " • "}
                  {selectedCity !== "All Cities" && selectedCity}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Listings Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredListings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
              {viewMode === "grid" ? (
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-gray-700">{listing.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.priceType === "negotiable" ? "bg-green-100 text-green-700" :
                        listing.priceType === "exchange" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {priceTypeLabels[listing.priceType] || listing.priceType}
                      </span>
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">{listing.title}</h3>
                    <p className="text-xl font-bold text-amber-600 mb-2">{listing.price}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{listing.locality}, {listing.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {listing.postedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {conditionLabels[listing.condition] || listing.condition}
                      </span>
                    </div>
                  </div>
                </article>
              ) : (
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-64 h-48 sm:h-auto aspect-video sm:aspect-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-gray-700">{listing.category}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          listing.priceType === "negotiable" ? "bg-green-100 text-green-700" :
                          listing.priceType === "exchange" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {priceTypeLabels[listing.priceType] || listing.priceType}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{conditionLabels[listing.condition] || listing.condition}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">{listing.title}</h3>
                      <p className="text-xl font-bold text-amber-600 mb-2">{listing.price}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {listing.locality}, {listing.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {listing.postedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {listing.views} views
                      </span>
                    </div>
                  </div>
                </article>
              )}
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search in a different category</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredListings.length > 12 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="w-10 h-10 rounded-xl bg-amber-500 text-white font-medium">1</button>
            <button className="w-10 h-10 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">2</button>
            <button className="w-10 h-10 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
            <button className="w-10 h-10 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">5</button>
            <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⬣</span>
                </div>
                <span className="text-2xl font-bold text-white">DesiList</span>
              </Link>
              <p className="text-sm">India's fastest growing free classifieds.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(1, 5).map((cat) => (
                  <li key={cat}><Link href={`/listings?category=${cat}`} className="hover:text-amber-400 transition-colors">{cat}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-amber-400 transition-colors">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 DesiList. Made for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}