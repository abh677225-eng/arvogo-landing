import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Start a Business in Australia — Complete Guide",
  description: "A plain-English guide to starting a business in Australia. Covers choosing your structure, registering an ABN, GST, business name, insurance, and more. Step by step, no jargon.",
  keywords: [
    "how to start a business in Australia step by step",
    "starting a business in Australia guide",
    "how to register a business Australia",
    "ABN registration process Australia",
    "sole trader setup Australia",
    "company registration Australia",
    "how to get an ABN Australia",
    "GST registration small business Australia",
    "business name registration Australia ASIC",
    "what do I need to start a business in Australia",
  ],
  openGraph: {
    title: "How to Start a Business in Australia — Step by Step Guide",
    description: "Free plain-English guide to starting a business — structure, ABN, GST, insurance, and contracts. No jargon.",
    url: "https://www.arvogo.com/business/guide",
  },
  alternates: { canonical: "https://www.arvogo.com/business/guide" },
};

export default function BusinessGuideLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need an ABN to start a business in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — you need an Australian Business Number (ABN) before you can legally invoice clients. Without one, clients may withhold 47% of payments. Registering is free and takes about 15 minutes at abr.gov.au.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a sole trader and a company in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A sole trader is the simplest structure — free to set up, taxed at your personal income rate, but you're personally liable for business debts. A company (Pty Ltd) is a separate legal entity with limited liability, taxed at 25%, but requires more setup and ongoing compliance. Most small service businesses start as sole traders and convert later.",
        },
      },
      {
        "@type": "Question",
        name: "When do I need to register for GST in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GST registration is mandatory when your annual business revenue reaches or is expected to reach $75,000. Below this threshold, registration is optional. Once registered, you charge 10% GST on invoices and lodge a Business Activity Statement (BAS) quarterly.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to register a company in Australia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Registering a company (Pty Ltd) with ASIC costs approximately $576 in government fees. This gives you an ACN (Australian Company Number) and establishes the company as a separate legal entity. You may also need to pay for an accountant or lawyer to advise on the setup.",
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
