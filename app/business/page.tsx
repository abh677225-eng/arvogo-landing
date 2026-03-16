"use client";

import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 15% 25%, rgba(16,185,129,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 75%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 15%, rgba(245,158,11,0.12) 0%, transparent 50%),
  radial-gradient(ellipse at 15% 85%, rgba(14,165,233,0.12) 0%, transparent 50%),
  #f0fdf4
`;

const steps = [
  { emoji: "💬", label: "4 quick questions" },
  { emoji: "📍", label: "See your position" },
  { emoji: "🛠️", label: "Get your setup plan" },
];

const benefits = [
  { emoji: "🏗️", title: "What structure suits you", desc: "Sole trader, company, or partnership — explained plainly" },
  { emoji: "📋", title: "What you actually need to register", desc: "ABN, GST, business name — with costs and links" },
  { emoji: "🤝", title: "Who can help you get set up", desc: "Accountants, bankers, insurers — when you need them" },
];

export default function BusinessEntry() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "5rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: "1rem" }}>
            <span style={{ fontSize: 12 }}>🚀</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em" }}>Starting a business</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Thinking about starting a business?
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
            Get oriented in under 2 minutes — understand your structure, what to register, and what you can safely leave for later.
          </p>
        </div>

        {/* How it works */}
        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>How it works</p>
          <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
            <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: "linear-gradient(90deg, #a7f3d0, #6ee7b7, #a7f3d0)", zIndex: 0 }} />
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 10, boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}>{step.emoji}</div>
                <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.4, padding: "0 4px" }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 4px 24px rgba(16,185,129,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>What you get</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "#f0fdf4", borderRadius: 12, padding: "10px 14px", border: "1px solid #d1fae5" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{b.emoji}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{b.title}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem("businessQuestionState");
            sessionStorage.removeItem("businessAnswers");
            router.push("/business/questions");
          }}
          style={{ width: "100%", padding: "15px 24px", borderRadius: 16, background: "linear-gradient(135deg, #059669, #10b981)", border: "none", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(16,185,129,0.35)", marginBottom: "0.75rem", transition: "opacity 0.15s ease" }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
        >
          Help me get oriented
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>No sign-up. No advice. No pressure. Takes 2 minutes.</p>

      </div>
    </main>
  );
}
