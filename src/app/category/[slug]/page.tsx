import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CategoryPageContent from "./CategoryPageContent";

const categoryData: Record<string, { name: string; icon: string; description: string; subCategories: string[] }> = {
  electronics: {
    name: "Electronics",
    icon: "📱",
    description: "Mobiles, laptops, cameras, audio, gaming & accessories",
    subCategories: ["Mobiles", "Laptops", "Tablets", "Cameras", "Audio", "Gaming", "Wearables", "Accessories"],
  },
  vehicles: {
    name: "Vehicles",
    icon: "🚗",
    description: "Cars, bikes, scooters, commercial vehicles & parts",
    subCategories: ["Cars", "Bikes & Scooters", "Commercial Vehicles", "Auto Parts", "Cycles"],
  },
  property: {
    name: "Property",
    icon: "🏠",
    description: "Flats, houses, PGs, plots, commercial & office space",
    subCategories: ["Flats for Rent", "Houses for Rent", "PG & Co-living", "Flats for Sale", "Houses for Sale", "Plots & Land", "Commercial Property", "Office Space"],
  },
  jobs: {
    name: "Jobs",
    icon: "💼",
    description: "IT, sales, finance, engineering, teaching & more",
    subCategories: ["IT & Software", "Sales & Marketing", "Accounting & Finance", "HR & Admin", "Engineering", "Teaching", "Customer Service", "Drivers & Logistics"],
  },
  services: {
    name: "Services",
    icon: "🔧",
    description: "Home repair, tutors, beauty, events, packers & movers",
    subCategories: ["Home Repair", "Tutors & Classes", "Beauty & Wellness", "Event Services", "Business Services", "Packers & Movers", "Appliance Repair", "Cleaning Services"],
  },
  fashion: {
    name: "Fashion",
    icon: "👕",
    description: "Clothing, footwear, accessories, jewellery & watches",
    subCategories: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Footwear", "Accessories", "Jewellery", "Bags & Wallets", "Watches"],
  },
  "home-garden": {
    name: "Home & Garden",
    icon: "🛋️",
    description: "Furniture, decor, kitchen, appliances & outdoor",
    subCategories: ["Furniture", "Home Decor", "Kitchen & Dining", "Bedding & Bath", "Lighting", "Garden & Outdoor", "Appliances", "Storage"],
  },
  "books-hobbies": {
    name: "Books & Hobbies",
    icon: "📚",
    description: "Books, instruments, art, collectibles, toys & sports",
    subCategories: ["Books", "Musical Instruments", "Art & Craft", "Collectibles", "Toys & Games", "Sports Equipment", "Fitness Equipment", "Pet Supplies"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryData[slug];
  
  if (!category) {
    return {
      title: "Category Not Found | DesiList",
    };
  }

  return {
    title: `${category.name} | Browse Free Classifieds | DesiList`,
    description: `Browse ${category.name.toLowerCase()} listings on DesiList. ${category.description}. Post free ads, connect directly via WhatsApp.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryData[slug];

  if (!category) {
    notFound();
  }

  return <CategoryPageContent category={category} slug={slug} subCategories={category.subCategories} />;
}