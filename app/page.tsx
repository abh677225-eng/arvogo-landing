"use client";

import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

const decisions = [
  {
    emoji: "🏡",
    title: "Buying your first home",
    description: "Get oriented on what usually comes first, what can wait, and how to avoid common overwhelm.",
    href: "/house",
    available: true,
    tag: "Most popular",
  },
  {
    emoji: "✈️",
    title: "Applying for a visa",
    description: "Understand where to start and how the process usually unfolds.",
    href: null,
    available: false,
    tag: "Coming soon",
  },
  {
    emoji: "💼",
    title: "Changing careers",
    description: "Figure out where you actually stand before making any moves.",
    href: null,
    available: false,
    tag: "Coming soon",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main style={{
      minHeight: "100vh",
      background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "6rem", paddingBottom: "4rem" }}>

        {/* Logo / brand */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            borderRadius: 99,
            padding: "6px 16px 6px 10px",
            border: "1px solid rgba(255,255,255,0.9)",
            marginBottom: "2rem",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>🧭</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#4338ca", letterSpacing: "-0.01em" }}>Arvogo</span>
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 6vw, 2.75rem)",
            fontWeight: 400,
            color: "#1e293b",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
          }}>
            Simplifying life's<br />
            <span style={{ color: "#6366f1" }}>complex decisions</span>
          </h1>

          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 420 }}>
            Understand where you are, what usually comes next, and what you don't need to worry about yet.
          </p>
        </div>

        {/* Decision cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "3rem" }}>
          {decisions.map((d) => (
            <div
              key={d.title}
              onClick={() => d.available && d.href && router.push(d.href)}
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                borderRadius: 20,
                border: d.available ? "1.5px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.7)",
                padding: "1.25rem 1.5rem",
                cursor: d.available ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                boxShadow: d.available ? "0 4px 24px rgba(99,102,241,0.08)" : "none",
                opacity: d.available ? 1 : 0.6,
              }}
              onMouseEnter={e => {
                if (d.available) {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(99,102,241,0.14)";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = d.available ? "0 4px 24px rgba(99,102,241,0.08)" : "none";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: d.available
                  ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
                  : "#f8fafc",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>
                {d.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#1e293b", margin: 0 }}>{d.title}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                    background: d.available ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f1f5f9",
                    color: d.available ? "#fff" : "#94a3b8",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                  }}>
                    {d.tag}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{d.description}</p>
              </div>

              {/* Arrow */}
              {d.available && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 15,
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {["No ads", "No sign-up", "No pressure"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 12 }}>✦</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
