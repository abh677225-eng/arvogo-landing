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

type SaleType = "private" | "auction";

const COMMON_STEPS = [
  {
    number: 1,
    emoji: "🪞",
    title: "Decide if buying is actually right for you",
    summary: "Before anything else — is ownership what you genuinely want, or what feels expected?",
    detail: "This is the step most people skip, and it's the one that causes the most regret. Buying a home is not inherently better than renting — it depends on your life, your plans, and what stability actually means to you.\n\nA useful exercise: write down what would specifically be better about owning vs renting. If the list is thin, or mostly about what others expect of you, that's important information. If the list is clear and comes from you — that's your answer.\n\nThe goal of this step is not to talk yourself into or out of buying. It's to make a deliberate choice rather than drift into one.",
    timeframe: "As long as it takes",
    cost: null,
    whoNeeds: "Everyone",
    cta: null,
    resources: null,
  },
  {
    number: 2,
    emoji: "💰",
    title: "Understand your borrowing capacity",
    summary: "Find out what's actually possible financially before you look at a single property.",
    detail: "Talk to a mortgage broker or use a serviceability calculator. This tells you your maximum borrowing capacity based on your income, expenses and existing debts.\n\nKnowing this number changes how you search — you stop wasting time on properties you can't afford, and you know when something is genuinely within reach. Most brokers offer this conversation for free with no obligation.\n\nDon't skip this step. Searching without knowing your budget is one of the most common ways people end up emotionally attached to a property they can't buy.",
    timeframe: "1–2 weeks",
    cost: "Free (mortgage broker) or use our calculator",
    whoNeeds: "Everyone seriously considering buying",
    cta: { label: "Try the borrowing calculator", href: "/serviceability" },
    resources: null,
  },
  {
    number: 3,
    emoji: "✅",
    title: "Get pre-approval",
    summary: "A pre-approval letter means you can move fast when you find the right property.",
    detail: "Pre-approval is a conditional agreement from a lender confirming they'll lend you up to a certain amount, subject to the property valuation. It's not a guarantee, but it gives you credibility with vendors and means you're not scrambling to arrange finance after you've found something you love.\n\nIn competitive markets — and especially at auction — not having pre-approval can cost you the property. Pre-approval typically lasts 3–6 months.\n\nYour mortgage broker handles this process for you.",
    timeframe: "1–4 weeks",
    cost: "Free through a mortgage broker",
    whoNeeds: "Anyone actively searching",
    cta: { label: "Find a mortgage broker", href: "/house/nextstep" },
    resources: null,
  },
  {
    number: 4,
    emoji: "🏘️",
    title: "Search for the right property",
    summary: "Browse listings, attend inspections, and calibrate what your budget actually gets you.",
    detail: "Use realestate.com.au and domain.com.au to browse active listings. Attend as many open homes as you can — even properties you're not serious about, just to calibrate your expectations against your budget.\n\nUse homely.com.au for neighbourhood insights and reviews from locals. Use onthehouse.com.au to check recent sold prices so you understand what properties are actually selling for, not just what they're listed at.\n\nA buyers agent is optional at this stage, but can be valuable if you're unfamiliar with the market, time-poor, or planning to bid at auction.",
    timeframe: "1–6 months",
    cost: "Free to search. Buyers agent: $8k–$20k (optional)",
    whoNeeds: "Anyone with pre-approval",
    cta: null,
    resources: [
      { name: "realestate.com.au", url: "https://www.realestate.com.au" },
      { name: "domain.com.au", url: "https://www.domain.com.au" },
      { name: "homely.com.au", url: "https://www.homely.com.au" },
      { name: "onthehouse.com.au", url: "https://www.onthehouse.com.au" },
    ],
  },
  {
    number: 5,
    emoji: "📋",
    title: "Engage a conveyancer",
    summary: "Get your conveyancer in place before you make any offer — not after.",
    detail: "A conveyancer handles the legal transfer of the property. They review the contract of sale, conduct title searches, liaise with your lender, and manage settlement.\n\nMost people make the mistake of engaging a conveyancer after they've found a property. In practice you want them in place earlier — so they can review the contract quickly when you find something you want, and so you're not scrambling under time pressure.\n\nIn Victoria and NSW, your conveyancer can also advise on contract conditions before you sign anything.",
    timeframe: "Engage before you make offers — active from exchange to settlement",
    cost: "Typically $800–$2,000 · Paid by you",
    whoNeeds: "Everyone buying a property",
    cta: { label: "Find a conveyancer", href: "/house/nextstep" },
    resources: null,
  },
];

const PRIVATE_STEPS = [
  {
    number: 6,
    emoji: "🤝",
    title: "Make a conditional offer",
    summary: "In a private sale, your offer includes conditions that protect you.",
    detail: "When you find a property you want to buy through a private sale, you make a written offer to the vendor. The standard approach in Australia is to make the offer subject to two conditions:\n\n• Subject to building and pest inspection — gives you the right to inspect the property and walk away (or renegotiate) if issues are found\n• Subject to finance — gives you the right to withdraw if your lender doesn't approve the loan for that specific property\n\nThe condition period is typically 14 days. Your conveyancer will advise on the contract before you sign.\n\nNote: In some states (particularly QLD), there is also a statutory cooling-off period after exchange.",
    timeframe: "1–7 days to negotiate",
    cost: null,
    whoNeeds: "Private sale buyers",
    cta: null,
    resources: null,
  },
  {
    number: 7,
    emoji: "🔬",
    title: "Building and pest inspection",
    summary: "Use the condition period to inspect the property — before you're legally committed.",
    detail: "Once your offer is accepted, engage a building and pest inspector immediately. You have a limited condition period (usually 14 days) to complete the inspection and raise any issues.\n\nThe inspector checks for structural defects, water damage, illegal structures, and pest activity. If serious issues are found, you can:\n• Renegotiate the price\n• Request the vendor fix the issues before settlement\n• Walk away entirely under the condition clause\n\nDo not skip this step. Issues found after exchange are your problem and your cost.",
    timeframe: "2–5 days to complete",
    cost: "Typically $400–$800 · Paid by you",
    whoNeeds: "All private sale buyers",
    cta: { label: "Find a building inspector", href: "/house/nextstep" },
    resources: null,
  },
  {
    number: 8,
    emoji: "🏦",
    title: "Finance approval confirmed",
    summary: "Your lender needs to approve the specific property, not just your borrowing capacity.",
    detail: "Pre-approval confirms you can borrow a certain amount. Formal approval — sometimes called unconditional approval — confirms the lender is satisfied with the specific property you're buying.\n\nThe lender will order a valuation of the property. If the valuation comes in lower than the purchase price, they may lend you less than expected, which could affect the deal.\n\nOnce formal approval is confirmed, your finance condition is satisfied and you're ready to exchange.",
    timeframe: "5–10 business days",
    cost: "Included in your loan application",
    whoNeeds: "All buyers using a mortgage",
    cta: null,
    resources: null,
  },
  {
    number: 9,
    emoji: "✍️",
    title: "Exchange contracts",
    summary: "Once conditions are satisfied, both parties sign — the sale is now legally binding.",
    detail: "Exchanging contracts means both you and the vendor have signed identical copies of the contract of sale and they've been formally exchanged. At this point the sale is legally binding.\n\nYou'll pay a deposit — typically 10% of the purchase price — at exchange. Your conveyancer manages this process.\n\nIn some states there is a cooling-off period after exchange (3 business days in VIC, 5 in NSW). Check with your conveyancer.",
    timeframe: "1 day",
    cost: "10% deposit due at exchange",
    whoNeeds: "Everyone",
    cta: null,
    resources: null,
  },
  {
    number: 10,
    emoji: "🏡",
    title: "Settlement",
    summary: "The balance is paid, ownership transfers, and you get the keys.",
    detail: "Settlement typically occurs 30–90 days after exchange, on a date agreed in the contract. Your conveyancer coordinates everything — they liaise with your lender to ensure the funds are ready, conduct final searches, and attend settlement on your behalf.\n\nOn settlement day, the remaining balance of the purchase price is paid to the vendor, the title transfers to your name, and you get the keys.\n\nDo a final inspection of the property in the days before settlement to confirm it's in the agreed condition.",
    timeframe: "30–90 days after exchange",
    cost: "Stamp duty + lender fees apply",
    whoNeeds: "Everyone",
    cta: null,
    resources: null,
  },
];

const AUCTION_STEPS = [
  {
    number: 6,
    emoji: "🔬",
    title: "Building and pest inspection — before auction day",
    summary: "At auction there is no cooling-off period. Inspect before you bid, not after.",
    detail: "This is the most critical difference between buying at auction and private sale. When the hammer falls at auction, you are immediately and unconditionally bound to complete the purchase — there is no cooling-off period and no condition clauses.\n\nThis means you must get your building and pest inspection done before auction day, not after. If you win the auction and then discover a major structural problem, that is your problem.\n\nContact the selling agent to arrange access for your inspector. Most agents facilitate this in the week before auction. Budget $400–$800.",
    timeframe: "Complete before auction day",
    cost: "Typically $400–$800 · Paid by you",
    whoNeeds: "All auction buyers",
    cta: { label: "Find a building inspector", href: "/house/nextstep" },
    resources: null,
  },
  {
    number: 7,
    emoji: "📝",
    title: "Review the contract before auction",
    summary: "Your conveyancer should review the contract of sale before you bid.",
    detail: "The contract of sale is available from the selling agent before the auction. Give this to your conveyancer to review — they'll check for any unusual conditions, easements, restrictions, or issues with the title that you should know about before bidding.\n\nThis typically takes 1–2 days and is included in your conveyancer's fee. Do not skip this — surprises in the contract after you've won the auction are expensive.",
    timeframe: "1–2 days",
    cost: "Included in conveyancer fee",
    whoNeeds: "All auction buyers",
    cta: null,
    resources: null,
  },
  {
    number: 8,
    emoji: "🏆",
    title: "Bid at auction",
    summary: "Know your limit before you walk in — and stick to it.",
    detail: "Set your maximum bid before auction day and do not exceed it. Auctions are emotionally charged environments designed to push prices up — having a hard limit decided in advance is the only reliable defence.\n\nIf you win the auction, you sign the contract and pay the deposit (usually 10%) on the spot. There is no cooling-off period. Settlement proceeds from here.\n\nIf the property is passed in (doesn't reach reserve), the highest bidder typically gets first right to negotiate with the vendor. This can be a good outcome — you may be able to negotiate a price below what you would have bid at auction.\n\nA buyers agent can bid on your behalf if you find auctions stressful or want professional representation.",
    timeframe: "Auction day",
    cost: "10% deposit payable immediately if you win",
    whoNeeds: "Auction buyers",
    cta: null,
    resources: null,
  },
  {
    number: 9,
    emoji: "✍️",
    title: "Exchange contracts",
    summary: "At auction, exchange happens immediately when the hammer falls.",
    detail: "Unlike a private sale where exchange happens separately, at auction you sign the contract of sale and pay your deposit on auction day if you win. Exchange is immediate and unconditional.\n\nFrom this point, the process is the same as a private sale — your conveyancer manages everything through to settlement.",
    timeframe: "Auction day",
    cost: "10% deposit due immediately",
    whoNeeds: "Everyone",
    cta: null,
    resources: null,
  },
  {
    number: 10,
    emoji: "🏡",
    title: "Settlement",
    summary: "The balance is paid, ownership transfers, and you get the keys.",
    detail: "Settlement typically occurs 30–90 days after exchange, on a date agreed in the contract. Your conveyancer coordinates everything — liaising with your lender, conducting final searches, and attending settlement on your behalf.\n\nOn settlement day, the remaining balance is paid to the vendor, the title transfers to your name, and you get the keys.\n\nDo a final inspection of the property in the days before settlement to confirm it's in the agreed condition.",
    timeframe: "30–90 days after auction",
    cost: "Stamp duty + lender fees apply",
    whoNeeds: "Everyone",
    cta: null,
    resources: null,
  },
];


  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: highlight
            ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, zIndex: 1,
          boxShadow: `0 4px 12px ${highlight ? "rgba(245,158,11,0.25)" : "rgba(99,102,241,0.25)"}`,
        }}>
          {step.emoji}
        </div>
        <div style={{ width: 2, flex: 1, minHeight: 16, background: "linear-gradient(#c7d2fe, #e2e8f0)", margin: "4px 0" }} />
      </div>

      <div style={{
        flex: 1, borderRadius: 18,
        background: highlight ? "rgba(255,251,235,0.95)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        border: highlight ? "1.5px solid rgba(245,158,11,0.2)" : "1px solid rgba(255,255,255,0.9)",
        padding: "1rem 1.25rem", marginBottom: 4,
        boxShadow: highlight ? "0 2px 12px rgba(245,158,11,0.08)" : "0 2px 12px rgba(99,102,241,0.04)",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: highlight ? "#d97706" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
          Step {step.number}
        </p>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.05rem", fontWeight: 400, color: "#1e293b",
          lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.01em",
        }}>{step.title}</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>
          {step.summary}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <span style={{
            fontSize: 11, padding: "3px 9px", borderRadius: 99,
            background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0",
          }}>⏱ {step.timeframe}</span>
          {step.cost && (
            <span style={{
              fontSize: 11, padding: "3px 9px", borderRadius: 99,
              background: step.cost.includes("Free") || step.cost.includes("Included") ? "#f0fdf4" : "#fff7ed",
              color: step.cost.includes("Free") || step.cost.includes("Included") ? "#16a34a" : "#ea580c",
              border: `1px solid ${step.cost.includes("Free") || step.cost.includes("Included") ? "#bbf7d0" : "#fed7aa"}`,
            }}>💰 {step.cost}</span>
          )}
        </div>

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
              padding: "12px 14px", borderRadius: 12,
              background: "rgba(255,255,255,0.85)", border: "1px solid #e2e8f0",
              marginBottom: step.resources || step.cta ? 10 : 0,
            }}>
              {step.detail.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: i < step.detail.split("\n\n").length - 1 ? "0 0 10px" : "0" }}>
                  {para.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < para.split("\n").length - 1 && <br />}</span>
                  ))}
                </p>
              ))}
            </div>

            {step.resources && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: step.cta ? 8 : 0 }}>
                {step.resources.map((r: { name: string; url: string }) => (
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

            {step.cta && (
              <a href={step.cta.href} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "10px 16px", borderRadius: 12,
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

function SaleTypeDivider({ type, onSwitch }: { type: SaleType; onSwitch: () => void }) {
  return (
    <div style={{
      background: type === "private"
        ? "linear-gradient(135deg, #ede9fe, #ddd6fe)"
        : "linear-gradient(135deg, #fef3c7, #fde68a)",
      borderRadius: 16, padding: "12px 16px", marginBottom: 12,
      border: `1.5px solid ${type === "private" ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
    }}>
      <div>
        <p style={{
          fontSize: 13, fontWeight: 700,
          color: type === "private" ? "#6366f1" : "#d97706",
          margin: "0 0 2px",
        }}>
          {type === "private" ? "🤝 Private sale" : "🏆 Auction"}
        </p>
        <p style={{ fontSize: 11, color: type === "private" ? "#7c3aed" : "#b45309", margin: 0 }}>
          {type === "private"
            ? "Steps 6–10 for private sale purchases"
            : "Steps 6–10 for auction purchases"}
        </p>
      </div>
      <button
        onClick={onSwitch}
        style={{
          fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 99,
          background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)",
          color: type === "private" ? "#6366f1" : "#d97706",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Switch to {type === "private" ? "auction" : "private sale"} →
      </button>
    </div>
  );
}

export default function HousePath() {
  const router = useRouter();
  const [saleType, setSaleType] = useState<SaleType>("private");

  const laterSteps = saleType === "private" ? PRIVATE_STEPS : AUCTION_STEPS;

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
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 1.25rem" }}>
            A plain-English walkthrough of every stage — from deciding whether to buy through to getting the keys. The process differs depending on whether you buy by private sale or auction.
          </p>

          {/* Sale type toggle */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["private", "auction"] as SaleType[]).map(type => (
              <button
                key={type}
                onClick={() => setSaleType(type)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 12,
                  background: saleType === type
                    ? type === "private" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "linear-gradient(135deg, #f59e0b, #fbbf24)"
                    : "#f8fafc",
                  border: saleType === type ? "none" : "1.5px solid #e2e8f0",
                  color: saleType === type ? "#fff" : "#64748b",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s ease",
                  boxShadow: saleType === type ? "0 4px 12px rgba(99,102,241,0.25)" : "none",
                }}
              >
                {type === "private" ? "🤝 Private sale" : "🏆 Auction"}
              </button>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: "1rem" }}>
            {[
              { val: "10 steps", label: "in the process" },
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

        {/* Common steps 1–5 */}
        <div style={{ marginBottom: 4 }}>
          {COMMON_STEPS.map(step => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>

        {/* Sale type divider */}
        <SaleTypeDivider type={saleType} onSwitch={() => setSaleType(saleType === "private" ? "auction" : "private")} />

        {/* Sale-type specific steps 6–10 */}
        <div>
          {laterSteps.map(step => (
            <StepCard key={`${saleType}-${step.number}`} step={step} highlight={saleType === "auction"} />
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
          ✦ This guide is for informational purposes only and does not constitute financial or legal advice. Processes vary by state — confirm details with your conveyancer.
        </p>

      </div>
    </main>
  );
}
