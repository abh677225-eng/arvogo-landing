import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arvogo.com"),
  title: {
    default: "Arvogo — Simplifying Life's Complex Decisions",
    template: "%s | Arvogo",
  },
  description: "Arvogo helps people in Australia navigate complex life decisions — buying a home, starting a business, or applying for a visa. Understand where you are, what comes next, and who can help. No jargon, no pressure, no sign-up.",
  keywords: [
    "life decisions Australia",
    "buying a home Australia guide",
    "first home buyer Australia",
    "home buying process Australia",
    "borrowing capacity calculator Australia",
    "serviceability calculator",
    "starting a business Australia",
    "how to register a business Australia",
    "ABN registration Australia",
    "sole trader vs company Australia",
    "Australian visa guide",
    "Australia PR points calculator",
    "student visa Australia",
    "working holiday visa Australia",
    "mortgage broker Australia",
    "conveyancer Australia",
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
    description: "Buying a home, starting a business, or applying for a visa — understand your situation clearly, without jargon or pressure.",
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
    description: "Buying a home, starting a business, or applying for a visa — understand where you are, what comes next, and who can help. No jargon, no pressure.",
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
  verification: {
    google: "oIJ-9BjH8Z0-rLHSaAIzmGL3ujKZP8id2O-HoO7oaDg",
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arvogo",
  url: "https://www.arvogo.com",
  description: "Arvogo helps people in Australia navigate complex life decisions — buying a home, starting a business, or applying for a visa.",
  foundingLocation: "Melbourne, Australia",
  areaServed: "Australia",
};

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
