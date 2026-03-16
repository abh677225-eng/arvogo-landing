"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

type PositionKey = "browsing" | "searching" | "buying";
type CategoryKey = "broker" | "buyers-agent" | "conveyancer" | "building-pest";
type StateCode = "VIC" | "NSW" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const progress = answers[0];
  if (progress === "I'm making or about to make offers") return "buying";
  if (progress === "I'm actively looking at properties") return "searching";
  return "browsing";
}

// ── FIRST HOME BENEFITS ────────────────────────────────────
// MAINTENANCE: Last verified March 2026

const FHOG: Record<StateCode, { amount: number; threshold: number | null; newOnly: boolean; note: string; expiry?: string }> = {
  VIC: { amount: 10000, threshold: 750000, newOnly: true, note: "New homes only. Must move in within 12 months." },
  NSW: { amount: 10000, threshold: 750000, newOnly: true, note: "New homes only. Must move in within 12 months." },
  QLD: { amount: 30000, threshold: 750000, newOnly: true, note: "Highest mainland grant. New homes only." },
  SA:  { amount: 15000, threshold: null,   newOnly: true, note: "No price cap — any value new home qualifies." },
  WA:  { amount: 10000, threshold: 750000, newOnly: false, note: "Applies to both new and established homes." },
  TAS: { amount: 30000, threshold: null,   newOnly: true,  note: "No price cap.", expiry: "June 2026" },
  ACT: { amount: 0,     threshold: null,   newOnly: false, note: "No FHOG in ACT — see Home Buyer Concession Scheme." },
  NT:  { amount: 50000, threshold: 750000, newOnly: true,  note: "HomeGrown Grant — highest in Australia.", expiry: "September 2026" },
};

const STAMP_DUTY: Record<StateCode, { exemptThreshold: number | null; concessionThreshold: number | null; note: string; expiry?: string }> = {
  VIC: { exemptThreshold: 600000, concessionThreshold: 750000, note: "Full exemption under $600k. Concession $600k–$750k." },
  NSW: { exemptThreshold: 800000, concessionThreshold: 1000000, note: "Full exemption under $800k. Concession $800k–$1M." },
  QLD: { exemptThreshold: 700000, concessionThreshold: 800000, note: "New homes: full exemption under $700k. Concession to $800k." },
  SA:  { exemptThreshold: null,   concessionThreshold: null,    note: "No stamp duty exemption in SA." },
  WA:  { exemptThreshold: 500000, concessionThreshold: 700000,  note: "Full exemption under $500k. Concession to $700k." },
  TAS: { exemptThreshold: 750000, concessionThreshold: null,    note: "Full exemption under $750k.", expiry: "June 2026" },
  ACT: { exemptThreshold: 1020000, concessionThreshold: null,   note: "Home Buyer Concession Scheme — full waiver up to $1.02M (income tested)." },
  NT:  { exemptThreshold: null,   concessionThreshold: null,    note: "No stamp duty exemption currently." },
};

const FEDERAL_SCHEMES = [
  { emoji: "🏦", name: "5% Deposit Scheme", headline: "Buy with 5% deposit — no LMI", detail: "Government guarantees 15% of your loan. Unlimited places, no income caps (from Oct 2025). Owner-occupier only.", url: "https://www.housingaustralia.gov.au/support-buy-home/first-home-guarantee" },
  { emoji: "👨‍👧", name: "Family Home Guarantee", headline: "Single parents: 2% deposit, no LMI", detail: "For single parents with at least one dependent. Government guarantees 18% of your loan.", url: "https://www.housingaustralia.gov.au/support-buy-home/family-home-guarantee" },
  { emoji: "💼", name: "First Home Super Saver", headline: "Save your deposit in super", detail: "Withdraw up to $50k in voluntary super contributions for your deposit. Taxed at 15% instead of your marginal rate.", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/first-home-super-saver-scheme" },
  { emoji: "🤝", name: "Help to Buy", headline: "Government co-buys with you", detail: "Government contributes up to 40% of a new home's price. 10,000 places/year. Income caps apply.", url: "https://www.housingaustralia.gov.au/support-buy-home/help-to-buy" },
];

function fmt(n: number) { return "$" + n.toLocaleString("en-AU"); }

function FirstHomeBenefits({ state }: { state: StateCode | null }) {
  const [tab, setTab] = useState<"state" | "federal">("state");
  const [expandedFederal, setExpandedFederal] = useState<string | null>(null);
  const fhog = state ? FHOG[state] : null;
  const duty = state ? STAMP_DUTY[state] : null;

  return (
    <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎁</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>First home buyer benefits</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{state ? `Grants, concessions and schemes for ${state}` : "Grants, concessions and federal schemes"}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
        {[{ key: "state", label: state ? `${state} benefits` : "State benefits" }, { key: "federal", label: "Federal schemes" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as "state" | "federal")} style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: tab === t.key ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8fafc", border: tab === t.key ? "none" : "1.5px solid #e2e8f0", color: tab === t.key ? "#fff" : "#64748b", cursor: "pointer", fontFamily: "inherit", boxShadow: tab === t.key ? "0 2px 8px rgba(99,102,241,0.25)" : "none", transition: "all 0.15s ease" }}>{t.label}</button>
        ))}
      </div>
      {tab === "state" && (
        !state ? (
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Complete the questions to see your state-specific benefits.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ borderRadius: 14, background: fhog && fhog.amount > 0 ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "#f8fafc", border: "1px solid rgba(255,255,255,0.6)", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: fhog && fhog.amount > 0 ? "#065f46" : "#94a3b8", margin: 0 }}>First Home Owner Grant</p>
                {fhog && fhog.amount > 0 ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#059669", color: "#fff" }}>{fmt(fhog.amount)}</span> : <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#f1f5f9", color: "#94a3b8" }}>Not available</span>}
              </div>
              {fhog && <><p style={{ fontSize: 12, color: fhog.amount > 0 ? "#047857" : "#94a3b8", margin: "0 0 3px", lineHeight: 1.5 }}>{fhog.note}</p>{fhog.threshold && <p style={{ fontSize: 11, color: "#059669", margin: 0 }}>Price cap: {fmt(fhog.threshold)}</p>}{fhog.expiry && <p style={{ fontSize: 11, color: "#d97706", margin: "4px 0 0", fontWeight: 600 }}>⏰ Expires {fhog.expiry}</p>}</>}
            </div>
            <div style={{ borderRadius: 14, background: duty && duty.exemptThreshold ? "linear-gradient(135deg, #dbeafe, #bfdbfe)" : "#f8fafc", border: "1px solid rgba(255,255,255,0.6)", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: duty && duty.exemptThreshold ? "#1e40af" : "#94a3b8", margin: 0 }}>Stamp duty concession</p>
                {duty && duty.exemptThreshold ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#1d4ed8", color: "#fff" }}>Available ✓</span> : <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#f1f5f9", color: "#94a3b8" }}>Not available</span>}
              </div>
              {duty && <><p style={{ fontSize: 12, color: duty.exemptThreshold ? "#1e40af" : "#94a3b8", margin: "0 0 3px", lineHeight: 1.5 }}>{duty.note}</p>{duty.expiry && <p style={{ fontSize: 11, color: "#d97706", margin: "4px 0 0", fontWeight: 600 }}>⏰ Expires {duty.expiry}</p>}</>}
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>✦ Confirm exact eligibility with your broker or state revenue office.</p>
          </div>
        )
      )}
      {tab === "federal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FEDERAL_SCHEMES.map(scheme => (
            <div key={scheme.name} style={{ background: expandedFederal === scheme.name ? "#f8fafc" : "rgba(255,255,255,0.7)", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
              <button onClick={() => setExpandedFederal(expandedFederal === scheme.name ? null : scheme.name)} style={{ width: "100%", textAlign: "left", padding: "0.875rem 1rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{scheme.emoji}</span>
                <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{scheme.name}</p><p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{scheme.headline}</p></div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{expandedFederal === scheme.name ? "↑" : "↓"}</span>
              </button>
              {expandedFederal === scheme.name && <div style={{ padding: "0 1rem 1rem" }}><p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: "0 0 8px" }}>{scheme.detail}</p><a href={scheme.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>Official information ↗</a></div>}
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "4px 0 0" }}>✦ Apply through a participating lender or mortgage broker.</p>
        </div>
      )}
    </div>
  );
}

// ── PROFESSIONALS ──────────────────────────────────────────

const INTROS: Record<PositionKey, { heading: string; subtext: string }> = {
  browsing: { heading: "Where to start looking 🔎", subtext: "You don't need to talk to anyone yet. Browse the listing sites below to get a feel for the market." },
  searching: { heading: "Get your finances sorted first 🏦", subtext: "Before you go any further, talk to a mortgage broker. Pre-approval means you can move fast when the right property comes up." },
  buying: { heading: "The people you need right now ⚡", subtext: "Select the professionals you'd like an introduction to — fill in your details once and we'll handle the rest." },
};

const CATEGORY_INFO: Record<CategoryKey, { emoji: string; title: string; what: string; when: string; cost: string; costType: "free" | "paid"; status: "essential" | "optional" | "recommended"; statusNote: string; showFor: PositionKey[] }> = {
  broker:         { emoji: "🏦", title: "Mortgage broker",         what: "Finds you the right loan from dozens of lenders and handles the application on your behalf.", when: "Before you start seriously looking. Pre-approval lets you move fast.", cost: "Free — paid by the lender, not you", costType: "free", status: "essential", statusNote: "You'll need one to get a loan", showFor: ["searching", "buying"] },
  "buyers-agent": { emoji: "🔍", title: "Buyers agent",            what: "Searches, evaluates and bids on properties on your behalf. Works for you, not the vendor.", when: "Once you know your budget and target area. Valuable at auction.", cost: "Typically $8,000–$20,000 or 1–2.5% · Paid by you", costType: "paid", status: "optional", statusNote: "Many buyers find homes without one", showFor: ["buying"] },
  conveyancer:    { emoji: "📋", title: "Conveyancer",             what: "Handles the legal transfer of property — contracts, title checks, and settlement.", when: "Before you exchange contracts. Essential, not optional.", cost: "Typically $800–$2,000 · Paid by you", costType: "paid", status: "essential", statusNote: "Legally required to settle", showFor: ["buying"] },
  "building-pest":{ emoji: "🔬", title: "Building & pest inspector", what: "Inspects the property for structural issues, defects, and pest activity before you commit.", when: "Before you exchange contracts — problems found after are your problem.", cost: "Typically $400–$800 · Paid by you", costType: "paid", status: "recommended", statusNote: "Skipping this is a costly risk", showFor: ["buying"] },
};

const LISTING_SITES_ALL = [
  { name: "realestate.com.au", emoji: "🏘️", desc: "Australia's largest property listing site", url: "https://www.realestate.com.au" },
  { name: "domain.com.au", emoji: "🏡", desc: "Strong coverage + suburb research tools", url: "https://www.domain.com.au" },
  { name: "homely.com.au", emoji: "🗺️", desc: "Neighbourhood insights from locals", url: "https://www.homely.com.au" },
  { name: "onthehouse.com.au", emoji: "📊", desc: "Sold price history — avoid overpaying", url: "https://www.onthehouse.com.au" },
];

type LeadForm = { name: string; email: string; phone: string; message: string };

function StatusBadge({ status }: { status: "essential" | "optional" | "recommended" }) {
  const cfg = { essential: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "✓ Essential" }, optional: { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: "Optional" }, recommended: { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "⚠ Recommended" } }[status];
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>{cfg.label}</span>;
}

function CostBadge({ cost, costType }: { cost: string; costType: "free" | "paid" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: costType === "free" ? "#f0fdf4" : "#fff7ed", border: `1px solid ${costType === "free" ? "#bbf7d0" : "#fed7aa"}`, borderRadius: 99, padding: "2px 9px", fontSize: 11, fontWeight: 600, color: costType === "free" ? "#16a34a" : "#ea580c" }}>{costType === "free" ? "✓" : "💰"} {cost}</span>;
}

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("browsing");
  const [state, setState] = useState<StateCode | null>(null);
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Set<CategoryKey>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    const pos = mapAnswersToPosition(answers);
    setPosition(pos);
    setState((answers[2] as StateCode) || null);
    setIsFirstHome(answers[3] === "Yes — first time buying");
    if (pos === "buying") setSelected(new Set(["broker", "conveyancer"] as CategoryKey[]));
    else if (pos === "searching") setSelected(new Set(["broker"] as CategoryKey[]));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const intro = INTROS[position];
  const visibleCategories = (Object.keys(CATEGORY_INFO) as CategoryKey[]).filter(k => CATEGORY_INFO[k].showFor.includes(position));
  const listingSites = position === "buying" ? LISTING_SITES_ALL : LISTING_SITES_ALL.slice(0, 2);
  const isValid = name.trim() && email.trim() && selected.size > 0;

  function toggleCategory(key: CategoryKey) {
    setSelected(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  }

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, message, categories: Array.from(selected), position, state, isFirstHome }) });
    setSubmitted(true);
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none", boxSizing: "border-box" };

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        <button onClick={() => router.push("/house/position")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Intro */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{state ? `Resources for ${state}` : "Resources"}</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.4rem, 4vw, 1.75rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8 }}>{intro.heading}</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{intro.subtext}</p>
        </div>

        {/* First home benefits */}
        {isFirstHome && <div style={{ marginBottom: "1.25rem" }}><FirstHomeBenefits state={state} /></div>}

        {/* Listing sites */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔎</div>
            <div><p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>Where to search for homes</p><p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>The main platforms Australians use.</p></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {listingSites.map(site => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", borderRadius: 12, padding: "10px 14px", border: "1px solid #f1f5f9", textDecoration: "none", transition: "background 0.15s ease" }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9"} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{site.emoji}</div>
                <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{site.name}</p><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{site.desc}</p></div>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Professionals + form */}
        {visibleCategories.length > 0 && (
          submitted ? (
            <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "2rem", textAlign: "center", boxShadow: "0 4px 24px rgba(99,102,241,0.06)", marginBottom: "1rem" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", margin: "0 auto 1rem", background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✅</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8 }}>Request received</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem" }}>We'll connect you with the right people within 1 business day. No obligation.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: "1.25rem" }}>
                {Array.from(selected).map(key => <span key={key} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 99, background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe" }}>{CATEGORY_INFO[key].emoji} {CATEGORY_INFO[key].title}</span>)}
              </div>
              <button onClick={() => router.push("/house/path")} style={{ padding: "10px 24px", borderRadius: 12, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Back to your path 🗺️</button>
            </div>
          ) : (
            <>
              {/* Category checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
                {visibleCategories.map(key => {
                  const info = CATEGORY_INFO[key]; const isChecked = selected.has(key);
                  return (
                    <div key={key} onClick={() => toggleCategory(key)} style={{ background: isChecked ? "rgba(238,242,255,0.95)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 18, border: isChecked ? "2px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.9)", padding: "1rem 1.25rem", cursor: "pointer", boxShadow: isChecked ? "0 4px 20px rgba(99,102,241,0.1)" : "0 2px 12px rgba(99,102,241,0.03)", transition: "all 0.15s ease" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: isChecked ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f1f5f9", border: isChecked ? "none" : "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.15s ease", boxShadow: isChecked ? "0 2px 8px rgba(99,102,241,0.3)" : "none" }}>{isChecked ? "✓" : ""}</div>
                        <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: key === "broker" ? "linear-gradient(135deg, #eef2ff, #e0e7ff)" : key === "buyers-agent" ? "linear-gradient(135deg, #e0f2fe, #bae6fd)" : key === "conveyancer" ? "linear-gradient(135deg, #dcfce7, #bbf7d0)" : "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{info.emoji}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{info.title}</p>
                            <StatusBadge status={info.status} />
                          </div>
                          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "0 0 4px" }}>{info.statusNote}</p>
                          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 6px" }}>{info.what}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}><CostBadge cost={info.cost} costType={info.costType} /></div>
                          <div style={{ padding: "6px 10px", borderRadius: 8, background: isChecked ? "rgba(255,255,255,0.7)" : "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <span style={{ fontSize: 12, flexShrink: 0 }}>⏰</span>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}><strong style={{ color: "#475569" }}>When:</strong> {info.when}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Single shared form */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Your details</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Your name</label><input type="text" placeholder="e.g. Alex" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                    <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Phone (optional)</label><input type="tel" placeholder="04xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                  </div>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Email address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Anything useful to know? (optional)</label><textarea placeholder="e.g. First home buyer, budget around $700k, looking in Melbourne's north..." value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" as const }} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                </div>
                {selected.size > 0 && <div style={{ marginTop: "1rem", marginBottom: "1rem" }}><p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 6px" }}>Requesting introductions to:</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{Array.from(selected).map(key => <span key={key} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe" }}>{CATEGORY_INFO[key].emoji} {CATEGORY_INFO[key].title}</span>)}</div></div>}
                {selected.size === 0 && <p style={{ fontSize: 12, color: "#f59e0b", margin: "1rem 0 0", textAlign: "center" }}>↑ Select at least one professional above</p>}
                <button onClick={handleSubmit} disabled={!isValid || submitting} style={{ width: "100%", padding: "13px", borderRadius: 12, marginTop: "1rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: isValid ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: isValid ? 1 : 0.45, boxShadow: isValid ? "0 4px 20px rgba(99,102,241,0.3)" : "none", transition: "opacity 0.15s ease" }}>
                  {submitting ? "Sending... ⏳" : "Request introductions ✦"}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0" }}>We'll be in touch within 1 business day. No obligation.</p>
              </div>
            </>
          )
        )}

        {/* Calculator nudge */}
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 16, padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.8)", marginBottom: "1rem" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 3 }}>Want to know your borrowing capacity first?</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}><a href="/serviceability" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>Try the free serviceability calculator</a> — uses real bank methodology, takes 2 minutes.</p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>✦ Every professional on Arvogo has agreed to keep it low-pressure and honest.</p>
      </div>
    </main>
  );
}
