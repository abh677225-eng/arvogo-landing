import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arvogo.com"),
  title: {
    default: "Arvogo — Simplifying Life's Complex Decisions",
    template: "%s | Arvogo",
  },
  description: "Arvogo helps Australians navigate complex life decisions — from buying a home to understanding your financial position. No jargon, no pressure, no sign-up.",
  keywords: [
    "first home buyer Australia",
    "should I buy a house Australia",
    "am I ready to buy a home",
    "home buying guide Australia",
    "borrowing capacity calculator Australia",
    "serviceability calculator",
    "mortgage broker Melbourne",
    "conveyancer Victoria",
    "building inspection Melbourne",
  ],
  authors: [{ name: "Arvogo" }],
  creator: "Arvogo",
  publisher: "Arvogo",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://www.arvogo.com",
    siteName: "Arvogo",
    title: "Arvogo — Simplifying Life's Complex Decisions",
    description: "Understand where you are, what comes next, and what you don't need to worry about yet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arvogo — Simplifying Life's Complex Decisions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arvogo — Simplifying Life's Complex Decisions",
    description: "Understand where you are, what comes next, and what you don't need to worry about yet.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Replace with your actual Google Search Console verification code
  // Get it from: search.google.com/search-console → Add property → HTML tag method
  verification: {
    google: "REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

// Organisation structured data — tells Google what Arvogo is
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arvogo",
  url: "https://www.arvogo.com",
  description: "Arvogo helps Australians navigate complex life decisions — from buying a home to understanding their financial position.",
  foundingLocation: "Melbourne, Australia",
  areaServed: "Australia",
};

// Website structured data — enables sitelinks search box in Google
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Arvogo",
  url: "https://www.arvogo.com",
  description: "Simplifying life's complex decisions, step by step.",
  inLanguage: "en-AU",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
