import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "DesiList - India's Free Classifieds | Buy, Sell, Rent, Jobs Locally",
    template: "%s | DesiList",
  },
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
    siteName: "DesiList",
    title: "DesiList - India's Free Classifieds",
    description: "Post free ads. Buy, sell, rent, hire locally. 100% free forever.",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#f59e0b" media="(prefers-color-scheme: light)" />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}