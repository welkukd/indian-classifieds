import { Metadata } from "next";
import Link from "next/link";
import { 
  Shield, AlertCircle, CheckCircle, User, Phone, Mail, Eye, 
  MapPin, Lock, Flag, MessageSquare, ChevronRight, Star
} from "lucide-react";
import { Button, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Safety Tips | DesiList",
  description: "Stay safe while buying and selling on DesiList. Learn how to avoid scams, meet safely, and protect your privacy.",
};

const safetyTips = [
  {
    icon: Shield,
    title: "Meet in Public Places",
    description: "Always meet in busy, well-lit public areas like malls, cafes, or police stations. Avoid secluded locations or private residences for first meetings.",
    color: "emerald",
  },
  {
    icon: Eye,
    title: "Inspect Before You Pay",
    description: "Thoroughly check the item's condition, functionality, and authenticity before handing over money. Test electronics, verify documents for vehicles/property.",
    color: "blue",
  },
  {
    icon: Lock,
    title: "Use Secure Payment Methods",
    description: "Prefer cash for in-person deals. For online, use UPI or bank transfer only after verification. Never share OTPs, card details, or use gift cards/wire transfers.",
    color: "purple",
  },
  {
    icon: User,
    title: "Verify the Seller",
    description: "Check their profile for verification badge, ratings, and ad history. Verified sellers have completed KYC. Message on DesiList chat before sharing contact info.",
    color: "indigo",
  },
  {
    icon: MessageSquare,
    title: "Keep Communication on DesiList",
    description: "Use WhatsApp or call only after initial screening. Don't share personal details (address, bank info) until you're confident. Screenshot conversations for records.",
    color: "orange",
  },
  {
    icon: AlertCircle,
    title: "Trust Your Instincts",
    description: "If a deal seems too good to be true, it probably is. Watch for: urgent pressure, requests for advance payment, refusal to meet in person, or vague details.",
    color: "red",
  },
];

const commonScams = [
  {
    title: "Advance Payment Scam",
    description: "Seller asks for deposit/advance before showing item, then disappears. Never pay before inspecting.",
    warning: "Never send money before seeing the item in person.",
  },
  {
    title: "Fake Verification",
    description: "Scammer sends fake verification screenshots or asks you to verify via external links. Only trust DesiList's built-in verification badge.",
    warning: "Check for the green verified badge on their profile.",
  },
  {
    title: "QR Code / UPI Scam",
    description: "Buyer sends QR code claiming it's for receiving money, but it actually debits your account. Only scan QR codes to pay, never to receive.",
    warning: "UPI QR codes are for PAYING, not receiving money.",
  },
  {
    title: "Identity Theft",
    description: "Scammer asks for Aadhaar, PAN, bank details for 'verification'. DesiList never asks for these documents.",
    warning: "We never ask for government IDs or banking credentials.",
  },
];

const emergencyContacts = [
  { name: "Police Emergency", number: "112", description: "All India emergency number" },
  { name: "Cyber Crime", number: "1930", description: "National cyber crime helpline" },
  { name: "Women Helpline", number: "1091", description: "24/7 women safety helpline" },
  { name: "Consumer Forum", number: "1800-11-4000", description: "National consumer helpline" },
];

export default function SafetyPage() {
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
                <Link href="/safety" className="px-3 py-2 text-sm font-semibold text-brand-600 rounded-lg bg-brand-50">Safety</Link>
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
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Your Safety is Our Priority
            </div>
            <h1 className="page-title">Safety Guidelines</h1>
            <p className="page-subtitle">DesiList connects millions of Indians. Follow these guidelines to buy and sell with confidence. When in doubt, trust your instincts and report suspicious activity.</p>
          </div>

          {/* Golden Rules */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900">Golden Rules</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Always meet in person for local deals — no exceptions",
                "Inspect the item thoroughly before paying",
                "Use cash or UPI only after verification",
                "Never share OTPs, passwords, or banking details",
                "Check seller's verification badge and ratings",
                "Report suspicious users immediately",
              ].map((rule, i) => (
                <Card key={i} variant="outlined" className="bg-white p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-success-100 text-success-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-neutral-700">{rule}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Detailed Safety Tips */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Detailed Safety Tips</h2>
            <div className="space-y-6">
              {safetyTips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <Card key={i} variant="outlined" className="bg-white hover:border-brand-300 hover:shadow-lg transition-all duration-300">
                    <div className="p-6 md:p-8">
                      <div className="flex gap-6">
                        <div className={`w-14 h-14 rounded-2xl bg-${tip.color}-100 text-${tip.color}-600 flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-neutral-900 mb-2">{tip.title}</h3>
                          <p className="text-neutral-600 leading-relaxed">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Common Scams */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-error-100 text-error-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900">Common Scams to Avoid</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {commonScams.map((scam, i) => (
                <Card key={i} variant="outlined" className="bg-white border-error-200">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-error-100 text-error-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Flag className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900">{scam.title}</h3>
                    </div>
                    <p className="text-neutral-600 mb-4">{scam.description}</p>
                    <div className="p-3 rounded-xl bg-error-50 border border-error-200">
                      <p className="text-sm font-medium text-error-700 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {scam.warning}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* For Buyers / For Sellers */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="outlined" className="bg-white">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900">For Buyers</h2>
                  </div>
                  <ul className="space-y-3 text-neutral-600">
                    {[
                      "Research market price before negotiating",
                      "Ask for additional photos/videos of the item",
                      "Request original bills, warranty cards, service records",
                      "For vehicles: check RC, insurance, pollution certificate",
                      "For property: verify ownership documents, encumbrance certificate",
                      "Test electronics thoroughly — camera, speakers, ports, battery",
                      "Meet during daylight hours in crowded places",
                      "Bring a friend or family member for high-value items",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card variant="outlined" className="bg-white">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900">For Sellers</h2>
                  </div>
                  <ul className="space-y-3 text-neutral-600">
                    {[
                      "Take clear, well-lit photos from multiple angles",
                      "Write honest, detailed descriptions — mention any flaws",
                      "Set realistic prices based on market research",
                      "Respond promptly to inquiries via DesiList chat",
                      "Verify buyer's identity before sharing your address",
                      "Accept cash or instant UPI — avoid cheques/online transfers from strangers",
                      "Remove personal data from devices before selling",
                      "Keep records: buyer's contact, item condition photos, payment proof",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </section>

          {/* Emergency Contacts */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Emergency Contacts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyContacts.map((contact) => (
                <Card key={contact.name} variant="outlined" className="bg-white p-6 text-center">
                  <Phone className="w-8 h-8 text-brand-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-neutral-900 mb-1">{contact.name}</h3>
                  <a href={`tel:${contact.number}`} className="text-2xl font-bold text-brand-600 hover:text-brand-700 transition-colors">{contact.number}</a>
                  <p className="text-xs text-neutral-500 mt-2">{contact.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Report Abuse */}
          <section className="mb-16">
            <Card variant="filled" className="bg-brand-50 border border-brand-200">
              <div className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Found Something Suspicious?</h2>
                <p className="text-neutral-600 mb-6 max-w-xl mx-auto">Report fake listings, scam attempts, or abusive users. Our team reviews every report within 24 hours and takes action.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Mail className="w-4 h-4" />}>
                    Report via Email
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Flag className="w-4 h-4" />}>
                    Report from Listing
                  </Button>
                </div>
              </div>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center">
            <Link href="/post" className="btn btn-primary text-lg px-10 py-4 inline-flex">
              Post Your Free Ad Safely
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