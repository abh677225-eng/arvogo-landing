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
    heading: "The people you need in your corner ⚡",
    subtext: "At this stage you'll likely need all three. A broker for your loan, a buyers agent to help find and bid on the right home, and a conveyancer to handle the legal side before you exchange contracts.",
  },
};

type Provider = {
  name: string;
  initials: string;
  title: string;
  blurb: string;
  tag: string;
  category: "broker" | "buyers-agent" | "conveyancer";
};

const BROKERS: Provider[] = [
  {
    name: "Sarah Mitchell",
    initials: "SM",
    title: "Mortgage Broker · Melbourne",
    blurb: "Sarah works with first home buyers who aren't sure where to start. She's known for making the whole process feel less overwhelming — no jargon, no rush, just clear guidance.",
    tag: "🏠 First home buyers",
    category: "broker",
  },
  {
    name: "James Okafor",
    initials: "JO",
    title: "Mortgage Broker · Melbourne & surrounds",
    blurb: "James specialises in helping buyers understand their real borrowing position early — before they start looking at homes. He's direct, thorough, and easy to talk to.",
    tag: "💡 Borrowing clarity",
    category: "broker",
  },
];

const BUYERS_AGENTS: Provider[] = [
  {
    name: "Claire Andersen",
    initials: "CA",
    title: "Buyers Agent · Melbourne",
    blurb: "Claire searches, evaluates and bids on properties on your behalf — so you're not doing it alone. Particularly useful if you're time-poor or unfamiliar with the area.",
    tag: "🔍 Property search",
    category: "buyers-agent",
  },
  {
    name: "David Nguyen",
    initials: "DN",
    title: "Buyers Agent · Melbourne & surrounds",
    blurb: "David specialises in helping buyers avoid overpaying at auction. He brings local market knowledge and negotiation experience that most first-time buyers don't have on their own.",
    tag: "🏆 Auction specialist",
    category: "buyers-agent",
  },
];

const CONVEYANCERS: Provider[] = [
  {
    name: "Mia Torres",
    initials: "MT",
    title: "Conveyancer · Victoria",
    blurb: "Mia handles the legal transfer of the property — reviewing contracts, managing settlement, and making sure everything is in order before you sign anything binding.",
    tag: "📋 Contracts & settlement",
    category: "conveyancer",
  },
];

const CATEGORY_INFO: Record<string, { emoji: string; title: string; what: string; when: string }> = {
  broker: {
    emoji: "🏦",
    title: "Mortgage broker",
    what: "Finds you the right loan from dozens of lenders. Free to use — paid by the bank, not you.",
    when: "First step financially. Worth talking to before you start seriously looking at homes.",
  },
  "buyers-agent": {
    emoji: "🔍",
    title: "Buyers agent",
    what: "Searches, evaluates and bids on properties on your behalf. Paid by you, not the vendor.",
    when: "Useful once you know your budget and target area. Particularly valuable at auction.",
  },
  conveyancer: {
    emoji: "📋",
    title: "Conveyancer",
    what: "Handles the legal transfer of property — contracts, title checks, and settlement.",
    when: "You need one before you exchange contracts. Not urgent until you're close to buying.",
  },
};

const PROPERTY_RESOURCES = [
  {
    name: "realestate.com.au",
    emoji: "🏘️",
    desc: "Australia's largest property listing site. Best for browsing active listings.",
    url: "https://www.realestate.com.au",
    showFrom: ["preparing", "in-process"],
  },
  {
    name: "domain.com.au",
    emoji: "🏡",
    desc: "Strong coverage across major cities. Good for suburb research and price guides.",
    url: "https://www.domain.com.au",
    showFrom: ["preparing", "in-process"],
  },
  {
    name: "homely.com.au",
    emoji: "🗺️",
    desc: "Neighbourhood insights and reviews from locals. Useful for understanding an area before committing.",
    url: "https://www.homely.com.au",
    showFrom: ["in-process"],
  },
  {
    name: "onthehouse.com.au",
    emoji: "📊",
    desc: "Historical sold prices and property reports. Helps you avoid overpaying.",
    url: "https://www.onthehouse.com.au",
    showFrom: ["in-process"],
  },
];

type LeadForm = { name: string; email: string; phone: string; message: string };
type SubmitState = "idle" | "submitting" | "done";

function CategoryBadge({ category }: { category: string }) {
  const info = CATEGORY_INFO[category];
  return (
    <div style={{
      background: "rgba(238,242,255,0.6)", borderRadius: 12,
      padding: "8px 12px", marginBottom: 6,
      border: "1px solid rgba(199,210,254,0.4)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 16 }}>{info.emoji}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>{info.title}</span>
    </div>
  );
}

function ProviderCard({ provider, onConnect }: { provider: Provider; onConnect: (p: Provider) => void }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
      borderRadius: 18, border: "1px solid rgba(255,255,255,0.9)",
      padding: "1.1rem 1.25rem",
      boxShadow: "0 2px 16px rgba(99,102,241,0.04)",
    }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: provider.category === "broker"
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : provider.category === "buyers-agent"
            ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
            : "linear-gradient(135deg, #10b981, #34d399)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "#fff",
        }}>{provider.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>{provider.name}</p>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 99,
              background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe",
            }}>{provider.tag}</span>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{provider.title}</p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "3px 7px", borderRadius: 99,
          background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
          flexShrink: 0, alignSelf: "flex-start",
        }}>✓ Verified</span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{provider.blurb}</p>
      <button
        onClick={() => onConnect(provider)}
        style={{
          width: "100%", padding: "9px 14px", borderRadius: 10,
          background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
          border: "1.5px solid rgba(99,102,241,0.2)",
          color: "#4338ca", fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Connect with {provider.name.split(" ")[0]} 👋
      </button>
    </div>
  );
}

function CategorySection({
  category,
  providers,
  position,
  onConnect,
}: {
  category: string;
  providers: Provider[];
  position: PositionKey;
  onConnect: (p: Provider) => void;
}) {
  const info = CATEGORY_INFO[category];
  const [expanded, setExpanded] = useState(false);

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
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: category === "broker"
            ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
            : category === "buyers-agent"
            ? "linear-gradient(135deg, #e0f2fe, #bae6fd)"
            : "linear-gradient(135deg, #dcfce7, #bbf7d0)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{info.emoji}</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 2px" }}>{info.title}</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{info.what}</p>
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

      {/* Toggle providers */}
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
        {expanded ? `Hide ${info.title}s ↑` : `See available ${info.title}s ↓`}
      </button>

      {/* Provider cards */}
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "0.75rem" }}>
          {providers.map(p => (
            <ProviderCard key={p.name} provider={p} onConnect={onConnect} />
          ))}
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
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>🔎</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>Where to search for homes</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
            {isFullList
              ? "The main platforms Australians use to find and research properties."
              : "Worth knowing about when you're ready to start browsing."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "0.75rem" }}>
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
            <span style={{ fontSize: 12, color: "#94a3b8" }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function LeadModal({
  provider,
  position,
  onClose,
  submitState,
  onSubmit,
  form,
  setForm,
}: {
  provider: Provider;
  position: PositionKey;
  onClose: () => void;
  submitState: SubmitState;
  onSubmit: () => void;
  form: LeadForm;
  setForm: (f: LeadForm) => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.98)",
          borderRadius: 24, padding: "2rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        {submitState === "done" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", margin: "0 auto 1rem",
              background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>✅</div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8,
            }}>Request sent!</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {provider.name.split(" ")[0]} will be in touch shortly. No obligation — just a conversation.
            </p>
            <button onClick={onClose} style={{
              padding: "10px 24px", borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Done ✦</button>
          </div>
        ) : (
          <>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.4rem", fontWeight: 400, color: "#1e293b", marginBottom: 4,
            }}>Connect with {provider.name.split(" ")[0]}</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: "1.5rem" }}>
              No obligation. Just a relaxed introductory chat.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
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
                      border: "1.5px solid #e2e8f0", fontSize: 14,
                      fontFamily: "inherit", background: "#f8fafc",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Anything to share? (optional)</label>
                <textarea
                  placeholder="e.g. First home buyer, budget around $700k..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 10,
                    border: "1.5px solid #e2e8f0", fontSize: 14,
                    fontFamily: "inherit", background: "#f8fafc",
                    outline: "none", resize: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <button
              onClick={onSubmit}
              disabled={!form.name.trim() || !form.email.trim() || submitState === "submitting"}
              style={{
                width: "100%", padding: "13px", borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 8,
                opacity: !form.name.trim() || !form.email.trim() ? 0.5 : 1,
              }}
            >
              {submitState === "submitting" ? "Sending... ⏳" : "Send introduction request ✦"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: 0 }}>
              Your details are only shared with {provider.name.split(" ")[0]}.
            </p>
            <button onClick={onClose} style={{
              display: "block", width: "100%", marginTop: 8,
              background: "none", border: "none", fontSize: 12,
              color: "#94a3b8", cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", message: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    setPosition(mapAnswersToPosition(JSON.parse(raw)));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const intro = INTROS[position];

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitState("submitting");
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, provider: selectedProvider?.name, position }),
    });
    setSubmitState("done");
  }

  function handleConnect(provider: Provider) {
    setSelectedProvider(provider);
    setSubmitState("idle");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  // Determine which categories to show based on position
  const showBrokers = true;
  const showBuyersAgents = position === "preparing" || position === "in-process";
  const showConveyancers = position === "in-process";

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

        {/* Brokers — always shown */}
        {showBrokers && (
          <CategorySection
            category="broker"
            providers={BROKERS}
            position={position}
            onConnect={handleConnect}
          />
        )}

        {/* Buyers agents — preparing + in-process */}
        {showBuyersAgents && (
          <CategorySection
            category="buyers-agent"
            providers={BUYERS_AGENTS}
            position={position}
            onConnect={handleConnect}
          />
        )}

        {/* Conveyancers — in-process only */}
        {showConveyancers && (
          <CategorySection
            category="conveyancer"
            providers={CONVEYANCERS}
            position={position}
            onConnect={handleConnect}
          />
        )}

        {/* Property search resources */}
        <PropertyResources position={position} />

        {/* Soft footer */}
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

      {/* Lead modal */}
      {selectedProvider && (
        <LeadModal
          provider={selectedProvider}
          position={position}
          onClose={() => setSelectedProvider(null)}
          submitState={submitState}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
        />
      )}
    </main>
  );
}
