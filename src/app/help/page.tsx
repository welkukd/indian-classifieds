import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Search, ChevronDown, ChevronUp, Mail, Phone, MessageSquare,
  Shield, Zap, Star, MapPin, Clock, CheckCircle, X
} from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import FAQItem from "@/components/FAQItem";

export const metadata: Metadata = {
  title: "Help Center | DesiList",
  description: "Get help with posting ads, managing your account, safety tips, and more. Find answers to common questions about DesiList.",
};

const faqs = [
  {
    category: "Posting Ads",
    questions: [
      {
        q: "How do I post an ad on DesiList?",
        a: "Click 'Post Free Ad' on the homepage or any page. Select your category, fill in the details (title, description, price, location), upload photos, and publish. Your ad goes live instantly — no approval needed, no fees ever.",
      },
      {
        q: "How many photos can I upload?",
        a: "You can upload up to 10 photos per listing. We recommend at least 3-4 clear photos from different angles. The first photo becomes your thumbnail in search results.",
      },
      {
        q: "Can I edit my ad after posting?",
        a: "Yes! Go to your Dashboard → My Ads, click 'Edit' on any active listing. You can update title, description, price, photos, and location. Changes go live immediately.",
      },
      {
        q: "How do I mark my item as sold?",
        a: "In your Dashboard → My Ads, click the status dropdown on the listing and select 'Sold'. This removes it from search but keeps it in your history.",
      },
      {
        q: "What categories can I post in?",
        a: "We have 8 main categories: Electronics, Vehicles, Property, Jobs, Services, Fashion, Home & Garden, and Books & Hobbies — each with multiple subcategories.",
      },
    ],
  },
  {
    category: "Account & Profile",
    questions: [
      {
        q: "Do I need an account to browse?",
        a: "No! You can browse all listings, search, and filter without an account. You only need to sign in to post ads, save listings, message sellers, or access your dashboard.",
      },
      {
        q: "How does phone verification work?",
        a: "Enter your 10-digit Indian mobile number. We'll send a 6-digit OTP via SMS. Enter the code to verify. This helps prevent spam and builds trust.",
      },
      {
        q: "What is the 'Verified' badge?",
        a: "The green verified badge means the user has completed KYC verification (Aadhaar/PAN). Verified sellers are more trustworthy — buyers see this badge on their profile and listings.",
      },
      {
        q: "How do I change my phone number?",
        a: "Go to Dashboard → Profile → Contact Information. Click 'Edit' next to your phone number, enter the new number, and verify via OTP.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Go to Dashboard → Profile → Account Settings → Delete Account. This permanently removes all your data, ads, and messages. This action cannot be undone.",
      },
    ],
  },
  {
    category: "Buying & Selling",
    questions: [
      {
        q: "How do I contact a seller?",
        a: "On any listing page, click 'Chat on WhatsApp' or 'Call Seller'. WhatsApp opens with a pre-filled message. We recommend starting on WhatsApp for faster responses.",
      },
      {
        q: "Is it safe to share my phone number?",
        a: "Your phone number is only shown to interested buyers after they click 'Contact'. We recommend using WhatsApp chat first, then sharing your number when comfortable.",
      },
      {
        q: "What payment methods are safe?",
        a: "For in-person deals: cash is safest. For remote: UPI/bank transfer only after verifying the item. Never use gift cards, wire transfers, or share OTPs. See our Safety page for details.",
      },
      {
        q: "Can I negotiate the price?",
        a: "Yes! Most listings are 'Negotiable'. Use the chat to discuss. For 'Fixed Price' listings, the seller has indicated they won't negotiate.",
      },
      {
        q: "What if the item doesn't match the description?",
        a: "Always inspect before paying. If there's a discrepancy, you can walk away. Report misleading listings using the 'Report' button on the listing page.",
      },
    ],
  },
  {
    category: "Features & Settings",
    questions: [
      {
        q: "What are 'Featured' listings?",
        a: "Featured listings appear at the top of search results and category pages. You can boost any of your ads from the Dashboard for a small fee (optional — posting is always free).",
      },
      {
        q: "How do saved searches work?",
        a: "On the Listings page, apply your filters, then click 'Save Search'. You'll get notifications when new matching items are posted. Manage them in Dashboard → Saved Searches.",
      },
      {
        q: "How do I report a listing or user?",
        a: "On any listing, click the flag icon. On a user's profile, click 'Report User'. Select the reason (scam, spam, inappropriate, etc.) and submit. We review within 24 hours.",
      },
      {
        q: "Can I post the same ad in multiple cities?",
        a: "Each ad is for one location. To reach multiple cities, create separate listings for each city. This keeps results relevant for local buyers.",
      },
      {
        q: "Do my ads expire?",
        a: "Ads stay active for 60 days. You'll get a notification before expiry. You can renew from your Dashboard with one click.",
      },
    ],
  },
];

export default function HelpPage() {
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
                <Link href="/help" className="px-3 py-2 text-sm font-semibold text-brand-600 rounded-lg bg-brand-50">Help</Link>
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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="page-title">How can we help?</h1>
            <p className="page-subtitle">Find answers to common questions about posting, buying, selling, and managing your account.</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                placeholder="Search help articles..."
                className="pl-12 text-lg py-4"
                type="search"
              />
            </div>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card variant="outlined" className="bg-white p-6 text-center hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Chat Support</h3>
              <p className="text-neutral-500 text-sm mb-4">Message us on WhatsApp for quick help</p>
              <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Chat on WhatsApp
              </Button>
            </Card>
            <Card variant="outlined" className="bg-white p-6 text-center hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Email Support</h3>
              <p className="text-neutral-500 text-sm mb-4">Email us for detailed queries</p>
              <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}>
                support@desilist.in
              </Button>
            </Card>
            <Card variant="outlined" className="bg-white p-6 text-center hover:border-brand-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Call Back</h3>
              <p className="text-neutral-500 text-sm mb-4">Request a call from our support team</p>
              <Button variant="outline" leftIcon={<Phone className="w-4 h-4" />}>
                Request Call
              </Button>
            </Card>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section) => (
              <section key={section.category}>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">{section.category}</h2>
                <div className="space-y-3">
                  {section.questions.map((faq, i) => (
                    <FAQItem key={i} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still need help? */}
          <Card variant="filled" className="bg-brand-50 border border-brand-200 mt-12">
            <div className="p-6 md:p-8 text-center">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Still need help?</h2>
              <p className="text-neutral-600 mb-6 max-w-xl mx-auto">Couldn't find what you're looking for? Our support team is here to help.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" leftIcon={<Mail className="w-4 h-4" />}>
                  Email Support
                </Button>
                <Button variant="outline" size="lg" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  WhatsApp Chat
                </Button>
              </div>
            </div>
          </Card>
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