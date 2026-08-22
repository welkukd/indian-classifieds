import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DesiList - India's Free Classifieds | Buy, Sell, Rent, Jobs Locally",
  description: "Post free ads on DesiList - India's fastest growing classifieds. Buy & sell cars, phones, property, find jobs, services. 100% free, WhatsApp connect, verified sellers.",
  keywords: ["classifieds", "free ads", "buy sell India", "OLX alternative", "Quikr alternative", "second hand", "jobs India", "property rental", "used cars", "mobile phones"],
  authors: [{ name: "DesiList" }],
  creator: "DesiList",
  publisher: "DesiList",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://desilist.in",
    title: "DesiList - India's Free Classifieds",
    description: "Post free ads. Buy, sell, rent, hire locally. 100% free forever.",
    siteName: "DesiList",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DesiList - India's Free Classifieds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DesiList - India's Free Classifieds",
    description: "Post free ads. Buy, sell, rent, hire locally. 100% free forever.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <AuthProvider>
        <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}