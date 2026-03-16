import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Buying a Home Works in Australia — Step by Step Guide",
  description: "A clear, jargon-free guide to the home buying process in Australia. Understand each stage — from deciding whether to buy, through to settlement — and what actually matters at each step.",
  keywords: [
    "home buying process Australia",
    "how to buy a house Australia step by step",
    "buying a home Australia guide",
    "first home buyer process Australia",
    "steps to buying a house Australia",
    "home buying checklist Australia",
    "how long does it take to buy a house Australia",
  ],
  openGraph: {
    title: "How Buying a Home Works in Australia",
    description: "A clear, jargon-free guide to the home buying process — from deciding whether to buy through to settlement.",
    url: "https://www.arvogo.com/house/path",
  },
  alternates: { canonical: "https://www.arvogo.com/house/path" },
};

export default function HousePathLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does it take to buy a house in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The time from starting to look to settlement typically ranges from 3 to 12 months, depending on how competitive the market is, how quickly you find the right property, and how prepared your finances are. Getting pre-approval before you start looking seriously can significantly speed up the process.",
        },
      },
      {
        "@type": "Question",
        name: "What is the first step in buying a house in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The first step is getting clear on whether buying is right for you at this point in your life — not which suburb or property type. Once you've decided to pursue it, the next practical step is understanding your borrowing capacity by speaking to a mortgage broker or using a serviceability calculator.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a solicitor or conveyancer to buy a house in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — a conveyancer or solicitor is legally required to handle the transfer of property in Australia. They review the contract of sale, conduct title searches, and manage settlement. You should engage one before you exchange contracts.",
        },
      },
      {
        "@type": "Question",
        name: "What is a building and pest inspection in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A building and pest inspection is an independent assessment of a property's structural condition and pest activity conducted before you exchange contracts. It typically costs $400–$800 and can reveal issues that would be your responsibility once you own the property. It is strongly recommended for all property purchases.",
        },
      },
    ],
  };

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
