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

const POSITIONS: Record<PositionKey, {
  emoji: string;
  title: string;
  tagline: string;
  meaning: string;
  next: string;
  notYet: string[];
  reassurance: string;
  gradient: string;
  accent: string;
}> = {
  exploring: {
    emoji: "🌱",
    title: "Exploring",
    tagline: "You're noticing the idea — not committing to it.",
    meaning: "Nothing to decide yet. Many people stay here a long time, and that's completely normal.",
    next: "Get a clearer sense of what ownership would actually change in your life — and what it wouldn't.",
    notYet: ["Researching suburbs 🏘️", "Mortgage calculations 🔢", "Timing the market 📈"],
    reassurance: "There's no rush to move past this.",
    gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    accent: "#059669",
  },
  considering: {
    emoji: "🤔",
    title: "Considering",
    tagline: "Buying feels possible — but not urgent.",
    meaning: "You're not choosing a home yet. You're deciding whether to take this seriously at all.",
    next: "Untangle what's coming from you vs outside pressure or expectations.",
    notYet: ["Viewing homes 🏠", "Talking to lenders 🏦", "Comparing suburbs 🗺️"],
    reassurance: "It's normal to sit here for a while.",
    gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    accent: "#2563eb",
  },
  preparing: {
    emoji: "🗺️",
    title: "Preparing",
    tagline: "You're engaging deliberately — not committed yet.",
    meaning: "This phase is about getting your footing. Still okay to slow down or change direction.",
    next: "Make sure the rest of your life can support this decision before narrowing in on a home.",
    notYet: ["Making offers 📝", "Rushing timelines ⏩", "Optimising deals 🔍"],
    reassurance: "Taking time here makes the later steps calmer.",
    gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    accent: "#7c3aed",
  },
  "in-process": {
    emoji: "🏃",
    title: "In process",
    tagline: "You're actively pursuing a home.",
    meaning: "The goal right now isn't speed — it's staying clear-headed as decisions stack up.",
    next: "Keep decisions small and sequential. Create space between commitments where you can.",
    notYet: ["Trying to 'win' 🏆", "Comparing yourself to others 👀", "Rushing to close ⚡"],
    reassurance: "Even now, it's okay to pause and re-orient.",
    gradient: "linear-gradient(135deg, #ffedd5, #fed7aa)",
    accent: "#ea580c",
  },
};

const STAGES: PositionKey[] = ["exploring", "considering", "preparing", "in-process"];
const STAGE_LABELS: Record<PositionKey, string> = {
  exploring: "Exploring",
  considering: "Considering",
  preparing: "Preparing",
  "in-process": "Active",
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

export default function HousePosition() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const copy = POSITIONS[position];
  const currentIndex = STAGES.indexOf(position);

  return (
    <main style={{
      minHeight: "100vh",
      background: meshBg,
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
        <button onClick={() => router.push("/house/questions")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>
          ← Back
        </button>

        {/* Progress bar */}
        <div style={{
          background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.25rem 1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
            Your position
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
            <div style={{
              position: "absolute", top: 13, left: "12.5%", right: "12.5%",
              height: 2, background: "#e2e8f0", zIndex: 0,
            }} />
            <div style={{
              position: "absolute", top: 13, left: "12.5%",
              width: `${(currentIndex / (STAGES.length - 1)) * 75}%`,
              height: 2,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              zIndex: 1,
              transition: "width 0.6s ease",
            }} />
            {STAGES.map((stage, i) => {
              const isActive = stage === position;
              const isPast = i < currentIndex;
              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", marginBottom: 8,
                    background: isActive
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : isPast ? "#c7d2fe" : "#fff",
                    border: isActive ? "none" : isPast ? "2px solid #a5b4fc" : "2px solid #e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600,
                    color: isActive ? "#fff" : isPast ? "#6366f1" : "#94a3b8",
                    boxShadow: isActive ? "0 2px 8px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {isPast ? "✓" : i + 1}
                  </div>
                  <p style={{
                    fontSize: 10, lineHeight: 1.3, padding: "0 2px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#6366f1" : "#94a3b8",
                  }}>
                    {STAGE_LABELS[stage]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Position hero card */}
        <div style={{
          borderRadius: 24, padding: "1.75rem",
          background: copy.gradient,
          border: `1px solid rgba(255,255,255,0.6)`,
          marginBottom: "1rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>{copy.emoji}</div>
          <p style={{ fontSize: 11, fontWeight: 700, color: copy.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            You are here
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            {copy.title}
          </h1>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>
            {copy.tagline}
          </p>
        </div>

        {/* Meaning */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.25rem 1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>What this means</p>
          </div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{copy.meaning}</p>
        </div>

        {/* What's next */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.25rem 1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>➡️</span>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>What comes next</p>
          </div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{copy.next}</p>
        </div>

        {/* Not yet */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.25rem 1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🚫</span>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Not yet</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {copy.notYet.map(item => (
              <span key={item} style={{
                fontSize: 12, padding: "6px 12px", borderRadius: 99,
                background: "#f1f5f9", color: "#64748b",
                border: "1px solid #e2e8f0",
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Reassurance */}
        <div style={{
          background: "rgba(255,255,255,0.6)", borderRadius: 16,
          padding: "1rem 1.25rem", marginBottom: "1.5rem",
          border: "1px solid rgba(255,255,255,0.8)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 14, color: "#64748b", fontStyle: "italic", margin: 0 }}>
            ✦ {copy.reassurance}
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href="/house/nextstep" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "14px 24px", borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontSize: 15, fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
          }}>
            See who can help with your next step 🤝
          </a>
          <button onClick={() => router.push("/house/path")} style={{
            padding: "13px 24px", borderRadius: 16,
            background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            color: "#6366f1", fontSize: 15, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            See your full path 🗺️
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          This doesn't decide anything for you. It just helps you see where you are.
        </p>

      </div>
    </main>
  );
}
