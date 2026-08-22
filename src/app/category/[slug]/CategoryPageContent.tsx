"use client";

import Link from "next/link";
import { MapPin, Tag, ArrowRight } from "lucide-react";

interface CategoryPageContentProps {
  category: {
    name: string;
    icon: string;
    description: string;
    subCategories: string[];
  };
  slug: string;
}

export default function CategoryPageContent({ category, slug }: CategoryPageContentProps) {
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
            >
              <span className="text-xl">+</span>
              Post Free Ad
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Post in {category.name}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Sub-categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Sub-Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.subCategories.map((sub) => (
              <Link
                key={sub}
                href={`/listings?category=${slug}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">{sub}</h3>
                <p className="text-sm text-gray-500 mt-1">View listings</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Cities Quick Links */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cities</h2>
          <div className="flex flex-wrap gap-3">
            {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"].map((city) => (
              <Link
                key={city}
                href={`/listings?category=${slug}&city=${city}`}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm">
          <p>© 2025 DesiList. Made for India.</p>
        </div>
      </footer>
    </div>
  );
}