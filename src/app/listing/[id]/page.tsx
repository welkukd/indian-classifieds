import { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetail from "./ListingDetail";

const mockListing = {
  id: "1",
  title: "iPhone 15 Pro Max 256GB Natural Titanium",
  price: "₹1,34,900",
  priceType: "negotiable",
  condition: "like_new",
  description: "Barely used iPhone 15 Pro Max in Natural Titanium. Purchased 2 months ago with AppleCare+ valid till 2025. No scratches, no dents, battery health 100%. Comes with original box, unused charging cable, 20W adapter, and a Spigen MagSafe case. Reason for selling: upgrading to the new model. Available for inspection in Bandra West. Serious buyers only please.",
  category: "Electronics",
  subCategory: "Mobiles",
  city: "Mumbai",
  locality: "Bandra West",
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop",
  ],
  postedAt: "2 hours ago",
  views: 247,
  seller: {
    name: "Rahul Sharma",
    phone: "98765 43210",
    whatsapp: "98765 43210",
    memberSince: "Jan 2023",
    rating: 4.8,
    verified: true,
    adsCount: 12,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = mockListing;
  return {
    title: `${listing.title} | DesiList`,
    description: `${listing.price} • ${listing.city} • ${listing.description.slice(0, 160)}...`,
    openGraph: {
      title: listing.title,
      description: `${listing.price} • ${listing.city} • ${listing.category}`,
      images: listing.images[0] ? [{ url: listing.images[0] }] : [],
      type: "website",
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id !== "1") {
    notFound();
  }

  return <ListingDetail listing={mockListing} />;
}