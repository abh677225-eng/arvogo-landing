import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Arvogo — Australian Visa Guide",
    default: "Australian Visa Guide — Arvogo",
  },
  description: "Free guide to applying for an Australian visa. Student, permanent residency, visitor, working holiday, employer sponsored and family visas — understand your pathway, check your points, and find a migration agent.",
  keywords: [
    "Australian visa guide",
    "how to apply for Australian visa",
    "Australia visa application",
    "Australian permanent residency",
    "student visa Australia",
    "working holiday visa Australia",
    "Australia PR points calculator",
    "skilled migration Australia",
    "Australian visa requirements",
    "MARA migration agent Australia",
    "subclass 189 190 491 Australia",
  ],
  openGraph: {
    title: "Australian Visa Guide — Understand Your Pathway",
    description: "Student, PR, visitor, working holiday, employer sponsored and family visas. Check your points and find a migration agent.",
    url: "https://www.arvogo.com/visa",
  },
  alternates: { canonical: "https://www.arvogo.com/visa" },
};

export default function VisaLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Australian Visa Guide",
    description: "Free guide to Australian visa categories, pathways, documents and points calculator for permanent residency.",
    url: "https://www.arvogo.com/visa",
    isPartOf: { "@type": "WebSite", name: "Arvogo", url: "https://www.arvogo.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      {children}
    </>
  );
}
