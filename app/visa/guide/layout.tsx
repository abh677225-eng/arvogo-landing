import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australian Visa Guide — Student, PR, Visitor, Working Holiday & More",
  description: "Plain-English overview of Australian visa types — student (500), permanent residency (189/190/491), visitor (600/eVisitor/ETA), working holiday (417/462), employer sponsored (482) and family visas. Typical steps, documents and costs.",
  keywords: [
    "Australian visa types guide",
    "student visa Australia 500",
    "working holiday visa Australia 417 462",
    "visitor visa Australia 600",
    "employer sponsored visa Australia 482",
    "partner visa Australia 820 801",
    "family visa Australia",
    "Australian skilled migration guide",
    "how to apply for student visa Australia",
    "working holiday visa requirements Australia",
    "Australia visa application process",
  ],
  openGraph: {
    title: "Australian Visa Guide — Plain-English Overview of All Visa Types",
    description: "Step-by-step overview of student, PR, visitor, working holiday, employer sponsored and family visas — documents, costs and typical timelines.",
    url: "https://www.arvogo.com/visa/guide",
  },
  alternates: { canonical: "https://www.arvogo.com/visa/guide" },
};

export default function VisaGuideLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How long does it take to get a student visa for Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Offshore student visa applications are typically processed within a few weeks, though processing times vary and can change. You must have a Confirmation of Enrolment (CoE) from a registered Australian institution before you can apply. Check current processing times at immi.homeaffairs.gov.au.",
        },
      },
      {
        "@type": "Question",
        name: "How do I apply for a working holiday visa for Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Working holiday visas (subclass 417 and 462) are applied for online through ImmiAccount at immi.homeaffairs.gov.au. You need a valid passport from an eligible country, be aged 18–35, and have no dependent children. Most applications are processed within a few days. Check current fees at immi.homeaffairs.gov.au.",
        },
      },
      {
        "@type": "Question",
        name: "What documents do I need for an Australian visa application?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Required documents vary significantly by visa type and individual circumstances. Generally you will need a valid passport, evidence relevant to your visa category, and may need health examinations and police clearances. Check the specific requirements for your visa at immi.homeaffairs.gov.au or consult a MARA-registered migration agent.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a migration agent to apply for an Australian visa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For simple applications like eVisitor, ETA, and working holiday visas, many applicants apply directly without an agent. For complex applications — skilled permanent residency, employer sponsored, family, and student visas — a MARA-registered migration agent can significantly improve outcomes and reduce the risk of errors. Find a registered agent at mara.gov.au.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
