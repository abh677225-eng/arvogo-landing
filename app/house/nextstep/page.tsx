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

type PositionKey = "exploring" | "considering" | "preparing" | "in-process";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stability = answers[2];
  const execution = answers[3];
  if (execution === "I'm already making offers") return "in-process";
  if (execution === "I'm actively looking") {
    if (stability === "Uncertain" || stability === "It's complicated") return "considering";
    return "preparing";
  }
  if (execution === "I've been browsing a bit") return "considering";
  return "exploring";
}

const INTROS: Record<PositionKey, { heading: string; subtext: string }> = {
  exploring: {
    heading: "Not ready for a broker yet — and that's fine 👋",
    subtext: "A good broker won't push you. They'll help you understand what's actually possible so the whole decision feels less abstract — with no obligation to go any further.",
  },
  considering: {
    heading: "A conversation, not a commitment 💬",
    subtext: "You're not applying for anything. A quick chat with a broker can give you a clearer picture of what's realistic — so you can decide whether to take this further with real information.",
  },
  preparing: {
    heading: "A few people worth knowing about 🎯",
    subtext: "At this stage, a broker can confirm your borrowing position, and a buyers agent can help you understand what to look for. Neither requires a commitment — just a conversation.",
  },
  "in-process": {
    heading: "The people worth knowing about now ⚡",
    subtext: "A broker and conveyancer are essential. A building & pest inspector is strongly recommended before you sign anything. A buyers agent is optional — useful if you want support finding and bidding on the right home.",
  },
};

type CategoryKey = "broker" | "buyers-agent" | "conveyancer" | "building-pest";

const CATEGORY_INFO: Record<CategoryKey, {
  emoji: string;
  title: string;
  what: string;
  when: string;
  cost: string;
  costType: "free" | "paid";
  avatarGradient: string;
  status: "essential" | "optional" | "recommended";
  statusNote: string;
}> = {
  broker: {
    emoji: "🏦",
    title: "Mortgage broker",
    what: "Finds you the right loan from dozens of lenders and handles the application on your behalf.",
    when: "First step financially. Worth talking to before you start seriously looking at homes.",
    cost: "Free to use — paid by the lender, not you",
    costType: "free",
    avatarGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    status: "essential",
    statusNote: "You'll need one to get a loan",
  },
  "buyers-agent": {
    emoji: "🔍",
    title: "Buyers agent",
    what: "Searches, evaluates and bids on properties on your behalf. Works for you, not the vendor.",
    when: "Useful once you know your budget and target area. Particularly valuable at auction.",
    cost: "Typically $8,000–$20,000 flat or 1–2.5% of purchase price · Paid by you",
    costType: "paid",
    avatarGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    status: "optional",
    statusNote: "Many buyers find homes without one",
  },
  conveyancer: {
    emoji: "📋",
    title: "Conveyancer",
    what: "Handles the legal transfer of property — reviewing contracts, title checks, and settlement.",
    when: "You need one before you exchange contracts. Essential, not optional.",
    cost: "Typically $800–$2,000 · Paid by you",
    costType: "paid",
    avatarGradient: "linear-gradient(135deg, #10b981, #34d399)",
    status: "essential",
    statusNote: "Legally required to settle",
  },
  "building-pest": {
    emoji: "🔬",
    title: "Building & pest inspector",
    what: "Inspects the property for structural issues, defects, and pest activity before you commit.",
    when: "Get one done before you exchange contracts — problems found after are your problem.",
    cost: "Typically $400–$800 · Paid by you",
    costType: "paid",
    avatarGradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    status: "recommended",
    statusNote: "Skipping this is a costly risk",
  },
};


const PROPERTY_RESOURCES = [
  {
    name: "realestate.com.au",
    emoji: "🏘️",
    desc: "Australia's largest property listing site. Best for browsing active listings.",
    url: "https://www.realestate.com.au",
    showFrom: ["preparing", "in-process"] as PositionKey[],
  },
  {
    name: "domain.com.au",
    emoji: "🏡",
    desc: "Strong coverage across major cities. Good for suburb research and price guides.",
    url: "https://www.domain.com.au",
    showFrom: ["preparing", "in-process"] as PositionKey[],
  },
  {
    name: "homely.com.au",
    emoji: "🗺️",
    desc: "Neighbourhood insights and reviews from locals. Useful for understanding an area.",
    url: "https://www.homely.com.au",
    showFrom: ["in-process"] as PositionKey[],
  },
  {
    name: "onthehouse.com.au",
    emoji: "📊",
    desc: "Historical sold prices and property reports. Helps you avoid overpaying.",
    url: "https://www.onthehouse.com.au",
    showFrom: ["in-process"] as PositionKey[],
  },
];

type LeadForm = { name: string; email: string; phone: string; message: string };
type SubmitState = "idle" | "submitting" | "done";

function CostBadge({ cost, costType }: { cost: string; costType: "free" | "paid" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: costType === "free" ? "#f0fdf4" : "#fff7ed",
      border: `1px solid ${costType === "free" ? "#bbf7d0" : "#fed7aa"}`,
      borderRadius: 99, padding: "3px 10px",
    }}>
      <span style={{ fontSize: 11 }}>{costType === "free" ? "✓" : "💰"}</span>
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: costType === "free" ? "#16a34a" : "#ea580c",
      }}>{cost}</span>
    </div>
  );
}

function CategorySection({
  categoryKey,
  position,
  onConnect,
}: {
  categoryKey: CategoryKey;
  position: PositionKey;
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

      {/* Header */}
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
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
              background: info.status === "essential" ? "#f0fdf4"
                : info.status === "optional" ? "#f8fafc"
                : "#fffbeb",
              color: info.status === "essential" ? "#16a34a"
                : info.status === "optional" ? "#64748b"
                : "#d97706",
              border: `1px solid ${info.status === "essential" ? "#bbf7d0"
                : info.status === "optional" ? "#e2e8f0"
                : "#fde68a"}`,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
            }}>
              {info.status === "essential" ? "✓ Essential"
                : info.status === "optional" ? "Optional"
                : "⚠ Recommended"}
            </span>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px", fontStyle: "italic" }}>{info.statusNote}</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", lineHeight: 1.5 }}>{info.what}</p>
          <CostBadge cost={info.cost} costType={info.costType} />
        </div>
      </div>

      {/* When */}
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

      {/* Request form toggle */}
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
            {expanded ? `Hide request form ↑` : `Connect with a ${info.title.toLowerCase()} ↓`}
          </button>

          {expanded && (
            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Leave your details and we'll connect you with a suitable {info.title.toLowerCase()} in Melbourne. No obligation.
              </p>
              {[
                { key: "name", label: "Your name", placeholder: "e.g. Alex", type: "text" },
                { key: "email", label: "Email address", placeholder: "you@email.com", type: "email" },
                { key: "phone", label: "Phone (optional)", placeholder: "04xx xxx xxx", type: "tel" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
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
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>
                  Anything useful to know? (optional)
                </label>
                <textarea
                  placeholder={`e.g. First home buyer, budget around $700k, looking in Melbourne's north...`}
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
                  transition: "opacity 0.15s ease",
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

function PropertyResources({ position }: { position: PositionKey }) {
  const resources = PROPERTY_RESOURCES.filter(r => r.showFrom.includes(position));
  if (resources.length === 0) return null;
  const isFullList = position === "in-process";

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
      padding: "1.25rem 1.5rem", marginBottom: "1rem",
      boxShadow: "0 4px 24px rgba(99,102,241,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>🔎</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 2px" }}>Where to search for homes</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
            {isFullList
              ? "The main platforms Australians use to find and research properties."
              : "Worth knowing about when you're ready to start browsing."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {resources.map(r => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
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
            }}>{r.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{r.name}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{r.desc}</p>
            </div>
            <span style={{ fontSize: 14, color: "#94a3b8" }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    setPosition(mapAnswersToPosition(JSON.parse(raw)));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const intro = INTROS[position];

  async function handleConnect(category: CategoryKey, form: LeadForm) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, category, position }),
    });
  }

  const showBrokers = true;
  const showBuyersAgents = position === "preparing" || position === "in-process";
  const showConveyancers = position === "in-process";
  const showBuildingPest = position === "in-process";

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

        {/* Intro card */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1.25rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            People who can help
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.25,
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>{intro.heading}</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{intro.subtext}</p>
        </div>

        {/* Category sections — position aware */}
        {showBrokers && <CategorySection categoryKey="broker" position={position} onConnect={handleConnect} />}
        {showBuyersAgents && <CategorySection categoryKey="buyers-agent" position={position} onConnect={handleConnect} />}
        {showConveyancers && <CategorySection categoryKey="conveyancer" position={position} onConnect={handleConnect} />}
        {showBuildingPest && <CategorySection categoryKey="building-pest" position={position} onConnect={handleConnect} />}

        {/* Property search resources */}
        <PropertyResources position={position} />

        {/* Soft exit */}
        <div style={{
          background: "rgba(255,255,255,0.7)", borderRadius: 16,
          padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.8)",
          marginBottom: "1rem",
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 3 }}>
            Not ready to talk to anyone yet?
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            That's completely fine.{" "}
            <a href="/serviceability" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Try the serviceability calculator
            </a>{" "}
            to get a rough sense of your position on your own terms.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          ✦ Every professional on Arvogo has agreed to keep it low-pressure and honest.
        </p>

      </div>


    </main>
  );
}
