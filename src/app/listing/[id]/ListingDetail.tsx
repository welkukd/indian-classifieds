"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, MessageSquare, Clock, Calendar, Star, CheckCircle, Shield, User, Eye, Tag, ArrowLeft, Share2, Heart, Flag, ChevronDown, ChevronUp } from "lucide-react";

interface ListingDetailProps {
  listing: {
    id: string;
    title: string;
    price: string;
    priceType: string;
    condition: string;
    description: string;
    category: string;
    subCategory: string;
    city: string;
    locality: string;
    images: string[];
    postedAt: string;
    views: number;
    seller: {
      name: string;
      phone: string;
      whatsapp: string;
      memberSince: string;
      rating: number;
      verified: boolean;
      adsCount: number;
    };
  };
}

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  like_new: "Like New",
  used: "Good",
  fair: "Fair",
};

const priceTypeLabels: Record<string, string> = {
  fixed: "Fixed Price",
  negotiable: "Negotiable",
  exchange: "Exchange",
};

export default function ListingDetail({ listing }: ListingDetailProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showSellerInfo, setShowSellerInfo] = useState(false);

  const formatPhone = (phone: string) => phone.replace(/(\d{5})(\d{5})/, "$1 $2");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back & Share Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back to DesiList</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${listing.category.toLowerCase()}`} className="hover:text-amber-600 transition-colors">{listing.category}</Link>
          <span>/</span>
          <Link href={`/category/${listing.category.toLowerCase()}/${listing.subCategory.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-amber-600 transition-colors">{listing.subCategory}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[200px]">{listing.title}</span>
        </nav>

        {/* Image Gallery */}
        <div className="mb-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={listing.images[currentImage]}
              alt={`${listing.title} - Image ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((currentImage - 1 + listing.images.length) % listing.images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronDown className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={() => setCurrentImage((currentImage + 1) % listing.images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImage ? "bg-white w-6" : "bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    idx === currentImage ? "border-amber-500" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Meta */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">{listing.category}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">{listing.subCategory}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  listing.priceType === "negotiable" ? "bg-green-100 text-green-700" :
                  listing.priceType === "exchange" ? "bg-purple-100 text-purple-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {priceTypeLabels[listing.priceType] || listing.priceType}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{listing.title}</h1>
            </div>
            <button className="flex-shrink-0 p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
            <span className="flex items-center gap-1 font-semibold text-2xl text-amber-600">{listing.price}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-full">{conditionLabels[listing.condition] || listing.condition}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {listing.locality}, {listing.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {listing.postedAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {listing.views.toLocaleString()} views
            </span>
          </div>
        </div>

        {/* Description */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <div className="prose prose-gray max-w-none">
            <p className={showDescription ? "" : "line-clamp-6"} style={{ whiteSpace: "pre-line" }}>
              {listing.description}
            </p>
          </div>
          {listing.description.split("\n").length > 6 || listing.description.length > 300 ? (
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="mt-4 flex items-center gap-2 text-amber-600 font-medium hover:underline"
            >
              {showDescription ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          ) : null}
        </section>

        {/* Details Grid */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Category</dt>
              <dd className="font-medium text-gray-900 mt-1">{listing.category}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Sub-Category</dt>
              <dd className="font-medium text-gray-900 mt-1">{listing.subCategory}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Condition</dt>
              <dd className="font-medium text-gray-900 mt-1">{conditionLabels[listing.condition] || listing.condition}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Price Type</dt>
              <dd className="font-medium text-gray-900 mt-1">{priceTypeLabels[listing.priceType] || listing.priceType}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm text-gray-500">Location</dt>
              <dd className="font-medium text-gray-900 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {listing.locality}, {listing.city}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Posted</dt>
              <dd className="font-medium text-gray-900 mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {listing.postedAt}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Views</dt>
              <dd className="font-medium text-gray-900 mt-1 flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {listing.views.toLocaleString()}
              </dd>
            </div>
          </dl>
        </section>

        {/* Seller Info */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Posted by {listing.seller.name}</h2>
            <button
              onClick={() => setShowSellerInfo(!showSellerInfo)}
              className="flex items-center gap-1 text-sm text-amber-600 font-medium hover:underline"
            >
              {showSellerInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className={showSellerInfo ? "" : "max-h-24 overflow-hidden"}>
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold">
                {listing.seller.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{listing.seller.name}</span>
                  {listing.seller.verified && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Member since {listing.seller.memberSince}</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-amber-500" />
                    {listing.seller.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {listing.seller.adsCount} ads
                  </span>
                </div>
              </div>
            </div>

            {showSellerInfo && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <a
                  href={`tel:${listing.seller.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Seller</p>
                    <p className="font-medium text-gray-900">{formatPhone(listing.seller.phone)}</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/91${listing.seller.whatsapp.replace(/\s/g, "")}?text=Hi%2C%20I%27m%20interested%20in%20your%20${encodeURIComponent(listing.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chat on WhatsApp</p>
                    <p className="font-medium text-gray-900">{formatPhone(listing.seller.whatsapp)}</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Safety Notice */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800">Stay Safe on DesiList</h3>
              <ul className="text-sm text-amber-700 mt-2 space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Meet in public places during daytime</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Inspect item thoroughly before paying</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Never share OTP, UPI PIN, or bank details</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Avoid advance payments to unknown sellers</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Report suspicious listings using the flag button</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Actions - Sticky Bottom on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
          <div className="max-w-4xl mx-auto flex gap-3">
            <a
              href={`tel:${listing.seller.phone.replace(/\s/g, "")}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call
            </a>
            <a
              href={`https://wa.me/91${listing.seller.whatsapp.replace(/\s/g, "")}?text=Hi%2C%20I%27m%20interested%20in%20your%20${encodeURIComponent(listing.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
        <div className="hidden md:block pb-20" />
      </main>
    </div>
  );
}