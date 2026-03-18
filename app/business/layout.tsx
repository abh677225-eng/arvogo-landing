import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Arvogo — Starting a Business in Australia",
    default: "Starting a Business in Australia — Arvogo",
  },
  description: "Free guide to starting a business in Australia. Understand sole trader vs company, register your ABN, get GST sorted, and find the right accountant — step by step, no jargon.",
  keywords: [
    "how to start a business in Australia",
    "register ABN Australia",
    "sole trader vs company Australia",
    "how to register a business in Australia",
    "starting a small business Australia",
    "ABN registration Australia",
    "GST registration Australia",
    "business structure Australia",
    "sole trader Australia",
    "Pty Ltd company Australia",
    "how to set up a business in Australia",
  ],
  openGraph: {
    title: "Starting a Business in Australia — Step by Step",
    description: "Understand your structure, what to register, and who can help. Free guide for Australians starting a business.",
    url: "https://www.arvogo.com/business",
  },
  alternates: { canonical: "https://www.arvogo.com/business" },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Starting a Business in Australia",
    description: "Free step-by-step guide to starting a business in Australia — ABN, GST, business structure, and professional connections.",
    url: "https://www.arvogo.com/business",
    isPartOf: { "@type": "WebSite", name: "Arvogo", url: "https://www.arvogo.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      {children}
    </>
  );
}
