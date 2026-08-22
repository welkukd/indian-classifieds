"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Shield, Clock, Star, Zap, Heart, MessageSquare } from "lucide-react";

const categories = [
  { name: "Electronics", icon: "📱", count: "12.4k", color: "bg-blue-500" },
  { name: "Vehicles", icon: "🚗", count: "8.7k", color: "bg-green-500" },
  { name: "Property", icon: "🏠", count: "15.2k", color: "bg-purple-500" },
  { name: "Jobs", icon: "💼", count: "22.1k", color: "bg-orange-500" },
  { name: "Services", icon: "🔧", count: "6.8k", color: "bg-pink-500" },
  { name: "Fashion", icon: "👗", count: "9.3k", color: "bg-indigo-500" },
  { name: "Home & Garden", icon: "🪑", count: "5.4k", color: "bg-teal-500" },
  { name: "Books & Hobbies", icon: "📚", count: "3.2k", color: "bg-amber-500" },
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
];

const featuredAds = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB Natural Titanium",
    price: "₹1,34,900",
    location: "Bandra West, Mumbai",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Honda City 2022 V CVT Petrol - Single Owner",
    price: "₹11,50,000",
    location: "Koramangala, Bangalore",
    time: "4 hours ago",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    category: "Vehicles",
  },
  {
    id: 3,
    title: "2 BHK Flat for Rent - Fully Furnished",
    price: "₹35,000/month",
    location: "Hitech City, Hyderabad",
    time: "1 hour ago",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    category: "Property",
  },
  {
    id: 4,
    title: "Senior React Developer - Remote + Office",
    price: "₹25-35 LPA",
    location: "Whitefield, Bangalore",
    time: "30 mins ago",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    category: "Jobs",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">⬣</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">DesiList</span>
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cars, phones, flats, jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-gray-900 text-sm font-medium border-none focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%236b7280\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')", backgroundPosition: "right 0.75rem center" }}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <Link
                href="/post"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
              >
                <span className="text-lg">+</span>
                Post Free Ad
              </Link>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
              {categories.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(idx)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === idx
                      ? "bg-amber-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeCategory === idx ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "📦", label: "Active Listings", value: "2.4L+" },
            { icon: "👥", label: "Happy Users", value: "50L+" },
            { icon: "🏙️", label: "Cities Covered", value: "500+" },
            { icon: "⚡", label: "Avg Response", value: "12 min" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why DesiList */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Why DesiList?</h2>
            <Link href="/about" className="text-amber-600 font-medium hover:underline text-sm">Know more →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "100% Free Forever",
                desc: "Post unlimited ads without paying a rupee. No hidden fees, no subscription.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant WhatsApp Connect",
                desc: "Buyers message you directly on WhatsApp. No in-app chat delays.",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Verified Sellers",
                desc: "KYC-verified profiles with ratings. Buy and sell with confidence.",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Listings */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Just Listed Near You</h2>
            <Link href="/listings" className="text-amber-600 font-medium hover:underline text-sm">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAds.map((ad) => (
              <Link key={ad.id} href={`/listing/${ad.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-gray-700">{ad.category}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">{ad.title}</h3>
                  <p className="text-xl font-bold text-amber-600 mb-2">{ad.price}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{ad.location}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ad.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Faster?</h2>
          <p className="text-lg md:text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join 50 lakh+ Indians who trust DesiList. Post your first ad in 60 seconds — completely free.
          </p>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold text-lg rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
          >
            Post Your Free Ad Now
            <span className="text-2xl">→</span>
          </Link>
        </section>

        {/* Trust Indicators */}
        <section className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: MessageSquare, label: "Direct Chat", desc: "WhatsApp & Call" },
              { icon: Shield, label: "Safe Deals", desc: "Verified Users" },
              { icon: Clock, label: "Quick Response", desc: "Avg 12 minutes" },
              { icon: Heart, label: "Save Favorites", desc: "Track listings" },
            ].map((item, i) => (
              <div key={i} className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
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
              <p className="text-sm">India's fastest growing free classifieds. Buy, sell, rent, hire — locally.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.name}><Link href={`/category/${cat.name.toLowerCase()}`} className="hover:text-amber-400 transition-colors">{cat.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-amber-400 transition-colors">Safety Tips</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 DesiList. Made with ❤️ for India. Not affiliated with OLX, Quikr, or Karrot.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}