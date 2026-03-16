"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

const STEPS = [
  {
    number: 1,
    emoji: "🪞",
    title: "Decide if buying is actually right for you",
    summary: "Before anything else — is ownership what you genuinely want, or what feels expected?",
    detail: "This is the step most people skip, and it's the one that causes the most regret. Buying a home is not inherently better than renting. It depends on your life, your plans, and what you actually want stability to look like. Spend time here before you do anything else.",
    timeframe: "As long as it takes",
    whoNeeds: "Everyone",
    cost: null,
  },
  {
    number: 2,
    emoji: "💰",
    title: "Understand your borrowing capacity",
    summary: "Find out what's actually possible financially before you look at a single property.",
    detail: "Talk to a mortgage broker or use a serviceability calculator. This tells you your maximum borrowing capacity based on your income, expenses and existing debts. Knowing this number changes how you search — you stop wasting time on properties you can't afford, and you know when something is genuinely within reach. Most brokers offer this for free with no obligation.",
    timeframe: "1–2 weeks",
    whoNeeds: "Everyone seriously considering buying",
    cost: "Free (broker) or use our calculator",
    cta: { label: "Try the borrowing calculator", href: "/serviceability" },
  },
  {
    number: 3,
    emoji: "🔍",
    title: "Get pre-approval",
    summary: "A pre-approval letter means you can move fast when you find the right property.",
    detail: "Pre-approval is a conditional agreement from a lender confirming they'll lend you up to a certain amount, subject to the property valuation. It's not a guarantee, but it gives you credibility with vendors and means you're not scrambling to arrange finance after you've found something you love. In competitive markets, not having pre-approval can cost you the property.",
    timeframe: "1–4 weeks",
    whoNeeds: "Anyone actively searching",
    cost: "Free through a mortgage broker",
    cta: { label: "Find a mortgage broker", href: "/house/nextstep" },
  },
  {
    number: 4,
    emoji: "🏘️",
    title: "Search for the right property",
    summary: "Browse listings, attend inspections, and understand what your budget actually gets you.",
    detail: "Use realestate.com.au and domain.com.au to browse listings. Attend as many open homes as you can — even properties you're not serious about, just to calibrate your expectations. Use homely.com.au for neighbourhood insights, and onthehouse.com.au to check recent sold prices so you don't overpay. Having a buyers agent is optional, but can be particularly valuable if you're new to the market or planning to bid at auction.",
    timeframe: "1–6 months",
    whoNeeds: "Anyone with pre-approval",
    cost: "Free to search. Buyers agent: $8k–$20k (optional)",
    resources: [
      { name: "realestate.com.au", url: "https://www.realestate.com.au" },
      { name: "domain.com.au", url: "https://www.domain.com.au" },
      { name: "homely.com.au", url: "https://www.homely.com.au" },
      { name: "onthehouse.com.au", url: "https://www.onthehouse.com.au" },
    ],
  },
  {
    number: 5,
    emoji: "🔬",
    title: "Get a building and pest inspection",
    summary: "Before you commit to a property, find out exactly what you're buying.",
    detail: "A building and pest inspector checks for structural defects, water damage, illegal structures, and pest activity. It costs $400–$800 and can save you tens of thousands. Problems found before you exchange contracts can be used to negotiate the price down or walk away entirely. Problems found after are your responsibility. Do not skip this step.",
    timeframe: "2–5 days",
    whoNeeds: "Anyone who has found a property they want to buy",
    cost: "Typically $400–$800 · Paid by you",
    cta: { label: "Find a building inspector", href: "/house/nextstep" },
  },
  {
    number: 6,
    emoji: "📋",
    title: "Engage a conveyancer",
    summary: "The legal side of buying a property requires a licensed professional.",
    detail: "A conveyancer or solicitor handles the legal transfer of the property from the vendor to you. They review the contract of sale, conduct title searches to check for encumbrances, liaise with your lender, and manage the settlement process. You need to engage one before you exchange contracts — not after. In Victoria, NSW and most states, exchanging without legal representation is possible but strongly inadvisable.",
    timeframe: "Engage early — active from exchange to settlement",
    whoNeeds: "Everyone buying a property",
    cost: "Typically $800–$2,000 · Paid by you",
    cta: { label: "Find a conveyancer", href: "/house/nextstep" },
  },
  {
    number: 7,
    emoji: "🤝",
    title: "Make an offer or bid at auction",
    summary: "Private sale or auction — each has different rules and requires different preparation.",
    detail: "At a private sale, you make a written offer which the vendor can accept, reject or counter. There's usually a cooling-off period of 3–5 business days after you sign the contract. At auction, there is no cooling-off period — if your bid wins, you are legally bound to complete the purchase. Make sure your finances, conveyancer and inspections are all in order before auction day.",
    timeframe: "1 day (auction) or 1–2 weeks (private sale)",
    whoNeeds: "Everyone at this stage",
    cost: null,
  },
  {
    number: 8,
    emoji: "🏡",
    title: "Exchange contracts and settle",
    summary: "Exchange makes it legal. Settlement hands you the keys.",
    detail: "Exchanging contracts means both parties have signed and the sale is legally binding. You'll pay a deposit (usually 10%) at exchange. Settlement — typically 30–90 days later — is when the balance is paid and ownership transfers to you. Your conveyancer manages this entire process. On settlement day, you get the keys.",
    timeframe: "30–90 days from exchange",
    whoNeeds: "Everyone",
    cost: "Stamp duty + lender fees + conveyancer fee",
  },
];

function StepCard({ step }: { step: typeof STEPS[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
      {/* Left: number + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, zIndex: 1,
          boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
        }}>
          {step.emoji}
        </div>
        <div style={{ width: 2, flex: 1, minHeight: 16, background: "linear-gradient(#c7d2fe, #e2e8f0)", margin: "4px 0" }} />
      </div>

      {/* Right: card */}
      <div style={{
        flex: 1, borderRadius: 18,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.9)",
        padding: "1rem 1.25rem", marginBottom: 4,
        boxShadow: "0 2px 12px rgba(99,102,241,0.04)",
      }}>
        {/* Step number */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
          Step {step.number}
        </p>

        {/* Title */}
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.1rem", fontWeight: 400, color: "#1e293b",
          lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.01em",
        }}>{step.title}</h2>

        {/* Summary */}
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>
          {step.summary}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, padding: "3px 9px", borderRadius: 99,
            background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0",
          }}>⏱ {step.timeframe}</span>
          {step.cost && (
            <span style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 99,
              background: step.cost.includes("Free") ? "#f0fdf4" : "#fff7ed",
              color: step.cost.includes("Free") ? "#16a34a" : "#ea580c",
              border: `1px solid ${step.cost.includes("Free") ? "#bbf7d0" : "#fed7aa"}`,
            }}>💰 {step.cost}</span>
          )}
        </div>

        {/* Expand */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none", border: "none", padding: 0,
            fontSize: 12, color: "#6366f1",
            cursor: "pointer", fontFamily: "inherit",
            textDecoration: "underline", textUnderlineOffset: 3,
          }}
        >
          {open ? "Show less ↑" : "Read more ↓"}
        </button>

        {open && (
          <div style={{ marginTop: 10 }}>
            <div style={{
              padding: "10px 14px", borderRadius: 12,
              background: "rgba(255,255,255,0.8)", border: "1px solid #e2e8f0",
              marginBottom: step.resources || step.cta ? 10 : 0,
            }}>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: 0 }}>{step.detail}</p>
            </div>

            {/* Property search resources */}
            {step.resources && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {step.resources.map(r => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#f8fafc", borderRadius: 10, padding: "8px 12px",
                      border: "1px solid #f1f5f9", textDecoration: "none",
                      fontSize: 13, fontWeight: 500, color: "#1e293b",
                    }}
                  >
                    {r.name}
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>↗</span>
                  </a>
                ))}
              </div>
            )}

            {/* CTA */}
            {step.cta && (
              <a href={step.cta.href} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px 16px", borderRadius: 12, marginTop: step.resources ? 8 : 0,
                background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                border: "1.5px solid rgba(99,102,241,0.2)",
                color: "#4338ca", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                {step.cta.label} →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HousePath() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.back()} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>← Back</button>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.75rem", marginBottom: "1.5rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.1)", borderRadius: 99,
            padding: "4px 12px", marginBottom: "0.75rem",
          }}>
            <span style={{ fontSize: 12 }}>🏡</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Home buying guide</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.6rem, 5vw, 2rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: "0.5rem",
          }}>
            How buying a home works in Australia
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            A plain-English walkthrough of every stage — from deciding whether to buy, through to getting the keys. No jargon. No pressure.
          </p>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: "1.25rem" }}>
            {[
              { val: "8 steps", label: "in the process" },
              { val: "3–12 mo", label: "typical timeline" },
              { val: "4 pros", label: "you may need" },
            ].map(s => (
              <div key={s.label} style={{
                background: "#f8fafc", borderRadius: 12, padding: "10px",
                textAlign: "center", border: "1px solid #f1f5f9",
              }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>{s.val}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          {STEPS.map(step => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.95))",
          backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1.5px solid rgba(99,102,241,0.15)",
          padding: "1.5rem", marginTop: "0.5rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#4338ca", marginBottom: 4 }}>
            Not sure where you are in this process?
          </p>
          <p style={{ fontSize: 13, color: "#6366f1", marginBottom: "1rem", lineHeight: 1.6 }}>
            Answer 4 quick questions and we'll tell you exactly where you are, what to focus on next, and what you can safely ignore for now.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/house" style={{
              padding: "10px 18px", borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}>Get oriented in 2 minutes</a>
            <a href="/serviceability" style={{
              padding: "10px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: 13, fontWeight: 500, textDecoration: "none",
            }}>Check borrowing capacity 🧮</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          ✦ This guide is for informational purposes only and does not constitute financial or legal advice.
        </p>

      </div>
    </main>
  );
}
