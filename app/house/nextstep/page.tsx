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

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const progress = answers[0];
  if (progress === "I'm making or about to make offers") return "buying";
  if (progress === "I'm actively looking at properties") return "searching";
  return "browsing";
}

const INTROS: Record<PositionKey, { heading: string; subtext: string }> = {
  browsing: {
    heading: "Where to start looking 🔎",
    subtext: "You don't need to talk to anyone yet. Browse the listing sites below to get a feel for the market — and when you're ready, the calculator will give you a rough sense of your borrowing position.",
  },
  searching: {
    heading: "Get your finances sorted first 🏦",
    subtext: "Before you go any further, talk to a mortgage broker. Knowing your exact borrowing capacity and having pre-approval means you can move fast when the right property comes up.",
  },
  buying: {
    heading: "The people you need right now ⚡",
    subtext: "At this stage you need a broker for your loan, a conveyancer before you sign anything, and a building & pest inspector before you exchange contracts. A buyers agent is optional but can be valuable at auction.",
  },
};

const CATEGORY_INFO: Record<CategoryKey, {
  emoji: string;
  title: string;
  what: string;
  when: string;
  cost: string;
  costType: "free" | "paid";
  status: "essential" | "optional" | "recommended";
  statusNote: string;
  avatarGradient: string;
  showFor: PositionKey[];
}> = {
  broker: {
    emoji: "🏦",
    title: "Mortgage broker",
    what: "Finds you the right loan from dozens of lenders and handles the application on your behalf.",
    when: "Before you start seriously looking at properties. Pre-approval lets you move fast.",
    cost: "Free — paid by the lender, not you",
    costType: "free",
    status: "essential",
    statusNote: "You'll need one to get a loan",
    avatarGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    showFor: ["searching", "buying"],
  },
  "buyers-agent": {
    emoji: "🔍",
    title: "Buyers agent",
    what: "Searches, evaluates and bids on properties on your behalf. Works for you, not the vendor.",
    when: "Once you know your budget and target area. Particularly valuable at auction.",
    cost: "Typically $8,000–$20,000 or 1–2.5% of purchase price · Paid by you",
    costType: "paid",
    status: "optional",
    statusNote: "Many buyers find homes without one",
    avatarGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    showFor: ["buying"],
  },
  conveyancer: {
    emoji: "📋",
    title: "Conveyancer",
    what: "Handles the legal transfer of property — reviewing contracts, title checks, and settlement.",
    when: "Before you exchange contracts. Essential, not optional.",
    cost: "Typically $800–$2,000 · Paid by you",
    costType: "paid",
    status: "essential",
    statusNote: "Legally required to settle",
    avatarGradient: "linear-gradient(135deg, #10b981, #34d399)",
    showFor: ["buying"],
  },
  "building-pest": {
    emoji: "🔬",
    title: "Building & pest inspector",
    what: "Inspects the property for structural issues, defects, and pest activity before you commit.",
    when: "Before you exchange contracts — problems found after are your problem.",
    cost: "Typically $400–$800 · Paid by you",
    costType: "paid",
    status: "recommended",
    statusNote: "Skipping this is a costly risk",
    avatarGradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    showFor: ["buying"],
  },
};

const LISTING_SITES = [
  { name: "realestate.com.au", emoji: "🏘️", desc: "Australia's largest property listing site", url: "https://www.realestate.com.au" },
  { name: "domain.com.au", emoji: "🏡", desc: "Strong coverage + suburb research tools", url: "https://www.domain.com.au" },
  { name: "homely.com.au", emoji: "🗺️", desc: "Neighbourhood insights from locals", url: "https://www.homely.com.au" },
  { name: "onthehouse.com.au", emoji: "📊", desc: "Sold price history — avoid overpaying", url: "https://www.onthehouse.com.au" },
];

type LeadForm = { name: string; email: string; phone: string; message: string };

function StatusBadge({ status }: { status: "essential" | "optional" | "recommended" }) {
  const config = {
    essential: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "✓ Essential" },
    optional: { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: "Optional" },
    recommended: { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "⚠ Recommended" },
  }[status];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      textTransform: "uppercase" as const, letterSpacing: "0.04em",
    }}>{config.label}</span>
  );
}

function CostBadge({ cost, costType }: { cost: string; costType: "free" | "paid" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: costType === "free" ? "#f0fdf4" : "#fff7ed",
      border: `1px solid ${costType === "free" ? "#bbf7d0" : "#fed7aa"}`,
      borderRadius: 99, padding: "2px 9px",
      fontSize: 11, fontWeight: 600,
      color: costType === "free" ? "#16a34a" : "#ea580c",
    }}>
      {costType === "free" ? "✓" : "💰"} {cost}
    </span>
  );
}

function CategorySection({ categoryKey, onConnect }: {
  categoryKey: CategoryKey;
  onConnect: (category: CategoryKey, form: LeadForm) => void;
}) {
  const info = CATEGORY_INFO[categoryKey];
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    await onConnect(categoryKey, form);
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
      padding: "1.25rem 1.5rem", marginBottom: "1rem",
      boxShadow: "0 4px 24px rgba(99,102,241,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: "0.75rem" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: categoryKey === "broker" ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
            : categoryKey === "buyers-agent" ? "linear-gradient(135deg, #e0f2fe, #bae6fd)"
            : categoryKey === "conveyancer" ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
            : "linear-gradient(135deg, #fef3c7, #fde68a)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{info.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{info.title}</p>
            <StatusBadge status={info.status} />
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "0 0 4px" }}>{info.statusNote}</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", lineHeight: 1.5 }}>{info.what}</p>
          <CostBadge cost={info.cost} costType={info.costType} />
        </div>
      </div>

      <div style={{
        background: "#f8fafc", borderRadius: 10, padding: "8px 12px",
        border: "1px solid #f1f5f9", marginBottom: "0.75rem",
        display: "flex", alignItems: "flex-start", gap: 8,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>⏰</span>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
          <strong style={{ color: "#475569" }}>When:</strong> {info.when}
        </p>
      </div>

      {!submitted ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "100%", padding: "9px 14px", borderRadius: 10,
              background: expanded ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8fafc",
              border: expanded ? "none" : "1.5px solid #e2e8f0",
              color: expanded ? "#fff" : "#6366f1",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: expanded ? "0 4px 12px rgba(99,102,241,0.25)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {expanded ? "Hide request form ↑" : `Request a ${info.title.toLowerCase()} introduction ↓`}
          </button>

          {expanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "0.75rem" }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Leave your details and we'll connect you with a suitable {info.title.toLowerCase()}. No obligation.
              </p>
              {[
                { key: "name", label: "Your name", placeholder: "e.g. Alex", type: "text" },
                { key: "email", label: "Email address", placeholder: "you@email.com", type: "email" },
                { key: "phone", label: "Phone (optional)", placeholder: "04xx xxx xxx", type: "tel" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{field.label}</label>
                  <input
                    type={field.type} placeholder={field.placeholder}
                    value={form[field.key as keyof LeadForm]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 10,
                      border: "1.5px solid #e2e8f0", fontSize: 13,
                      fontFamily: "inherit", background: "#f8fafc",
                      outline: "none", boxSizing: "border-box" as const,
                    }}
                    onFocus={e => e.target.style.borderColor = "#a5b4fc"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Anything useful to know? (optional)</label>
                <textarea
                  placeholder="e.g. First home buyer, budget around $700k, looking in Melbourne's north..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 10,
                    border: "1.5px solid #e2e8f0", fontSize: 13,
                    fontFamily: "inherit", background: "#f8fafc",
                    outline: "none", resize: "none" as const, boxSizing: "border-box" as const,
                  }}
                  onFocus={e => e.target.style.borderColor = "#a5b4fc"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.email.trim() || submitting}
                style={{
                  width: "100%", padding: "11px", borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                  opacity: !form.name.trim() || !form.email.trim() ? 0.5 : 1,
                }}
              >
                {submitting ? "Sending... ⏳" : `Request a ${info.title.toLowerCase()} introduction ✦`}
              </button>
              <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0 }}>
                We'll be in touch within 1 business day.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{
          background: "#f0fdf4", borderRadius: 12, padding: "1rem",
          border: "1px solid #bbf7d0", textAlign: "center",
        }}>
          <p style={{ fontSize: 22, margin: "0 0 6px" }}>✅</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", margin: "0 0 4px" }}>Request received</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
            We'll connect you with a suitable {info.title.toLowerCase()} within 1 business day.
          </p>
        </div>
      )}
    </div>
  );
}

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("browsing");
  const [state, setState] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
    setState(answers[2] || null);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const intro = INTROS[position];
  const visibleCategories = (Object.keys(CATEGORY_INFO) as CategoryKey[])
    .filter(k => CATEGORY_INFO[k].showFor.includes(position));
  const showListingSites = position === "browsing" || position === "searching" || position === "buying";
  const listingSites = position === "buying"
    ? LISTING_SITES
    : LISTING_SITES.slice(0, 2);

  async function handleConnect(category: CategoryKey, form: LeadForm) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, category, position, state }),
    });
  }

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: 520, margin: "0 auto",
        paddingTop: "4rem", paddingBottom: "4rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        <button onClick={() => router.push("/house/position")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>← Back</button>

        {/* Intro */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1.25rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {state ? `Resources for ${state}` : "Resources"}
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.25,
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>{intro.heading}</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{intro.subtext}</p>
        </div>

        {/* Listing sites */}
        {showListingSites && (
          <div style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
            borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
            padding: "1.25rem 1.5rem", marginBottom: "1rem",
            boxShadow: "0 4px 24px rgba(99,102,241,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>🔎</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>Where to search for homes</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>The main platforms Australians use to find properties.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {listingSites.map(site => (
                <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "#f8fafc", borderRadius: 12, padding: "10px 14px",
                    border: "1px solid #f1f5f9", textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc"}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{site.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{site.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{site.desc}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "#94a3b8" }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Professionals */}
        {visibleCategories.map(key => (
          <CategorySection key={key} categoryKey={key} onConnect={handleConnect} />
        ))}

        {/* Calculator nudge */}
        <div style={{
          background: "rgba(255,255,255,0.7)", borderRadius: 16,
          padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.8)",
          marginBottom: "1rem",
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 3 }}>
            Want to know your borrowing capacity first?
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            <a href="/serviceability" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Try the free serviceability calculator
            </a>{" "}
            — uses real bank methodology, takes 2 minutes.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          ✦ Every professional on Arvogo has agreed to keep it low-pressure and honest.
        </p>

      </div>
    </main>
  );
}
