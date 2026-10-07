"use client";

import Link from "next/link";
import { MapPin, Tag, ArrowRight, ChevronRight } from "lucide-react";
import { Button, Card } from "@/components/ui";

interface CategoryPageContentProps {
  category: {
    name: string;
    icon: string;
    description: string;
    subCategories: string[];
  };
  slug: string;
  subCategories: string[];
}

export default function CategoryPageContent({ category, slug, subCategories }: CategoryPageContentProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2" aria-label="DesiList Home">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-xl">⬣</span>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900">DesiList</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1">
                <Link href="/listings" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Browse</Link>
                <Link href="/categories" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Categories</Link>
                <Link href="/safety" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Safety</Link>
              </nav>
              <div className="w-px h-6 bg-neutral-200 mx-2" />
              <Link href="/auth" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Sign in</Link>
              <Link href="/post" className="btn btn-primary px-5 py-2.5 text-sm">
                <span className="text-xl mr-1">+</span>
                Post Free Ad
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="pt-6 pb-12 lg:pb-20">
        <div className="container">
          {/* Category Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="page-title">{category.name}</h1>
                <p className="page-subtitle">{category.description}</p>
              </div>
            </div>
            <Link href="/post" className="btn btn-primary inline-flex">
              Post in {category.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sub-categories */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900">Browse Sub-Categories</h2>
              <Link href="/listings" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subCategories.map((sub) => (
                <Link
                  key={sub}
                  href={`/listings?category=${slug}&subcategory=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                  className="card card-outlined p-6 hover:border-brand-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">{sub}</h3>
                  <p className="text-sm text-neutral-500 mt-1">View listings</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Cities Quick Links */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900">Popular Cities</h2>
              <Link href="/listings" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"].map((city) => (
                <Link
                  key={city}
                  href={`/listings?category=${slug}&city=${city}`}
                  className="px-4 py-2 bg-white rounded-xl border border-neutral-200 text-neutral-700 hover:border-brand-300 hover:text-brand-600 hover:shadow-md transition-all text-sm font-medium"
                >
                  {city}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
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