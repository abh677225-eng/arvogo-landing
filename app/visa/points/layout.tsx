import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australia PR Points Calculator — Skilled Migration 189 190 491",
  description: "Calculate your Australian permanent residency points across the 189, 190 and 491 skilled visa pathways. Interactive tool covering all scoring categories — age, English, employment, education and more.",
  keywords: [
    "Australia PR points calculator",
    "skilled migration points calculator Australia",
    "189 190 491 points test Australia",
    "Australia permanent residency points",
    "skilled independent visa 189 points",
    "state nominated visa 190 points",
    "regional visa 491 points",
    "Australia immigration points calculator",
    "SkillSelect points test",
    "how many points for Australian PR",
    "Australia skilled migration 2025",
  ],
  openGraph: {
    title: "Australia PR Points Calculator — 189, 190 & 491 Visa Pathways",
    description: "Interactive points calculator for Australian skilled migration. See your score across all three pathways — updates live.",
    url: "https://www.arvogo.com/visa/points",
  },
  alternates: { canonical: "https://www.arvogo.com/visa/points" },
};

export default function VisaPointsLayout({ children }: { children: React.ReactNode }) {
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Australia PR Points Calculator",
    description: "Calculate your Australian permanent residency points score across the 189, 190 and 491 skilled visa pathways. Covers all scoring categories including age, English language, employment, education, and more.",
    url: "https://www.arvogo.com/visa/points",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    provider: { "@type": "Organization", name: "Arvogo", url: "https://www.arvogo.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many points do I need for Australian PR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You need a minimum of 65 points to submit an Expression of Interest (EOI) in SkillSelect. However, the minimum is rarely sufficient to receive an invitation. For the 189 (skilled independent) visa, most invitations currently go to applicants with 85 points or more. The 190 (state nominated) adds 5 points and the 491 (regional) adds 15 points to your base score.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between the 189, 190 and 491 visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 189 is a permanent skilled independent visa requiring no sponsor. The 190 is a permanent state-nominated visa that adds 5 points but requires a commitment to live and work in the nominating state. The 491 is a provisional regional visa that adds 15 points and requires living and working in a regional area for 5 years before becoming eligible for the permanent 191 visa.",
        },
      },
      {
        "@type": "Question",
        name: "How are points calculated for Australian skilled migration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Points are awarded across categories including age (up to 30 points), English language ability (up to 20 points), skilled employment in Australia and overseas (up to 20 points combined), educational qualifications (up to 20 points), Australian study, partner skills, Professional Year, NAATI accreditation, and state nomination. The maximum possible score is around 130 points.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
