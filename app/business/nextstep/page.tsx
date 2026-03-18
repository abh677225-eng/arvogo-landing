"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 15% 25%, rgba(16,185,129,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 75%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 15%, rgba(245,158,11,0.12) 0%, transparent 50%),
  radial-gradient(ellipse at 15% 85%, rgba(14,165,233,0.12) 0%, transparent 50%),
  #f0fdf4
`;

type PositionKey = "exploring" | "setting-up" | "already-trading";
type CategoryKey = "accountant" | "banker" | "insurance" | "lawyer";
type StateCode = "VIC" | "NSW" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stage = answers[0];
  if (stage === "I've already started trading") return "already-trading";
  if (stage === "I'm ready to register and set up" || stage === "I'm researching and planning") return "setting-up";
  return "exploring";
}

// ── PAGE HEADERS ───────────────────────────────────────────
const PAGE_HEADERS: Record<PositionKey, { heading: string; subtext: string }> = {
  exploring: {
    heading: "Before you set anything up 💡",
    subtext: "Understand what's involved, what it costs, and what you'd actually need to do — before spending any money.",
  },
  "setting-up": {
    heading: "What you need to set up 🔧",
    subtext: "Government registrations, the right structure, and the people who can help you get it right from day one.",
  },
  "already-trading": {
    heading: "Close the gaps 📋",
    subtext: "Check what you may be missing — GST, insurance, contracts, and proper accounts.",
  },
};

// ── STRUCTURE COMPARISON ───────────────────────────────────
const STRUCTURES = [
  {
    name: "Sole trader",
    emoji: "👤",
    pros: ["Simplest to set up", "No separate tax return", "Full control", "Free to register"],
    cons: ["Personal liability for debts", "Taxed at personal rate", "Harder to bring in partners"],
    bestFor: "Service businesses under $100k revenue",
    cost: "Free",
    badge: "Most common starting point",
    badgeColor: "#059669",
  },
  {
    name: "Company (Pty Ltd)",
    emoji: "🏢",
    pros: ["Limited liability", "Tax at 25% flat", "Easier to raise investment", "Scalable"],
    cons: ["More setup cost", "Separate tax return", "More admin and compliance"],
    bestFor: "Higher revenue, employees, or investors",
    cost: "$576 ASIC fee",
    badge: "More structure, more protection",
    badgeColor: "#6366f1",
  },
];

// ── GOVERNMENT REGISTRATIONS ───────────────────────────────
const GOV_REGISTRATIONS = [
  {
    name: "ABN (Australian Business Number)",
    status: "required",
    cost: "Free",
    when: "Before you invoice anyone",
    url: "https://www.abr.gov.au/business-super-funds-charities/applying-for-an-abn",
    desc: "Every business needs one. Apply online in 15 minutes.",
  },
  {
    name: "GST registration",
    status: "if-over-75k",
    cost: "Free",
    when: "When your revenue exceeds or is expected to exceed $75,000/year",
    url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst",
    desc: "Mandatory over $75k/year. You can register voluntarily before this.",
  },
  {
    name: "Business name registration",
    status: "recommended",
    cost: "$44/year or $102 for 3 years",
    when: "If trading under a name that isn't your own legal name",
    url: "https://www.asic.gov.au/for-business/registering-a-business-name",
    desc: "Register via ASIC. Required before you can use a trading name.",
  },
  {
    name: "ACN + Company registration",
    status: "if-company",
    cost: "$576 ASIC fee",
    when: "Only if you're setting up a Pty Ltd company",
    url: "https://www.asic.gov.au/for-business/registrations/register-a-company",
    desc: "Gives you limited liability protection and a separate legal entity.",
  },
  {
    name: "TFN for your business",
    status: "required",
    cost: "Free",
    when: "If operating as a company or partnership",
    url: "https://www.ato.gov.au/businesses-and-organisations/starting-registering-or-closing-a-business/register-for-a-business-tax-registration",
    desc: "Sole traders use their personal TFN. Companies need a separate one.",
  },
];

// ── STATE LICENCE CHECKERS ─────────────────────────────────
const STATE_LICENCES: Record<StateCode, { name: string; url: string }> = {
  VIC: { name: "Business Victoria licence finder", url: "https://business.vic.gov.au/business-information/licences-and-permits" },
  NSW: { name: "NSW licence and permit finder", url: "https://www.nsw.gov.au/business-and-economy/running-a-business/licences-permits-and-certifications" },
  QLD: { name: "Business Queensland licence finder", url: "https://www.business.qld.gov.au/running-business/licensing" },
  SA:  { name: "SA Business Licence Information Service", url: "https://www.sa.gov.au/topics/business-and-trade/licences-and-registrations" },
  WA:  { name: "Business licence finder WA", url: "https://www.wa.gov.au/organisation/small-business-development-corporation/licences-and-permits" },
  TAS: { name: "Business Tasmania licence checker", url: "https://www.business.tas.gov.au/starting_a_business/licences_and_permits" },
  ACT: { name: "Access Canberra licence search", url: "https://www.accesscanberra.act.gov.au/s/licensing" },
  NT:  { name: "NT business licence information", url: "https://nt.gov.au/industry/business-and-industry/licences-and-registrations" },
};

// ── ALREADY TRADING CHECKLIST ──────────────────────────────
const TRADING_CHECKLIST = [
  { emoji: "💰", title: "GST registration", desc: "Are you over $75k revenue? You must be registered.", action: "Check at ato.gov.au", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst", urgent: true },
  { emoji: "🏦", title: "Separate business bank account", desc: "Mixing personal and business funds causes tax and legal problems.", action: "Open a business account", url: null, urgent: true },
  { emoji: "🛡️", title: "Public liability insurance", desc: "Most client contracts require it. One incident without it is catastrophic.", action: "Get a quote from an insurance broker", url: null, urgent: true },
  { emoji: "📋", title: "Written contracts with clients", desc: "Verbal agreements are unenforceable. A simple contract protects both parties.", action: "Talk to a business lawyer", url: null, urgent: false },
  { emoji: "🧮", title: "Bookkeeping and BAS lodgement", desc: "If you're registered for GST, BAS is due quarterly. Penalties apply for late lodgement.", action: "Talk to an accountant", url: null, urgent: false },
  { emoji: "📝", title: "Superannuation for yourself", desc: "Sole traders are not required to pay themselves super — but should consider it.", action: "Check ato.gov.au for options", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/self-employed-super", urgent: false },
];

// ── PROFESSIONALS ──────────────────────────────────────────
const CATEGORY_INFO: Record<CategoryKey, {
  emoji: string; title: string; what: string; when: string;
  cost: string; costType: "free" | "paid";
  status: "essential" | "optional" | "recommended";
  statusNote: string;
  showFor: PositionKey[];
  iconBg: string;
}> = {
  accountant: {
    emoji: "🧮", title: "Accountant",
    what: "Advises on structure, registers your ABN and GST, lodges your tax return and BAS, and helps you stay compliant as you grow.",
    when: "Before you register anything — one conversation now saves months of confusion later.",
    cost: "Free initial consult. Ongoing from ~$150/month", costType: "free",
    status: "essential", statusNote: "The most important first call you'll make",
    showFor: ["exploring", "setting-up", "already-trading"],
    iconBg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
  },
  banker: {
    emoji: "🏦", title: "Business banker",
    what: "Opens a dedicated business bank account — essential for separating personal and business finances from day one.",
    when: "As soon as you start receiving any business income. Before, ideally.",
    cost: "Free to open. Monthly fees vary by bank", costType: "free",
    status: "essential", statusNote: "Non-negotiable from a tax and legal perspective",
    showFor: ["setting-up", "already-trading"],
    iconBg: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
  },
  insurance: {
    emoji: "🛡️", title: "Insurance broker",
    what: "Finds the right public liability and professional indemnity cover for your business type. Many client contracts require both.",
    when: "Before you sign your first client contract or start on-site work.",
    cost: "Typically $500–$2,000/year depending on business type", costType: "paid",
    status: "recommended", statusNote: "Required by most professional contracts",
    showFor: ["setting-up", "already-trading"],
    iconBg: "linear-gradient(135deg, #fef3c7, #fde68a)",
  },
  lawyer: {
    emoji: "⚖️", title: "Business lawyer",
    what: "Drafts client contracts, terms of service, and partnership agreements. Protects your IP and limits your liability.",
    when: "Once you have regular clients or are taking on contractors.",
    cost: "Typically $300–$500/hour. Fixed-fee packages available", costType: "paid",
    status: "optional", statusNote: "Not urgent — but important before you scale",
    showFor: ["setting-up", "already-trading"],
    iconBg: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
  },
};

function StatusBadge({ status }: { status: "essential" | "optional" | "recommended" }) {
  const cfg = {
    essential:    { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "✓ Essential" },
    optional:     { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: "Optional" },
    recommended:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "⚠ Recommended" },
  }[status];
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>{cfg.label}</span>;
}

function CostBadge({ cost, costType }: { cost: string; costType: "free" | "paid" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: costType === "free" ? "#f0fdf4" : "#fff7ed", border: `1px solid ${costType === "free" ? "#bbf7d0" : "#fed7aa"}`, borderRadius: 99, padding: "2px 9px", fontSize: 11, fontWeight: 600, color: costType === "free" ? "#16a34a" : "#ea580c" }}>{costType === "free" ? "✓" : "💰"} {cost}</span>;
}

export default function BusinessNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [state, setState] = useState<StateCode | null>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Set<CategoryKey>>(new Set());
  const [expandedStructure, setExpandedStructure] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem("businessAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    const pos = mapAnswersToPosition(answers);
    setPosition(pos);
    setState((answers[3] as StateCode) || null);
    if (pos === "setting-up") setSelected(new Set(["accountant", "banker"] as CategoryKey[]));
    else if (pos === "already-trading") setSelected(new Set(["accountant"] as CategoryKey[]));
    else setSelected(new Set(["accountant"] as CategoryKey[]));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const header = PAGE_HEADERS[position];
  const visibleCategories = (Object.keys(CATEGORY_INFO) as CategoryKey[]).filter(k => CATEGORY_INFO[k].showFor.includes(position));
  const isValid = name.trim() && email.trim() && selected.size > 0;
  const stateData = state ? STATE_LICENCES[state] : null;

  function toggleCategory(key: CategoryKey) {
    setSelected(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  }

  function toggleChecked(i: number) {
    setCheckedItems(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  }

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, message, honeypot: "", categories: Array.from(selected), position, state, type: "business" }) });
    setSubmitted(true);
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none", boxSizing: "border-box" };

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        <button onClick={() => router.push("/business/position")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Header */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {state ? `Resources for ${state}` : "Resources"}
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.4rem, 4vw, 1.75rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8 }}>{header.heading}</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{header.subtext}</p>
        </div>

        {/* STRUCTURE COMPARISON — exploring + setting-up */}
        {(position === "exploring" || position === "setting-up") && (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(16,185,129,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏗️</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>Choose your structure first</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>This affects everything else — tax, liability, and admin.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STRUCTURES.map(s => (
                <div key={s.name} style={{ background: expandedStructure === s.name ? "#f8fafc" : "rgba(255,255,255,0.7)", borderRadius: 14, border: expandedStructure === s.name ? "1.5px solid #e2e8f0" : "1px solid #f1f5f9", overflow: "hidden" }}>
                  <button onClick={() => setExpandedStructure(expandedStructure === s.name ? null : s.name)} style={{ width: "100%", textAlign: "left", padding: "0.875rem 1rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{s.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>{s.name}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: s.badgeColor === "#059669" ? "#f0fdf4" : "#eef2ff", color: s.badgeColor, border: `1px solid ${s.badgeColor === "#059669" ? "#bbf7d0" : "#c7d2fe"}` }}>{s.badge}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Cost: {s.cost} · Best for: {s.bestFor}</p>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{expandedStructure === s.name ? "↑" : "↓"}</span>
                  </button>
                  {expandedStructure === s.name && (
                    <div style={{ padding: "0 1rem 1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 12px", border: "1px solid #d1fae5" }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Pros</p>
                          {s.pros.map(p => <p key={p} style={{ fontSize: 12, color: "#047857", margin: "0 0 3px" }}>✓ {p}</p>)}
                        </div>
                        <div style={{ background: "#fff7ed", borderRadius: 10, padding: "10px 12px", border: "1px solid #fed7aa" }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#ea580c", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Cons</p>
                          {s.cons.map(c => <p key={c} style={{ fontSize: 12, color: "#c2410c", margin: "0 0 3px" }}>✗ {c}</p>)}
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>✦ An accountant can confirm which structure suits your specific situation in one conversation.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOVERNMENT REGISTRATIONS — setting-up */}
        {position === "setting-up" && (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(16,185,129,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>What to register</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Government registrations with costs and direct links.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {GOV_REGISTRATIONS.map(reg => {
                const statusCfg = ({
                  required:      { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Required" },
                  "if-over-75k": { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "If revenue >$75k" },
                  recommended:   { bg: "#eef2ff", color: "#6366f1", border: "#c7d2fe", label: "Recommended" },
                  "if-company":  { bg: "#fef2f2", color: "#ef4444", border: "#fecaca", label: "If company only" },
                } as Record<string, { bg: string; color: string; border: string; label: string }>)[reg.status] ?? { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0", label: reg.status };
                return (
                  <div key={reg.name} style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 14px", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0, flex: 1 }}>{reg.name}</p>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}`, flexShrink: 0, whiteSpace: "nowrap" as const }}>{statusCfg.label}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px", lineHeight: 1.5 }}>{reg.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Cost: {reg.cost} · {reg.when}</span>
                      <a href={reg.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#059669", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>Register ↗</a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* State licence checker */}
            {stateData && (
              <div style={{ marginTop: 10, background: "#f0fdf4", borderRadius: 12, padding: "10px 14px", border: "1px solid #d1fae5" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#065f46", margin: "0 0 3px" }}>State licences — {state}</p>
                <p style={{ fontSize: 12, color: "#047857", margin: "0 0 4px" }}>Some industries require state-specific licences or permits.</p>
                <a href={stateData.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#059669", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>{stateData.name} ↗</a>
              </div>
            )}
          </div>
        )}

        {/* ALREADY TRADING CHECKLIST */}
        {position === "already-trading" && (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(16,185,129,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✅</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>Things to check</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Tick off what you've already sorted.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TRADING_CHECKLIST.map((item, i) => {
                const isChecked = checkedItems.has(i);
                return (
                  <div key={i} onClick={() => toggleChecked(i)} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: isChecked ? "#f0fdf4" : "#f8fafc", borderRadius: 12, padding: "10px 14px", border: `1px solid ${isChecked ? "#d1fae5" : item.urgent ? "#fde68a" : "#f1f5f9"}`, cursor: "pointer", transition: "all 0.15s ease" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: isChecked ? "#059669" : "#f1f5f9", border: isChecked ? "none" : "2px solid #d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.15s ease" }}>{isChecked ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 16 }}>{item.emoji}</span>
                        <p style={{ fontSize: 13, fontWeight: 600, color: isChecked ? "#94a3b8" : "#1e293b", margin: 0, textDecoration: isChecked ? "line-through" : "none" }}>{item.title}</p>
                        {item.urgent && !isChecked && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>Check now</span>}
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 3px", lineHeight: 1.5 }}>{item.desc}</p>
                      {item.url && !isChecked && <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: "#059669", textDecoration: "underline", textUnderlineOffset: 3 }}>{item.action} ↗</a>}
                      {!item.url && !isChecked && <p style={{ fontSize: 11, color: "#059669", margin: 0 }}>→ {item.action}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFESSIONALS */}
        {submitted ? (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "2rem", textAlign: "center", boxShadow: "0 4px 24px rgba(16,185,129,0.06)", marginBottom: "1rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", margin: "0 auto 1rem", background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✅</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8 }}>Request received</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem" }}>We'll connect you with the right people within 1 business day. No obligation.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {Array.from(selected).map(key => <span key={key} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 99, background: "#f0fdf4", color: "#059669", border: "1px solid #d1fae5" }}>{CATEGORY_INFO[key].emoji} {CATEGORY_INFO[key].title}</span>)}
            </div>
          </div>
        ) : (
          <>
            {/* Category checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
              {visibleCategories.map(key => {
                const info = CATEGORY_INFO[key]; const isChecked = selected.has(key);
                return (
                  <div key={key} onClick={() => toggleCategory(key)} style={{ background: isChecked ? "rgba(240,253,244,0.95)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 18, border: isChecked ? "2px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.9)", padding: "1rem 1.25rem", cursor: "pointer", boxShadow: isChecked ? "0 4px 20px rgba(16,185,129,0.1)" : "0 2px 12px rgba(16,185,129,0.03)", transition: "all 0.15s ease" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: isChecked ? "linear-gradient(135deg, #059669, #10b981)" : "#f1f5f9", border: isChecked ? "none" : "2px solid #d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.15s ease", boxShadow: isChecked ? "0 2px 8px rgba(16,185,129,0.3)" : "none" }}>{isChecked ? "✓" : ""}</div>
                      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: info.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{info.emoji}</div>
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
            <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Your details</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Your name</label><input type="text" placeholder="e.g. Alex" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6ee7b7"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Phone (optional)</label><input type="tel" placeholder="04xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6ee7b7"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                </div>
                <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Email address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6ee7b7"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Tell us about your business (optional)</label><textarea placeholder="e.g. Starting a freelance design business in Melbourne, just myself, no employees..." value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" as const }} onFocus={e => e.target.style.borderColor = "#6ee7b7"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
              </div>
              {selected.size > 0 && <div style={{ marginTop: "1rem", marginBottom: "1rem" }}><p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 6px" }}>Requesting introductions to:</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{Array.from(selected).map(key => <span key={key} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "#f0fdf4", color: "#059669", border: "1px solid #d1fae5" }}>{CATEGORY_INFO[key].emoji} {CATEGORY_INFO[key].title}</span>)}</div></div>}
              {selected.size === 0 && <p style={{ fontSize: 12, color: "#f59e0b", margin: "1rem 0 0", textAlign: "center" }}>↑ Select at least one professional above</p>}

                {/* Honeypot — hidden from humans, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  defaultValue=""
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />
              <button onClick={handleSubmit} disabled={!isValid || submitting} style={{ width: "100%", padding: "13px", borderRadius: 12, marginTop: "1rem", background: "linear-gradient(135deg, #059669, #10b981)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: isValid ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: isValid ? 1 : 0.45, boxShadow: isValid ? "0 4px 20px rgba(16,185,129,0.3)" : "none", transition: "opacity 0.15s ease" }}>
                {submitting ? "Sending... ⏳" : "Request introductions ✦"}
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0" }}>We'll be in touch within 1 business day. No obligation.</p>
            </div>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          ✦ Every professional on Arvogo has agreed to keep it low-pressure and honest.
        </p>

      </div>
    </main>
  );
}
