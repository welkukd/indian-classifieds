"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  MapPin, Filter, X, ChevronDown, ChevronUp, Grid, List, Heart, 
  Clock, Tag, SlidersHorizontal, Map, Search, Truck, Building, Briefcase,
  Loader2
} from "lucide-react";
import { Button, Input, Select, Badge, Card, Skeleton } from "@/components/ui";
import { formatPrice, formatRelativeTime, cn } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  price_type: "fixed" | "negotiable" | "exchange";
  condition: "new" | "like_new" | "used" | "fair";
  category_slug: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  subcategory_slug: string;
  subcategory_name: string;
  city_slug: string;
  city_name: string;
  locality: string;
  images: string[];
  views: number;
  is_featured: boolean;
  posted_at: string;
  user_id?: string;
}

const priceTypes = [
  { value: "fixed", label: "Fixed Price" },
  { value: "negotiable", label: "Negotiable" },
  { value: "exchange", label: "Exchange" },
];

const conditions = [
  { value: "new", label: "Brand New" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Good" },
  { value: "fair", label: "Fair" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
      if (selectedCity) params.set("city", selectedCity);
      if (selectedConditions.length > 0) params.set("condition", selectedConditions.join(","));
      if (selectedPriceTypes.length > 0) params.set("price_type", selectedPriceTypes.join(","));
      if (priceRange.min) params.set("price_min", priceRange.min);
      if (priceRange.max) params.set("price_max", priceRange.max);
      params.set("sort", sortBy);
      params.set("limit", "20");
      params.set("page", page.toString());

      const response = await fetch(`/api/listings?${params.toString()}`);
      const result = await response.json();
      
      if (result.data) {
        setListings(result.data);
        setTotalCount(result.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedCity, selectedConditions, selectedPriceTypes, priceRange, sortBy, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCity("");
    setSelectedConditions([]);
    setSelectedPriceTypes([]);
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters = 
    selectedCategory || 
    selectedSubcategory || 
    selectedCity || 
    selectedConditions.length > 0 || 
    selectedPriceTypes.length > 0 || 
    priceRange.min || 
    priceRange.max;

  const activeFilterCount = 
    (selectedCategory ? 1 : 0) +
    (selectedSubcategory ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    selectedConditions.length +
    selectedPriceTypes.length +
    (priceRange.min ? 1 : 0) +
    (priceRange.max ? 1 : 0);

  const formatPriceType = (type: string) => {
    const pt = priceTypes.find(p => p.value === type);
    return pt ? pt.label : type;
  };

  const formatCondition = (condition: string) => {
    const c = conditions.find(c => c.value === condition);
    return c ? c.label : condition;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link className="flex items-center gap-2" aria-label="DesiList Home" href="/">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-xl">⬣</span>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900">DesiList</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1">
                <Link className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors" href="/listings">Browse</Link>
                <Link className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors" href="/categories">Categories</Link>
                <Link className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors" href="/safety">Safety</Link>
                <Link className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors" href="/help">Help</Link>
              </nav>
              <div className="w-px h-6 bg-neutral-200 mx-2"></div>
              <Link className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors" href="/auth">Sign in</Link>
              <Link className="btn btn-primary px-5 py-2.5 text-sm" href="/post">
                <span className="text-xl mr-1">+</span>Post Free Ad
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Search & Filter Bar */}
        <section className="bg-white border-b border-neutral-200 py-4">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-xl">
                <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="search"
                    placeholder="Search for cars, phones, flats, jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    aria-label="Search listings"
                  />
                </form>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  placeholder="All Categories"
                  options={[
                    { value: "electronics", label: "Electronics" },
                    { value: "vehicles", label: "Vehicles" },
                    { value: "property", label: "Property" },
                    { value: "jobs", label: "Jobs" },
                    { value: "services", label: "Services" },
                    { value: "fashion", label: "Fashion" },
                    { value: "home-garden", label: "Home & Garden" },
                    { value: "books-hobbies", label: "Books & Hobbies" },
                  ]}
                  className="w-full sm:w-48"
                />
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  placeholder="All Cities"
                  options={[
                    { value: "mumbai", label: "Mumbai" },
                    { value: "delhi", label: "Delhi" },
                    { value: "bangalore", label: "Bangalore" },
                    { value: "hyderabad", label: "Hyderabad" },
                    { value: "chennai", label: "Chennai" },
                    { value: "kolkata", label: "Kolkata" },
                    { value: "pune", label: "Pune" },
                    { value: "ahmedabad", label: "Ahmedabad" },
                  ]}
                  className="w-full sm:w-40"
                />
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="w-full sm:w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={showFilters ? <SlidersHorizontal className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  className={cn("gap-2", hasActiveFilters && "border-brand-500 text-brand-600 bg-brand-50")}
                >
                  Filters {hasActiveFilters && <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-neutral-600 hover:text-neutral-900">
                    <X className="w-4 h-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-neutral-100 animate-slide-down">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Condition</label>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => (
                        <label key={c.value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-all hover:bg-neutral-50">
                          <input
                            type="checkbox"
                            checked={selectedConditions.includes(c.value)}
                            onChange={(e) => setSelectedConditions(prev => 
                              e.target.checked ? [...prev, c.value] : prev.filter(v => v !== c.value)
                            )}
                            className="w-4 h-4 text-brand-500 border-neutral-300 rounded focus:ring-brand-500"
                          />
                          <span>{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Price Type</label>
                    <div className="flex flex-wrap gap-2">
                      {priceTypes.map((p) => (
                        <label key={p.value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-all hover:bg-neutral-50">
                          <input
                            type="checkbox"
                            checked={selectedPriceTypes.includes(p.value)}
                            onChange={(e) => setSelectedPriceTypes(prev => 
                              e.target.checked ? [...prev, p.value] : prev.filter(v => v !== p.value)
                            )}
                            className="w-4 h-4 text-brand-500 border-neutral-300 rounded focus:ring-brand-500"
                          />
                          <span>{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Min Price (₹)</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Max Price (₹)</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="No limit"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-neutral-600">
                  <span className="font-semibold text-neutral-900">{totalCount}</span> results
                  {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No listings found</h3>
                <p className="text-neutral-500 mb-6">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {listings.map((listing) => (
                      <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                        <Card className="overflow-hidden h-full transition-all hover:shadow-xl hover:border-brand-300 group-hover:-translate-y-1">
                          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                            {listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <MapPin className="w-12 h-12" />
                              </div>
                            )}
                            {listing.is_featured && (
                              <Badge variant="brand" className="absolute top-2 left-2" size="xs">Featured</Badge>
                            )}
                            <Badge className="absolute top-2 right-2 bg-white/90 backdrop-blur">
                              <span className="text-xs font-medium text-neutral-700">{formatPriceType(listing.price_type)}</span>
                            </Badge>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
                              <span className="px-2 py-0.5 bg-neutral-100 rounded-full">
                                {listing.category_name}
                              </span>
                              {listing.subcategory_name && (
                                <>
                                  <span>/</span>
                                  <span className="px-2 py-0.5 bg-neutral-100 rounded-full">
                                    {listing.subcategory_name}
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
                              {listing.title}
                            </h3>
                            <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                              {listing.locality}, {listing.city_name}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-neutral-900">
                                ₹{formatPrice(listing.price)}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-neutral-400">
                                <Clock className="w-4 h-4" />
                                <span>{formatRelativeTime(listing.posted_at)}</span>
                                <span className="mx-1">·</span>
                                <span>{listing.views} views</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                        <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-brand-300">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-64 aspect-square md:aspect-auto bg-neutral-100 flex-shrink-0">
                              {listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <MapPin className="w-12 h-12" />
                                </div>
                              )}
                              {listing.is_featured && (
                                <Badge variant="brand" className="absolute top-2 left-2" size="xs">Featured</Badge>
                              )}
                            </div>
                            <div className="p-4 flex flex-col justify-between md:flex-1">
                              <div>
                                <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2 flex-wrap">
                                  <span className="px-2 py-0.5 bg-neutral-100 rounded-full">
                                    {listing.category_name}
                                  </span>
                                  {listing.subcategory_name && (
                                    <>
                                      <span>/</span>
                                      <span className="px-2 py-0.5 bg-neutral-100 rounded-full">
                                        {listing.subcategory_name}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
                                  {listing.title}
                                </h3>
                                <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                                  {listing.locality}, {listing.city_name}
                                </p>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4 pt-4 border-t border-neutral-100">
                                <div>
                                  <span className="text-2xl font-bold text-neutral-900">
                                    ₹{formatPrice(listing.price)}
                                  </span>
                                  <Badge className="ml-2" variant="outline" size="xs">
                                    {formatPriceType(listing.price_type)}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatRelativeTime(listing.posted_at)}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{listing.views} views</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalCount > 20 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 text-sm font-medium text-neutral-700">
                      Page {page} of {Math.ceil(totalCount / 20)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(totalCount / 20)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container">
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>© 2025 DesiList. Made with care for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}