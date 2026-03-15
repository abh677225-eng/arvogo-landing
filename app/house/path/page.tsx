"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

type PositionKey = "exploring" | "considering" | "preparing" | "in-process";

const ACTIVE_STEP: Record<PositionKey, number> = {
  exploring: 1, considering: 2, preparing: 3, "in-process": 5,
};

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stability = answers[2];
  const execution = answers[3];
  if (execution === "I'm already making offers") return "in-process";
  if (execution === "I'm actively looking") {
    if (stability === "Uncertain" || stability === "Hard to say") return "considering";
    return "preparing";
  }
  if (execution === "I've been browsing a bit") return "considering";
  return "exploring";
}

const STEPS = [
  {
    number: 1,
    emoji: "🪞",
    title: "Is buying even the right move?",
    summary: "The real question isn't which home — it's whether ownership fits your life right now.",
    detail: "Reflect on what's prompting the idea. What would ownership actually change? What wouldn't it? This is orientation, not research.",
    isLater: false,
  },
  {
    number: 2,
    emoji: "🧭",
    title: "Understand your constraints",
    summary: "Get a loose sense of what feels comfortable, risky, or unrealistic — before any numbers.",
    detail: "Most people do this informally. The goal is to avoid drifting into situations that would clearly feel stressful later.",
    isLater: false,
  },
  {
    number: 3,
    emoji: "⚖️",
    title: "Know your trade-offs",
    summary: "Every home involves compromises. Know which ones you can live with.",
    detail: "Think through day-to-day life — space, location, commute, flexibility. Not about listings yet. It's about knowing yourself.",
    isLater: false,
  },
  {
    number: 4,
    emoji: "💰",
    title: "Check what's actually possible",
    summary: "Confirm your borrowing capacity and what lenders will look at.",
    detail: "Talk to a broker or use a calculator here — to validate assumptions, not to commit. This is where numbers get real.",
    isLater: true,
  },
  {
    number: 5,
    emoji: "🏡",
    title: "Inspections and offers",
    summary: "Decisions get concrete and harder to reverse. Move steadily.",
    detail: "Most people reach this point after looping back through earlier steps a few times, feeling informed rather than rushed.",
    isLater: true,
  },
];

function StepCard({ step, isActive, isPast }: { step: typeof STEPS[0]; isActive: boolean; isPast: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
      {/* Left: number + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: isActive
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : isPast ? "#c7d2fe" : step.isLater ? "#f8fafc" : "#f1f5f9",
          border: isActive ? "none" : isPast ? "2px solid #a5b4fc" : "2px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isPast ? 14 : 18,
          boxShadow: isActive ? "0 4px 12px rgba(99,102,241,0.35)" : "none",
          transition: "all 0.3s ease",
          zIndex: 1,
        }}>
          {isPast ? "✓" : step.emoji}
        </div>
        <div style={{
          width: 2, flex: 1, minHeight: 16,
          background: isPast || isActive ? "linear-gradient(#a5b4fc, #e2e8f0)" : "#e2e8f0",
          margin: "4px 0",
        }} />
      </div>

      {/* Right: card */}
      <div style={{
        flex: 1, borderRadius: 18,
        background: isActive
          ? "rgba(238,242,255,0.95)"
          : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(8px)",
        border: isActive
          ? "1.5px solid rgba(99,102,241,0.25)"
          : step.isLater ? "1px solid rgba(241,245,249,0.8)" : "1px solid rgba(255,255,255,0.9)",
        padding: "1rem 1.25rem",
        marginBottom: 6,
        boxShadow: isActive ? "0 4px 20px rgba(99,102,241,0.1)" : "none",
        opacity: step.isLater && !isActive ? 0.7 : 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <p style={{
            fontSize: 14, fontWeight: 600,
            color: isActive ? "#4338ca" : "#1e293b",
            margin: 0,
          }}>
            {step.title}
          </p>
          {isActive && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 99,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              You are here
            </span>
          )}
          {step.isLater && !isActive && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
              background: "#f1f5f9", color: "#94a3b8",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Later
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: isActive ? "#4338ca" : "#64748b", lineHeight: 1.6, margin: "0 0 8px" }}>
          {step.summary}
        </p>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none", border: "none", padding: 0,
            fontSize: 12, color: isActive ? "#6366f1" : "#94a3b8",
            cursor: "pointer", fontFamily: "inherit",
            textDecoration: "underline", textUnderlineOffset: 3,
          }}
        >
          {open ? "Hide ↑" : "How people approach this ↓"}
        </button>
        {open && (
          <div style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 12,
            background: "rgba(255,255,255,0.8)", border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>{step.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HousePath() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    setPosition(mapAnswersToPosition(JSON.parse(raw)));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const activeStep = ACTIVE_STEP[position];

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "0 1rem",
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
        <button onClick={() => router.push("/house/position")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1.5rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            Your path forward 🗺️
          </h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            One step at a time. You don't need to do all of this now.
          </p>
        </div>

        {/* Steps */}
        <div>
          {STEPS.map(step => (
            <StepCard
              key={step.number}
              step={step}
              isActive={step.number === activeStep}
              isPast={step.number < activeStep}
            />
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
            Ready to check what's financially possible? 💰
          </p>
          <p style={{ fontSize: 13, color: "#6366f1", marginBottom: "1rem" }}>
            Get a rough sense of your borrowing capacity before talking to anyone.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/serviceability" style={{
              padding: "10px 18px", borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}>
              Try the calculator 🧮
            </a>
            <a href="/house/nextstep" style={{
              padding: "10px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.8)",
              border: "1.5px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: 13, fontWeight: 500,
              textDecoration: "none",
            }}>
              Talk to a broker 🤝
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          ✦ People often move back and forth between steps. That's normal.
        </p>

      </div>
    </main>
  );
}
