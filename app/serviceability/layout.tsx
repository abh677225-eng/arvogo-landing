import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrowing Capacity Calculator Australia 2026",
  description: "Find out how much you can borrow in Australia using real bank methodology. Includes APRA serviceability buffer, HEM benchmark, LMI indicator, and First Home Owner Grant eligibility check for all states.",
  keywords: [
    "borrowing capacity calculator Australia",
    "how much can I borrow Australia",
    "serviceability calculator Australia",
    "mortgage calculator Australia 2026",
    "home loan calculator Australia",
    "FHOG eligibility calculator Victoria",
    "LMI calculator Australia",
    "first home buyer borrowing capacity",
    "how much deposit do I need Australia",
  ],
  openGraph: {
    title: "How Much Can You Borrow in Australia? Free Calculator",
    description: "Calculate your borrowing capacity using the same methodology Australian banks use — including the APRA 3% buffer, HEM living expenses benchmark, and LMI threshold.",
    url: "https://www.arvogo.com/serviceability",
  },
  alternates: { canonical: "https://www.arvogo.com/serviceability" },
};

// Calculator structured data — can appear as a rich result in Google
const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Australian Borrowing Capacity Calculator",
  url: "https://www.arvogo.com/serviceability",
  description: "Calculate your home loan borrowing capacity using Australian bank methodology including APRA serviceability buffer and HEM benchmarks.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "AUD",
  },
  areaServed: {
    "@type": "Country",
    name: "Australia",
  },
};

export default function ServiceabilityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      {children}
    </>
  );
}
