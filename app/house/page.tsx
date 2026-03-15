"use client";

import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

const steps = [
  { number: 1, emoji: "💬", label: "4 quick questions" },
  { number: 2, emoji: "📍", label: "See your position" },
  { number: 3, emoji: "🗺️", label: "Get your path" },
];

const benefits = [
  { emoji: "🎯", title: "Where you actually are", desc: "Not where you think you should be" },
  { emoji: "⚡", title: "What to focus on next", desc: "One thing, not a 20-step checklist" },
  { emoji: "😮‍💨", title: "What to ignore for now", desc: "So you stop worrying about the wrong things" },
];

export default function HouseEntry() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: "100vh",
      background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "5rem", paddingBottom: "4rem" }}>

        {/* Back */}
        <button onClick={() => router.push("/")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>
          ← Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.1)", borderRadius: 99,
            padding: "4px 12px", marginBottom: "1rem",
          }}>
            <span style={{ fontSize: 12 }}>🏡</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Home buying</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.25,
            letterSpacing: "-0.02em", marginBottom: "0.75rem",
          }}>
            Thinking about buying a house?
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
            Get oriented in under 2 minutes — no jargon, no pressure, no sign-up.
          </p>
        </div>

        {/* How it works */}
        <div style={{
          background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
            How it works
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
            {/* Connector */}
            <div style={{
              position: "absolute", top: 16, left: 16, right: 16,
              height: 2, background: "linear-gradient(90deg, #c7d2fe, #a5b4fc, #c7d2fe)",
              zIndex: 0,
            }} />
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
                }}>
                  {step.emoji}
                </div>
                <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.4, padding: "0 4px" }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{
          background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1.5rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
            What you get
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {benefits.map((b) => (
              <div key={b.title} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#f8fafc", borderRadius: 12, padding: "10px 14px",
                border: "1px solid #f1f5f9",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {b.emoji}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{b.title}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            sessionStorage.removeItem("houseQuestionState");
            sessionStorage.removeItem("houseAnswers");
            router.push("/house/questions");
          }}
          style={{
            width: "100%", padding: "15px 24px", borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            transition: "opacity 0.15s ease, transform 0.15s ease",
            marginBottom: "0.75rem",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.92";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          Help me get oriented ✦
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
          No sign-up. No advice. No pressure. Takes 2 minutes.
        </p>

      </div>
    </main>
  );
}
