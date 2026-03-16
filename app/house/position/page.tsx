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
type StateCode = "VIC" | "NSW" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";

// ── FIRST HOME BENEFITS DATA ──────────────────────────────
// MAINTENANCE: Last verified March 2026
// See maintenance comments in serviceability calculator for update schedule

const FHOG: Record<StateCode, { amount: number; threshold: number | null; newOnly: boolean; note: string; expiry?: string }> = {
  VIC: { amount: 10000, threshold: 750000, newOnly: true, note: "New homes only. Must move in within 12 months." },
  NSW: { amount: 10000, threshold: 750000, newOnly: true, note: "New homes only. Must move in within 12 months." },
  QLD: { amount: 30000, threshold: 750000, newOnly: true, note: "Highest mainland grant. New homes only." },
  SA:  { amount: 15000, threshold: null,   newOnly: true, note: "No price cap — any value new home qualifies." },
  WA:  { amount: 10000, threshold: 750000, newOnly: false, note: "Applies to both new and established homes." },
  TAS: { amount: 30000, threshold: null,   newOnly: true,  note: "No price cap.", expiry: "June 2026" },
  ACT: { amount: 0,     threshold: null,   newOnly: false, note: "No FHOG in ACT — Home Buyer Concession Scheme instead." },
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
    <div style={{
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
      padding: "1.25rem 1.5rem",
      boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎁</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>First home buyer benefits</p>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{state ? `Showing benefits for ${state}` : "Select your state above to see state-specific benefits"}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
        {[{ key: "state", label: state ? `${state} benefits` : "State benefits" }, { key: "federal", label: "Federal schemes" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as "state" | "federal")} style={{
            flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: tab === t.key ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8fafc",
            border: tab === t.key ? "none" : "1.5px solid #e2e8f0",
            color: tab === t.key ? "#fff" : "#64748b",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: tab === t.key ? "0 2px 8px rgba(99,102,241,0.25)" : "none",
            transition: "all 0.15s ease",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "state" && (
        <div>
          {!state ? (
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Complete the questions to see your state-specific benefits.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* FHOG */}
              <div style={{ borderRadius: 14, background: fhog && fhog.amount > 0 ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "#f8fafc", border: "1px solid rgba(255,255,255,0.6)", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: fhog && fhog.amount > 0 ? "#065f46" : "#94a3b8", margin: 0 }}>First Home Owner Grant</p>
                  {fhog && fhog.amount > 0
                    ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#059669", color: "#fff" }}>{fmt(fhog.amount)}</span>
                    : <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#f1f5f9", color: "#94a3b8" }}>Not available</span>
                  }
                </div>
                {fhog && (
                  <>
                    <p style={{ fontSize: 12, color: fhog.amount > 0 ? "#047857" : "#94a3b8", margin: "0 0 3px", lineHeight: 1.5 }}>{fhog.note}</p>
                    {fhog.threshold && <p style={{ fontSize: 11, color: "#059669", margin: 0 }}>Price cap: {fmt(fhog.threshold)}</p>}
                    {fhog.expiry && <p style={{ fontSize: 11, color: "#d97706", margin: "4px 0 0", fontWeight: 600 }}>⏰ Expires {fhog.expiry}</p>}
                  </>
                )}
              </div>

              {/* Stamp duty */}
              <div style={{ borderRadius: 14, background: duty && duty.exemptThreshold ? "linear-gradient(135deg, #dbeafe, #bfdbfe)" : "#f8fafc", border: "1px solid rgba(255,255,255,0.6)", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: duty && duty.exemptThreshold ? "#1e40af" : "#94a3b8", margin: 0 }}>Stamp duty concession</p>
                  {duty && duty.exemptThreshold
                    ? <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#1d4ed8", color: "#fff" }}>Available ✓</span>
                    : <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#f1f5f9", color: "#94a3b8" }}>Not available</span>
                  }
                </div>
                {duty && (
                  <>
                    <p style={{ fontSize: 12, color: duty.exemptThreshold ? "#1e40af" : "#94a3b8", margin: "0 0 3px", lineHeight: 1.5 }}>{duty.note}</p>
                    {duty.expiry && <p style={{ fontSize: 11, color: "#d97706", margin: "4px 0 0", fontWeight: 600 }}>⏰ Expires {duty.expiry}</p>}
                  </>
                )}
              </div>

              <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                ✦ Confirm exact eligibility with your broker or at{" "}
                <a href={`https://www.${state === "ACT" ? "revenue.act.gov.au" : state === "NSW" ? "revenue.nsw.gov.au" : state === "VIC" ? "sro.vic.gov.au" : state === "QLD" ? "qro.qld.gov.au" : state === "SA" ? "revenuesa.sa.gov.au" : state === "WA" ? "finance.wa.gov.au" : state === "TAS" ? "sro.tas.gov.au" : "treasury.nt.gov.au"}`} target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>
                  your state revenue office ↗
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {tab === "federal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FEDERAL_SCHEMES.map(scheme => (
            <div key={scheme.name} style={{ background: expandedFederal === scheme.name ? "#f8fafc" : "rgba(255,255,255,0.7)", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
              <button onClick={() => setExpandedFederal(expandedFederal === scheme.name ? null : scheme.name)}
                style={{ width: "100%", textAlign: "left", padding: "0.875rem 1rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{scheme.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{scheme.name}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{scheme.headline}</p>
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{expandedFederal === scheme.name ? "↑" : "↓"}</span>
              </button>
              {expandedFederal === scheme.name && (
                <div style={{ padding: "0 1rem 1rem" }}>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: "0 0 8px" }}>{scheme.detail}</p>
                  <a href={scheme.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>Official information ↗</a>
                </div>
              )}
            </div>
          ))}
          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "4px 0 0" }}>✦ Federal schemes are available Australia-wide. Apply through a participating lender or mortgage broker.</p>
        </div>
      )}
    </div>
  );
}

// ── POSITION LOGIC ─────────────────────────────────────────

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const progress = answers[0];
  if (progress === "I'm making or about to make offers") return "buying";
  if (progress === "I'm actively looking at properties") return "searching";
  return "browsing";
}

const POSITIONS: Record<PositionKey, {
  emoji: string; title: string; tagline: string;
  gradient: string; accent: string;
  nextTitle: string; nextText: string;
  nextCTA: string; nextHref: string;
  secondaryCTA: string; secondaryHref: string;
}> = {
  browsing: {
    emoji: "👀", title: "Just browsing", tagline: "You're in the early stages — and that's completely normal.",
    gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)", accent: "#2563eb",
    nextTitle: "Start by getting a feel for the market",
    nextText: "The best thing you can do right now is browse listings — not to buy, but to understand what's out there. What areas interest you? What does your budget actually get you?",
    nextCTA: "Browse listings & resources", nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity", secondaryHref: "/serviceability",
  },
  searching: {
    emoji: "🔍", title: "Actively searching", tagline: "You're looking seriously — now get your finances locked in.",
    gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)", accent: "#7c3aed",
    nextTitle: "Get pre-approval before you go further",
    nextText: "The most important thing at this stage is knowing your exact borrowing capacity and getting pre-approved. Without it you're searching blind.",
    nextCTA: "Talk to a broker", nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity", secondaryHref: "/serviceability",
  },
  buying: {
    emoji: "🏡", title: "Ready to buy", tagline: "You're close — make sure the right people are in your corner.",
    gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)", accent: "#059669",
    nextTitle: "Line up your team before you sign anything",
    nextText: "At this stage you need a mortgage broker, a conveyancer, and a building & pest inspector before you exchange contracts.",
    nextCTA: "Find the right people", nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity", secondaryHref: "/serviceability",
  },
};

const LISTING_SITES = [
  { name: "realestate.com.au", emoji: "🏘️", desc: "Australia's largest listing site", url: "https://www.realestate.com.au" },
  { name: "domain.com.au", emoji: "🏡", desc: "Strong coverage + suburb insights", url: "https://www.domain.com.au" },
];

export default function HousePosition() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("browsing");
  const [state, setState] = useState<StateCode | null>(null);
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
    setState((answers[2] as StateCode) || null);
    setIsFirstHome(answers[3] === "Yes — first time buying");
    setTimeout(() => setVisible(true), 100);
  }, []);

  const copy = POSITIONS[position];

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        <button onClick={() => router.push("/house/questions")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back
        </button>

        {/* Position hero */}
        <div style={{ borderRadius: 24, padding: "2rem", background: copy.gradient, border: "1px solid rgba(255,255,255,0.6)", marginBottom: "1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 52, marginBottom: "0.75rem" }}>{copy.emoji}</div>
          <p style={{ fontSize: 11, fontWeight: 700, color: copy.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Where you are</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 8 }}>{copy.title}</h1>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>{copy.tagline}</p>
        </div>

        {/* One thing to do next */}
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0 }}>1</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>The one thing to do next</p>
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, marginBottom: 10, letterSpacing: "-0.01em" }}>{copy.nextTitle}</h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{copy.nextText}</p>
          <a href={copy.nextHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px 20px", borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(99,102,241,0.3)", marginBottom: 10 }}>
            {copy.nextCTA} →
          </a>
          <a href={copy.secondaryHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            {copy.secondaryCTA}
          </a>
        </div>

        {/* First home benefits — shown to all first home buyers */}
        {isFirstHome && <div style={{ marginBottom: "1rem" }}><FirstHomeBenefits state={state} /></div>}

        {/* Listing sites — browsing only */}
        {position === "browsing" && (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
              <span style={{ fontSize: 18 }}>🔎</span>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Where to browse</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LISTING_SITES.map(site => (
                <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", borderRadius: 12, padding: "10px 14px", border: "1px solid #f1f5f9", textDecoration: "none", transition: "background 0.15s ease" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#f8fafc"}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{site.emoji}</div>
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

        <button onClick={() => router.push("/house/path")} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.8)", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem" }}>
          See the full home buying guide →
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          This doesn't decide anything for you. It just helps you see where you are.
        </p>

      </div>
    </main>
  );
}
