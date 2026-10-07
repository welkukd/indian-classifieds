"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  MapPin, Clock, Tag, Heart, Share2, MessageSquare, Phone, 
  ChevronLeft, ChevronRight, X, Shield, CheckCircle, Star,
  MapPin as MapPinIcon, Truck, Building, Briefcase, User,
  Camera, Eye, Loader2
} from "lucide-react";
import { Button, Badge, Card, CardContent, Modal, Avatar } from "@/components/ui";
import { formatPrice, formatRelativeTime, cn, getInitials } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  price: number;
  priceType: "fixed" | "negotiable" | "exchange";
  condition: "new" | "like_new" | "used" | "fair";
  category: string;
  subCategory: string;
  city: string;
  locality: string;
  images: string[];
  postedAt: string;
  views: number;
  isFeatured: boolean;
  isSaved: boolean;
  description: string;
  seller: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    verified: boolean;
    rating: number;
    adsCount: number;
    joinedAt: string;
  };
  specs: Record<string, string>;
}

const mockListing: Listing = {
  id: "1",
  title: "iPhone 15 Pro Max 256GB Natural Titanium",
  price: 134900,
  priceType: "negotiable",
  condition: "like_new",
  category: "Electronics",
  subCategory: "Mobiles",
  city: "Mumbai",
  locality: "Bandra West",
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=900&fit=crop",
  ],
  postedAt: "2025-01-15T10:30:00Z",
  views: 247,
  isFeatured: true,
  isSaved: false,
  description: "Barely used iPhone 15 Pro Max in Natural Titanium. Purchased in December 2024, has AppleCare+ until Dec 2025. No scratches, dents, or issues. Comes with original box, all accessories (unused), and a premium clear case. Battery health 100%. Used as a secondary device only. Reason for selling: upgrading to newer model. Serious buyers only please.",
  seller: {
    id: "seller1",
    name: "Rajesh Kumar",
    phone: "9876543210",
    whatsapp: "9876543210",
    verified: true,
    rating: 4.8,
    adsCount: 12,
    joinedAt: "2024-06-15T00:00:00Z",
  },
  specs: {
    "Brand": "Apple",
    "Model": "iPhone 15 Pro Max",
    "Storage": "256GB",
    "Color": "Natural Titanium",
    "Condition": "Like New",
    "Warranty": "AppleCare+ until Dec 2025",
    "Box & Accessories": "Yes, all original",
  },
};

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  like_new: "Like New",
  used: "Good",
  fair: "Fair",
};

const conditionColors: Record<string, string> = {
  new: "bg-emerald-100 text-emerald-700",
  like_new: "bg-blue-100 text-blue-700",
  used: "bg-amber-100 text-amber-700",
  fair: "bg-orange-100 text-orange-700",
};

const priceTypeLabels: Record<string, string> = {
  fixed: "Fixed Price",
  negotiable: "Negotiable",
  exchange: "Open to Exchange",
};

function ImageGallery({ images, currentIndex, onIndexChange, onClose }: { 
  images: string[]; 
  currentIndex: number; 
  onIndexChange: (i: number) => void; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6" />
      </button>
      <button
        onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
        className="absolute left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:flex"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={() => onIndexChange((currentIndex + 1) % images.length)}
        className="absolute right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:flex"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1} of ${images.length}`}
        className="max-h-[80vh] max-w-[90vw] object-contain"
      />
      
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [listing] = useState<Listing>(mockListing);
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(listing.isSaved);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "call" | "chat">("whatsapp");

  // In real app, fetch listing by params.id
  useEffect(() => {
    // Fetch listing from API
  }, [params.id]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your "${listing.title}" listed for ${formatPrice(listing.price)}. Is it still available?`);
    window.open(`https://wa.me/91${listing.seller.whatsapp}?text=${message}`, "_blank");
    setShowContactModal(false);
  };

  const handleCallClick = () => {
    window.open(`tel:+91${listing.seller.phone}`);
    setShowContactModal(false);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // API call to save/unsave
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this listing on DesiList: ${formatPrice(listing.price)}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast
    }
  };

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
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/listings" className="hover:text-brand-600">Listings</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/category/${listing.category.toLowerCase()}`} className="hover:text-brand-600">{listing.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 truncate max-w-xs">{listing.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                  <img
                    src={listing.images[currentImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((currentImage - 1 + listing.images.length) % listing.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((currentImage + 1) % listing.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowGallery(true)}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                    aria-label="View fullscreen"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  {listing.isFeatured && (
                    <Badge variant="warning" className="absolute top-4 left-4">Featured</Badge>
                  )}
                </div>
                
                {/* Thumbnails */}
                {listing.images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {listing.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={cn(
                          "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                          i === currentImage ? "border-brand-500" : "border-transparent hover:border-neutral-300"
                        )}
                        aria-label={`View image ${i + 1}`}
                        aria-current={i === currentImage ? "true" : "false"}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Gallery Modal */}
              {showGallery && (
                <ImageGallery
                  images={listing.images}
                  currentIndex={currentImage}
                  onIndexChange={setCurrentImage}
                  onClose={() => setShowGallery(false)}
                />
              )}

              {/* Title & Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand" size="sm">{listing.category}</Badge>
                  <Badge variant="outline" className={conditionColors[listing.condition]}>
                    {conditionLabels[listing.condition]}
                  </Badge>
                  <Badge 
                    variant={listing.priceType === "negotiable" ? "success" : listing.priceType === "exchange" ? "info" : "outline"} 
                    size="sm"
                  >
                    {priceTypeLabels[listing.priceType]}
                  </Badge>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">{listing.title}</h1>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-brand-600">{formatPrice(listing.price)}</span>
                  {listing.priceType !== "fixed" && (
                    <span className="text-neutral-500">({priceTypeLabels[listing.priceType]})</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 border-t border-neutral-200 pt-4">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {listing.locality}, {listing.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatRelativeTime(listing.postedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {listing.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {listing.subCategory}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-6">
                <Button
                  size="lg"
                  className="flex-1 sm:flex-none"
                  leftIcon={<MessageSquare className="w-5 h-5" />}
                  onClick={() => { setContactMethod("whatsapp"); setShowContactModal(true); }}
                >
                  Chat on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                  leftIcon={<Phone className="w-5 h-5" />}
                  onClick={() => { setContactMethod("call"); setShowContactModal(true); }}
                >
                  Call Seller
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<Heart className={cn("w-5 h-5", isSaved ? "fill-current text-error-500" : "")} />}
                  onClick={handleSave}
                  aria-label={isSaved ? "Remove from saved" : "Save listing"}
                />
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<Share2 className="w-5 h-5" />}
                  onClick={handleShare}
                  aria-label="Share listing"
                />
              </div>

              {/* Description */}
              <Card variant="outlined" className="bg-white">
                <CardContent className="pt-0">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-4">Description</h2>
                  <p className="text-neutral-600 whitespace-pre-line leading-relaxed">{listing.description}</p>
                </CardContent>
              </Card>

              {/* Specifications */}
              {Object.keys(listing.specs).length > 0 && (
                <Card variant="outlined" className="bg-white">
                  <CardContent className="pt-0">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Specifications</h2>
                    <dl className="grid grid-cols-2 gap-4">
                      {Object.entries(listing.specs).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <dt className="text-sm text-neutral-500">{key}</dt>
                          <dd className="font-medium text-neutral-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
              </Card>
              )}

              {/* Safety Tips */}
              <Card variant="filled" className="border border-brand-200">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Stay Safe on DesiList</h3>
                      <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" /> Meet in a public place during daylight hours</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" /> Inspect the item thoroughly before paying</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" /> Use DesiList chat for initial communication</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" /> Never send money before seeing the item</li>
                      </ul>
                      <Link href="/safety" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">Read full safety guide →</Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Seller Info */}
            <div className="lg:col-span-1">
              <Card variant="outlined" className="sticky top-24 space-y-6">
                <CardContent className="pt-0">
                  {/* Seller Card */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        name={listing.seller.name} 
                        size="xl" 
                        className="ring-2 ring-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-900 truncate">{listing.seller.name}</h3>
                          {listing.seller.verified && (
                            <Badge variant="success" size="xs">
                              <CheckCircle className="w-3 h-3 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                            {listing.seller.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            {listing.seller.adsCount} ads
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-neutral-50">
                        <p className="text-2xl font-bold text-neutral-900">{listing.seller.adsCount}</p>
                        <p className="text-xs text-neutral-500">Active Ads</p>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-50">
                        <p className="text-2xl font-bold text-neutral-900">{listing.seller.rating}</p>
                        <p className="text-xs text-neutral-500">Rating</p>
                      </div>
                    </div>

                    <p className="text-sm text-neutral-500">
                      Member since {new Date(listing.seller.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-4 space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      leftIcon={<MessageSquare className="w-5 h-5" />}
                      onClick={() => { setContactMethod("whatsapp"); setShowContactModal(true); }}
                    >
                      Chat on WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      leftIcon={<Phone className="w-5 h-5" />}
                      onClick={() => { setContactMethod("call"); setShowContactModal(true); }}
                    >
                      Call Seller
                    </Button>
                  </div>

                  {/* Ad Details */}
                  <div className="border-t border-neutral-200 pt-4 space-y-3">
                    <h4 className="font-medium text-neutral-900">Ad Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Ad ID</dt>
                        <dd className="font-mono text-neutral-900">#{listing.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Posted</dt>
                        <dd className="text-neutral-900">{formatRelativeTime(listing.postedAt)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Views</dt>
                        <dd className="text-neutral-900">{listing.views.toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-neutral-500">Condition</dt>
                        <dd className="text-neutral-900">{conditionLabels[listing.condition]}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Similar Listings */}
                  <div className="border-t border-neutral-200 pt-4">
                    <h4 className="font-medium text-neutral-900 mb-3">Similar Listings</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Link key={i} href={`/listing/${i + 10}`} className="flex gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors group">
                          <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-neutral-100 overflow-hidden">
                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                              {listing.category} Item {i}
                            </p>
                            <p className="text-sm font-bold text-brand-600">₹{(listing.price / (i + 1)).toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Seller"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">How would you like to contact <strong className="text-neutral-900">{listing.seller.name}</strong>?</p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => { setContactMethod("whatsapp"); handleWhatsAppClick(); }}
            >
              <MessageSquare className="w-6 h-6 text-green-500" />
              <span className="font-medium">WhatsApp</span>
              <span className="text-xs text-neutral-500">Recommended</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center gap-2"
              onClick={() => { setContactMethod("call"); handleCallClick(); }}
            >
              <Phone className="w-6 h-6 text-brand-500" />
              <span className="font-medium">Call</span>
              <span className="text-xs text-neutral-500">Direct</span>
            </Button>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 text-sm text-neutral-600">
            <p className="font-medium text-neutral-900 mb-1">Safety First</p>
            <p>Keep conversations on DesiList. Never share OTPs, bank details, or make advance payments without inspecting the item.</p>
          </div>
        </div>
      </Modal>

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