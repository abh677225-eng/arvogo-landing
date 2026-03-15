import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Mortgage Broker, Buyers Agent or Conveyancer in Melbourne",
  description: "Connect with Melbourne mortgage brokers, buyers agents, conveyancers, and building & pest inspectors. Understand what each professional does, when you need them, and what they cost.",
  keywords: [
    "mortgage broker Melbourne",
    "buyers agent Melbourne",
    "conveyancer Melbourne",
    "building and pest inspection Melbourne",
    "first home buyer mortgage broker Victoria",
    "do I need a buyers agent Australia",
    "what does a conveyancer do Australia",
    "building inspection cost Melbourne",
    "how much does a conveyancer cost Australia",
  ],
  openGraph: {
    title: "The Professionals You Need When Buying a Home in Melbourne",
    description: "Understand what each professional does, when you need them, and what they cost — then request an introduction in one step.",
    url: "https://www.arvogo.com/house/nextstep",
  },
  alternates: { canonical: "https://www.arvogo.com/house/nextstep" },
};

// FAQ structured data for the nextstep page
// This can generate rich FAQ results in Google search
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need a buyers agent when buying a home in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A buyers agent is optional — many buyers find homes perfectly well on their own. However, they can be particularly valuable at auction or if you're time-poor or unfamiliar with the area. They typically charge $8,000–$20,000 or 1–2.5% of the purchase price.",
      },
    },
    {
      "@type": "Question",
      name: "What does a conveyancer do in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A conveyancer handles the legal transfer of property — reviewing contracts, conducting title checks, and managing settlement. You need one before you exchange contracts. They typically cost $800–$2,000.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a building and pest inspection before buying a house?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A building and pest inspection is strongly recommended before exchanging contracts. It checks for structural issues, defects, and pest activity. Problems found after you've exchanged contracts become your responsibility. Inspections typically cost $400–$800.",
      },
    },
    {
      "@type": "Question",
      name: "Is a mortgage broker free to use in Australia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — mortgage brokers are free to use for home buyers. They are paid a commission by the lender, not by you. They can access loans from dozens of lenders and handle the application on your behalf.",
      },
    },
  ],
};

export default function NextStepLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
