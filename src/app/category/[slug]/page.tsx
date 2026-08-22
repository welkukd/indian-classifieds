import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CategoryPageContent from "./CategoryPageContent";

const categoryData: Record<string, { name: string; icon: string; description: string; subCategories: string[] }> = {
  electronics: {
    name: "Electronics",
    icon: "📱",
    description: "Mobiles, laptops, TVs, cameras, gaming consoles & accessories",
    subCategories: ["Mobiles", "Laptops", "TVs & Audio", "Cameras", "Gaming", "Accessories"],
  },
  vehicles: {
    name: "Vehicles",
    icon: "🚗",
    description: "Cars, bikes, scooters, commercial vehicles & auto parts",
    subCategories: ["Cars", "Bikes & Scooters", "Commercial Vehicles", "Auto Parts", "Other Vehicles"],
  },
  property: {
    name: "Property",
    icon: "🏠",
    description: "Flats, houses, PGs, commercial spaces & land for rent/sale",
    subCategories: ["Flats for Rent", "Flats for Sale", "Houses for Rent", "Houses for Sale", "PG/Hostels", "Commercial", "Land/Plots"],
  },
  jobs: {
    name: "Jobs",
    icon: "💼",
    description: "Full-time, part-time, work-from-home & freelance opportunities",
    subCategories: ["IT & Software", "Sales & Marketing", "Accounting & Finance", "HR & Admin", "Engineering", "Teaching", "Part Time", "Work from Home"],
  },
  services: {
    name: "Services",
    icon: "🔧",
    description: "Repairs, tutoring, events, beauty, packers & movers",
    subCategories: ["Repair & Maintenance", "Tutors & Coaching", "Event Services", "Beauty & Wellness", "Packers & Movers", "Other Services"],
  },
  fashion: {
    name: "Fashion",
    icon: "👗",
    description: "Clothing, footwear, accessories & jewellery for all",
    subCategories: ["Men's Clothing", "Women's Clothing", "Footwear", "Accessories", "Kids Wear", "Jewellery"],
  },
  "home-garden": {
    name: "Home & Garden",
    icon: "🪑",
    description: "Furniture, decor, kitchen, garden & appliances",
    subCategories: ["Furniture", "Home Decor", "Kitchen & Dining", "Garden & Outdoor", "Appliances", "Tools"],
  },
  "books-hobbies": {
    name: "Books & Hobbies",
    icon: "📚",
    description: "Books, musical instruments, art, sports & toys",
    subCategories: ["Books", "Musical Instruments", "Art & Collectibles", "Sports Equipment", "Toys & Games"],
  },
  "sports-fitness": {
    name: "Sports & Fitness",
    icon: "🏋️",
    description: "Gym equipment, cycles, outdoor gear & supplements",
    subCategories: ["Gym Equipment", "Cycles", "Outdoor Gear", "Supplements", "Yoga & Wellness"],
  },
  pets: {
    name: "Pets",
    icon: "🐕",
    description: "Dogs, cats, birds, fish & pet accessories",
    subCategories: ["Dogs", "Cats", "Birds", "Fish & Aquarium", "Pet Accessories", "Pet Services"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryData[slug];
  if (!cat) return { title: "Category Not Found | DesiList" };
  return {
    title: `${cat.name} - Buy & Sell Free Ads | DesiList`,
    description: `Browse free ${cat.name.toLowerCase()} classifieds in India. ${cat.description}. Post your ad free on DesiList.`,
    openGraph: {
      title: `${cat.name} | DesiList`,
      description: cat.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryData[slug];
  
  if (!cat) {
    notFound();
  }

  return <CategoryPageContent category={cat} slug={slug} />;
}