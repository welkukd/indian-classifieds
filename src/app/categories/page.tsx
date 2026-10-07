import { Metadata } from "next";
import Link from "next/link";
import { 
  Smartphone, Car, Home, Briefcase, Wrench, Shirt, Sofa, BookOpen,
  ChevronRight, MapPin, Search
} from "lucide-react";
import { Button, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "All Categories | DesiList",
  description: "Browse all categories on DesiList - Electronics, Vehicles, Property, Jobs, Services, Fashion, Home & Garden, Books & Hobbies",
};

const categories = [
  { slug: "electronics", name: "Electronics", icon: Smartphone, color: "blue", count: "12.4k", description: "Mobiles, laptops, cameras, audio, gaming & accessories" },
  { slug: "vehicles", name: "Vehicles", icon: Car, color: "green", count: "8.7k", description: "Cars, bikes, scooters, commercial vehicles & parts" },
  { slug: "property", name: "Property", icon: Home, color: "purple", count: "15.2k", description: "Flats, houses, PGs, plots, commercial & office space" },
  { slug: "jobs", name: "Jobs", icon: Briefcase, color: "indigo", count: "22.1k", description: "IT, sales, finance, engineering, teaching & more" },
  { slug: "services", name: "Services", icon: Wrench, color: "orange", count: "6.8k", description: "Home repair, tutors, beauty, events, packers & movers" },
  { slug: "fashion", name: "Fashion", icon: Shirt, color: "pink", count: "9.3k", description: "Clothing, footwear, accessories, jewellery & watches" },
  { slug: "home-garden", name: "Home & Garden", icon: Sofa, color: "teal", count: "5.4k", description: "Furniture, decor, kitchen, appliances & outdoor" },
  { slug: "books-hobbies", name: "Books & Hobbies", icon: BookOpen, color: "amber", count: "3.2k", description: "Books, instruments, art, collectibles, toys & sports" },
];

export default function CategoriesPage() {
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
                <Link href="/categories" className="px-3 py-2 text-sm font-semibold text-brand-600 rounded-lg bg-brand-50">Categories</Link>
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
          {/* Page Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="page-title">All Categories</h1>
            <p className="page-subtitle">Explore 8 main categories with 50+ subcategories. Find anything from phones to flats, jobs to jewellery.</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input 
                type="search" 
                placeholder="Search categories..." 
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-neutral-200 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent hover:border-neutral-300 transition-all text-lg"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
                  <Card variant="outlined" className="bg-white hover:border-brand-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="p-6">
                      <div className={`w-16 h-16 rounded-2xl bg-${cat.color}-100 text-${cat.color}-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">{cat.name}</h3>
                      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{cat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-brand-600">{cat.count} listings</span>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-500 transition-colors" />
                      </div>
                    </div>
                    <div className="border-t border-neutral-100 px-6 py-4 bg-neutral-50/50">
                      <Link href={`/listings?category=${cat.slug}`} className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        Browse all <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Popular Cities */}
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900">Popular Cities</h2>
              <Link href="/listings" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Surat"].map((city) => (
                <Link key={city} href={`/listings?city=${city}`} className="px-4 py-2 bg-white rounded-xl border border-neutral-200 text-neutral-700 hover:border-brand-300 hover:text-brand-600 hover:shadow-md transition-all text-sm font-medium">
                  {city}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 relative overflow-hidden gradient-mesh rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Can't find your category?</h2>
            <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">Post in \"Other\" category or contact us to suggest a new category. We're always expanding based on your needs.</p>
            <Link href="/post" className="btn btn-secondary text-lg px-10 py-4 inline-flex">
              Post Your Ad
              <ChevronRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
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