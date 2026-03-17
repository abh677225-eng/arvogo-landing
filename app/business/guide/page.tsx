"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 15% 25%, rgba(16,185,129,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 75%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 15%, rgba(245,158,11,0.12) 0%, transparent 50%),
  radial-gradient(ellipse at 15% 85%, rgba(14,165,233,0.12) 0%, transparent 50%),
  #f0fdf4
`;

type Step = {
  number: number;
  emoji: string;
  title: string;
  summary: string;
  detail: string;
  timeframe: string;
  cost: string | null;
  cta: { label: string; href: string } | null;
};

const STEPS: Step[] = [
  {
    number: 1,
    emoji: "💡",
    title: "Validate your idea before you spend anything",
    summary: "Most businesses fail because they build before they know if anyone will pay.",
    detail: "Before you register an ABN or spend money on a website, talk to 10 potential customers — not friends or family, but actual people who would pay for what you're offering.\n\nAsk them: what problem does this solve for you? How do you currently solve it? What would you pay? Their answers will tell you more than any amount of research.\n\nIf you can't find 10 people to talk to, that's your signal. If they tell you it's a great idea but won't commit to paying, that's also your signal. Look for people who say \"I need this right now.\"",
    timeframe: "1–4 weeks",
    cost: null,
    cta: null,
  },
  {
    number: 2,
    emoji: "🏗️",
    title: "Choose your business structure",
    summary: "Sole trader or company — this decision affects your tax, liability, and admin burden.",
    detail: "The two most common structures in Australia are:\n\nSole trader — simplest and cheapest to set up. Your business and personal finances are legally the same, so you're personally liable for any debts. All profit is taxed at your personal income tax rate. Best for service businesses starting out.\n\nPty Ltd company — a separate legal entity. You're not personally liable for business debts. Tax is charged at a flat 25% rate (base rate entity). More setup cost and admin, but better protection and tax efficiency at higher income levels.\n\nMost small service businesses start as sole traders and convert later. An accountant can confirm the right choice for your situation — one conversation is worth it before you commit.",
    timeframe: "1 week",
    cost: "Free (sole trader) or $576 ASIC fee (company)",
    cta: { label: "Talk to an accountant", href: "/business/nextstep" },
  },
  {
    number: 3,
    emoji: "📋",
    title: "Register your ABN",
    summary: "Every business needs an ABN before it can invoice clients legally.",
    detail: "An ABN (Australian Business Number) is a unique 11-digit number that identifies your business. You need it to:\n\n• Invoice clients — clients can withhold 47% of payments if you don't have one\n• Register for GST\n• Register a business name\n• Claim business-related tax deductions\n\nRegistering is free and takes about 15 minutes online at abr.gov.au. You'll need your TFN (Tax File Number) and some basic details about your business.\n\nYou can apply as a sole trader using your personal TFN, or as a company after you've registered with ASIC.",
    timeframe: "15 minutes online",
    cost: "Free",
    cta: { label: "Register at abr.gov.au ↗", href: "https://www.abr.gov.au" },
  },
  {
    number: 4,
    emoji: "🏦",
    title: "Open a dedicated business bank account",
    summary: "Mixing personal and business money creates tax headaches and legal problems.",
    detail: "Opening a business bank account is one of the most important early steps. It:\n\n• Makes your BAS and tax return dramatically simpler\n• Protects you legally by keeping business and personal finances separate\n• Looks more professional to clients\n• Makes it easier for an accountant to do your books\n\nMost major banks offer business accounts — some with no monthly fees for the first 12 months. Have your ABN ready when you apply.\n\nDo this early. Trying to separate years of mixed transactions later is painful and expensive.",
    timeframe: "1–3 days",
    cost: "Free to open — monthly fees vary",
    cta: { label: "Find a business banker", href: "/business/nextstep" },
  },
  {
    number: 5,
    emoji: "💰",
    title: "Register for GST if you need to",
    summary: "Mandatory over $75k revenue — optional below that threshold.",
    detail: "GST (Goods and Services Tax) is a 10% tax on most goods and services. You must register if:\n\n• Your annual revenue is (or is expected to be) over $75,000\n• You provide taxi or ride-sharing services (any revenue level)\n• You want to claim GST credits on business purchases\n\nOnce registered, you charge 10% GST on your invoices, collect it from clients, and pay it to the ATO via a quarterly BAS (Business Activity Statement). You can also claim back GST you've paid on business expenses.\n\nBelow $75k you can register voluntarily — useful if your clients are GST-registered businesses and you want to claim credits.\n\nRegister through your myGov account or the ATO business portal.",
    timeframe: "1–2 days",
    cost: "Free",
    cta: { label: "Register via ato.gov.au ↗", href: "https://www.ato.gov.au" },
  },
  {
    number: 6,
    emoji: "🛡️",
    title: "Get business insurance",
    summary: "One incident without insurance can end a business. Don't skip this.",
    detail: "The two most important types of insurance for most small businesses are:\n\nPublic liability — covers you if a client, customer, or third party is injured or their property is damaged as a result of your business activities. Most client contracts require it. Typical cost: $400–$800/year.\n\nProfessional indemnity — covers you if a client claims your advice, service, or work caused them financial loss. Essential for consultants, advisors, designers, and other service providers. Typical cost: $500–$1,500/year.\n\nOther types to consider depending on your situation: business interruption, product liability, workers' compensation (mandatory if you have employees).\n\nA business insurance broker can find the right cover for your specific industry and business type.",
    timeframe: "1–2 weeks",
    cost: "From ~$500/year depending on business type",
    cta: { label: "Find an insurance broker", href: "/business/nextstep" },
  },
  {
    number: 7,
    emoji: "📝",
    title: "Sort your contracts and terms",
    summary: "Verbal agreements are unenforceable. A simple contract protects both parties.",
    detail: "You don't need a complex legal document for every client — but you do need something in writing before you start work. At minimum:\n\n• Scope of work — what you're delivering and what's out of scope\n• Payment terms — amount, due date, what happens if they don't pay\n• Intellectual property — who owns what you create\n• Confidentiality — especially important in consulting or advisory work\n\nFor ongoing clients, a simple service agreement or master services agreement (MSA) covers all engagements.\n\nYou can find contract templates online, but having a business lawyer review or draft your standard contract once is worth the cost — it protects you for every engagement that follows.",
    timeframe: "1–2 weeks",
    cost: "Template: free–$500. Lawyer review: $300–$800",
    cta: { label: "Find a business lawyer", href: "/business/nextstep" },
  },
  {
    number: 8,
    emoji: "🧮",
    title: "Set up bookkeeping from day one",
    summary: "Good records make tax time simple and keep you on top of your cashflow.",
    detail: "You don't need expensive software to start — a simple spreadsheet tracking income and expenses works fine for a sole trader with low volume.\n\nAs you grow, accounting software like Xero or MYOB makes BAS lodgement, invoicing, and tax reporting much easier — and your accountant can access it directly.\n\nKey things to track from day one:\n• All income — date, client, amount, GST (if applicable)\n• All business expenses — keep receipts\n• Any assets you purchase for the business\n\nThe ATO requires you to keep records for at least 5 years. Digital copies of receipts are fine.",
    timeframe: "Ongoing from day one",
    cost: "Free (spreadsheet) to ~$35/month (Xero)",
    cta: null,
  },
];

function StepCard({ step }: { step: Step }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, zIndex: 1, boxShadow: "0 4px 12px rgba(16,185,129,0.25)" }}>{step.emoji}</div>
        <div style={{ width: 2, flex: 1, minHeight: 16, background: "linear-gradient(#a7f3d0, #d1fae5)", margin: "4px 0" }} />
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.9)", padding: "1rem 1.25rem", marginBottom: 4, boxShadow: "0 2px 12px rgba(16,185,129,0.04)" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Step {step.number}</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{step.title}</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>{step.summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>⏱ {step.timeframe}</span>
          {step.cost && <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: step.cost.toLowerCase().startsWith("free") ? "#f0fdf4" : "#fff7ed", color: step.cost.toLowerCase().startsWith("free") ? "#16a34a" : "#ea580c", border: `1px solid ${step.cost.toLowerCase().startsWith("free") ? "#bbf7d0" : "#fed7aa"}` }}>💰 {step.cost}</span>}
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", padding: 0, fontSize: 12, color: "#059669", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
          {open ? "Show less ↑" : "Read more ↓"}
        </button>
        {open && (
          <div style={{ marginTop: 10 }}>
            <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.85)", border: "1px solid #e2e8f0", marginBottom: step.cta ? 10 : 0 }}>
              {step.detail.split("\n\n").map((para, i, arr) => (
                <p key={i} style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: i < arr.length - 1 ? "0 0 10px" : "0" }}>
                  {para.split("\n").map((line, j, lines) => <span key={j}>{line}{j < lines.length - 1 && <br />}</span>)}
                </p>
              ))}
            </div>
            {step.cta && (
              <a href={step.cta.href} target={step.cta.href.startsWith("http") ? "_blank" : undefined} rel={step.cta.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 12, background: "linear-gradient(135deg, #f0fdf4, #d1fae5)", border: "1.5px solid rgba(16,185,129,0.2)", color: "#059669", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                {step.cta.label} →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessGuide() {
  const router = useRouter();
  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Header */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 12 }}>🚀</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em" }}>Business setup guide</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 5vw, 2rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            How to start a business in Australia
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            A plain-English walkthrough of every step — from validating your idea through to getting insured, registered, and ready to trade.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[{ val: "8 steps", label: "to get set up" }, { val: "2–8 wks", label: "typical timeline" }, { val: "4 pros", label: "who can help" }].map(s => (
              <div key={s.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "10px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>{s.val}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>{STEPS.map(step => <StepCard key={step.number} step={step} />)}</div>

        {/* Bottom CTA */}
        <div style={{ background: "linear-gradient(135deg, rgba(240,253,244,0.95), rgba(209,250,229,0.95))", backdropFilter: "blur(12px)", borderRadius: 20, border: "1.5px solid rgba(16,185,129,0.15)", padding: "1.5rem", marginTop: "0.5rem", boxShadow: "0 4px 24px rgba(16,185,129,0.08)" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#065f46", marginBottom: 4 }}>Not sure where you are in this process?</p>
          <p style={{ fontSize: 13, color: "#059669", marginBottom: "1rem", lineHeight: 1.6 }}>Answer 4 quick questions and we'll tell you exactly where you are and what to focus on next.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/business" style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #059669, #10b981)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>Get oriented in 2 minutes</a>
            <a href="/business/nextstep" style={{ padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(16,185,129,0.2)", color: "#059669", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Find professionals 🤝</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          ✦ This guide is for informational purposes only and does not constitute legal, financial, or business advice.
        </p>
      </div>
    </main>
  );
}
