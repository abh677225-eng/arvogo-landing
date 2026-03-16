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

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stage = answers[0];
  if (stage === "I've already started trading") return "already-trading";
  if (stage === "I'm ready to register and set up") return "setting-up";
  if (stage === "I'm researching and planning") return "setting-up";
  return "exploring";
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
  secondaryCTA: string | null;
  secondaryHref: string | null;
}> = {
  exploring: {
    emoji: "💡",
    title: "Still exploring",
    tagline: "You have an idea but you're not committed yet — and that's the right place to start.",
    gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    accent: "#2563eb",
    nextTitle: "Validate before you set anything up",
    nextText: "The biggest mistake early-stage founders make is registering and spending money before they've confirmed anyone will pay for what they're offering. Before you touch an ABN or a business structure, do this: talk to 10 potential customers. Not friends — actual people who would pay. If you can't find 10 people to talk to, that's your signal.",
    nextCTA: "See what you'll need to set up →",
    secondaryCTA: null,
    secondaryHref: null,
  },
  "setting-up": {
    emoji: "🔧",
    title: "Setting up",
    tagline: "You've decided to do it — now you need to get the foundations right.",
    gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    accent: "#059669",
    nextTitle: "Choose your structure before you register anything",
    nextText: "The most important decision is whether to operate as a sole trader or a company. Get this wrong and it costs money to fix later. Most small service businesses start as sole traders — simple, cheap, and flexible. Talk to an accountant first. One conversation will save you months of confusion.",
    nextCTA: "See what to register and who to talk to →",
    secondaryCTA: null,
    secondaryHref: null,
  },
  "already-trading": {
    emoji: "📈",
    title: "Already trading",
    tagline: "You're up and running — now make sure the foundations are solid.",
    gradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
    accent: "#d97706",
    nextTitle: "Close the gaps before they become problems",
    nextText: "Most businesses that have been trading for a while have at least one gap — unregistered for GST when they should be, no public liability insurance, no formal contracts with clients, or no separation between personal and business finances. Find out what you're missing before the ATO or a client dispute does.",
    nextCTA: "See what to check and fix →",
    secondaryCTA: null,
    secondaryHref: null,
  },
};

export default function BusinessPosition() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("businessAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const copy = POSITIONS[position];

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        <button onClick={() => router.push("/business/questions")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
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
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0 }}>1</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>The one thing to do next</p>
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, marginBottom: 10, letterSpacing: "-0.01em" }}>{copy.nextTitle}</h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{copy.nextText}</p>

          <a href="/business/nextstep" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px 20px", borderRadius: 14, background: "linear-gradient(135deg, #059669, #10b981)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.3)", marginBottom: copy.secondaryCTA ? 10 : 0 }}>
            {copy.nextCTA}
          </a>

          {copy.secondaryCTA && copy.secondaryHref && (
            <a href={copy.secondaryHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(16,185,129,0.2)", color: "#059669", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              {copy.secondaryCTA}
            </a>
          )}
        </div>

        {/* Full guide link */}
        <button onClick={() => router.push("/business/guide")} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.8)", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem" }}>
          See the full business setup guide →
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          This doesn't decide anything for you. It just helps you see where you are.
        </p>

      </div>
    </main>
  );
}
