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

const FHOG: Record<string, { amount: number; threshold: number }> = {
  VIC: { amount: 10000, threshold: 750000 },
  NSW: { amount: 10000, threshold: 600000 },
  QLD: { amount: 15000, threshold: 750000 },
  SA:  { amount: 15000, threshold: 650000 },
  WA:  { amount: 10000, threshold: 750000 },
  TAS: { amount: 10000, threshold: 750000 },
  ACT: { amount: 0,     threshold: 0 },
  NT:  { amount: 10000, threshold: 750000 },
};

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const progress = answers[0];
  const budget = answers[1];
  if (progress === "I'm making or about to make offers") return "buying";
  if (progress === "I'm actively looking at properties") return "searching";
  return "browsing";
}

const POSITIONS: Record<PositionKey, {
  emoji: string;
  title: string;
  tagline: string;
  gradient: string;
  accent: string;
  nextTitle: string;
  nextText: string;
  nextCTA: string;
  nextHref: string;
  secondaryCTA?: string;
  secondaryHref?: string;
}> = {
  browsing: {
    emoji: "👀",
    title: "Just browsing",
    tagline: "You're in the early stages — and that's completely normal.",
    gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    accent: "#2563eb",
    nextTitle: "Start by getting a feel for the market",
    nextText: "The best thing you can do right now is browse listings — not to buy, but to understand what's out there. What areas interest you? What does your budget actually get you? Browsing with curiosity beats researching in the abstract.",
    nextCTA: "Browse listings",
    nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity",
    secondaryHref: "/serviceability",
  },
  searching: {
    emoji: "🔍",
    title: "Actively searching",
    tagline: "You're looking seriously — now get your finances locked in.",
    gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    accent: "#7c3aed",
    nextTitle: "Get pre-approval before you go further",
    nextText: "The most important thing at this stage is knowing your exact borrowing capacity and getting pre-approved. Without it you're searching blind — you might fall in love with something you can't afford, or miss out because you weren't ready to move fast enough.",
    nextCTA: "Talk to a broker",
    nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity",
    secondaryHref: "/serviceability",
  },
  buying: {
    emoji: "🏡",
    title: "Ready to buy",
    tagline: "You're close — make sure the right people are in your corner.",
    gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    accent: "#059669",
    nextTitle: "Line up your team before you sign anything",
    nextText: "At this stage you need a mortgage broker, a conveyancer, and a building & pest inspector before you exchange contracts. Getting these sorted now — not after you find a property — means you can move fast when the right one comes up.",
    nextCTA: "Find the right people",
    nextHref: "/house/nextstep",
    secondaryCTA: "Check your borrowing capacity",
    secondaryHref: "/serviceability",
  },
};

const LISTING_SITES = [
  { name: "realestate.com.au", emoji: "🏘️", desc: "Australia's largest listing site", url: "https://www.realestate.com.au" },
  { name: "domain.com.au", emoji: "🏡", desc: "Strong coverage + suburb insights", url: "https://www.domain.com.au" },
];

export default function HousePosition() {
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

  const copy = POSITIONS[position];
  const fhog = state ? FHOG[state] : null;
  const showListings = position === "browsing";
  const showFHOG = state && fhog && fhog.amount > 0;

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

        {/* Back */}
        <button onClick={() => router.push("/house/questions")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>← Back</button>

        {/* Position hero */}
        <div style={{
          borderRadius: 24, padding: "2rem",
          background: copy.gradient,
          border: "1px solid rgba(255,255,255,0.6)",
          marginBottom: "1rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 52, marginBottom: "0.75rem" }}>{copy.emoji}</div>
          <p style={{ fontSize: 11, fontWeight: 700, color: copy.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Where you are
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>{copy.title}</h1>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>{copy.tagline}</p>
        </div>

        {/* One thing to do next */}
        <div style={{
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0,
            }}>1</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              The one thing to do next
            </p>
          </div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.25rem", fontWeight: 400, color: "#1e293b",
            lineHeight: 1.3, marginBottom: 10, letterSpacing: "-0.01em",
          }}>{copy.nextTitle}</h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{copy.nextText}</p>

          {/* Primary CTA */}
          <a href={copy.nextHref} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "13px 20px", borderRadius: 14,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            marginBottom: 10,
          }}>
            {copy.nextCTA} →
          </a>

          {/* Secondary CTA */}
          {copy.secondaryCTA && (
            <a href={copy.secondaryHref} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "12px 20px", borderRadius: 14,
              background: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: 14, fontWeight: 500, textDecoration: "none",
            }}>
              {copy.secondaryCTA}
            </a>
          )}
        </div>

        {/* Listing sites — browsing only */}
        {showListings && (
          <div style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
            borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
            padding: "1.25rem 1.5rem", marginBottom: "1rem",
            boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
              <span style={{ fontSize: 18 }}>🔎</span>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                Where to browse
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LISTING_SITES.map(site => (
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
                    background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
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

        {/* FHOG — if state known */}
        {showFHOG && (
          <div style={{
            background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
            borderRadius: 20, border: "1px solid rgba(255,255,255,0.6)",
            padding: "1.25rem 1.5rem", marginBottom: "1rem",
            boxShadow: "0 4px 24px rgba(16,185,129,0.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>🎁</span>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                First home owner grant — {state}
              </p>
            </div>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.75rem", fontWeight: 400, color: "#1e293b",
              margin: "0 0 4px",
            }}>
              ${fhog!.amount.toLocaleString("en-AU")}
            </p>
            <p style={{ fontSize: 13, color: "#047857", margin: 0, lineHeight: 1.6 }}>
              Available to eligible first home buyers in {state} purchasing a new home under ${fhog!.threshold.toLocaleString("en-AU")}. Confirm eligibility with your broker.
            </p>
          </div>
        )}

        {/* Path link */}
        <button onClick={() => router.push("/house/path")} style={{
          width: "100%", padding: "12px", borderRadius: 14,
          background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.8)",
          color: "#64748b", fontSize: 13, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
          marginBottom: "1rem",
        }}>
          See the full path to buying a home →
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          This doesn't decide anything for you. It just helps you see where you are.
        </p>

      </div>
    </main>
  );
}
