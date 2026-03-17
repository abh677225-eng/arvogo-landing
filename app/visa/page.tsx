"use client";

import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 85%, rgba(14,165,233,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 85%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #f0f4ff
`;

const CATEGORIES = [
  { key: "student",    emoji: "🎓", title: "Student",             desc: "Study at an Australian institution",         vol: "~157k arrivals/yr",  color: "#6366f1" },
  { key: "pr",         emoji: "⭐", title: "Permanent residency", desc: "Skilled, family or employer pathway",         vol: "185k places/yr",     color: "#059669" },
  { key: "visitor",    emoji: "✈️", title: "Visitor / tourist",   desc: "Holiday, business visit or family stay",     vol: "~629k holders",      color: "#0ea5e9" },
  { key: "sponsored",  emoji: "💼", title: "Employer sponsored",  desc: "Work visa via job offer (subclass 482)",     vol: "~46k arrivals/yr",   color: "#d97706" },
  { key: "whv",        emoji: "🏄", title: "Working holiday",     desc: "Work and travel (subclass 417 / 462)",       vol: "~78k arrivals/yr",   color: "#7c3aed" },
  { key: "family",     emoji: "👨‍👩‍👧", title: "Family",            desc: "Partner, parent, child or carer visa",       vol: "52k places/yr",      color: "#db2777" },
];

const benefits = [
  { emoji: "📋", title: "Understand your pathway", desc: "See exactly what applies to your category and situation" },
  { emoji: "🧮", title: "Points calculator for PR", desc: "Interactive tool showing your score across all skilled visas" },
  { emoji: "🤝", title: "Connect with a migration agent", desc: "MARA-registered agents who know your specific visa type" },
];

export default function VisaEntry() {
  const router = useRouter();

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "5rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
          ← Back
        </button>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: "1rem" }}>
            <span style={{ fontSize: 12 }}>🌏</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Australian visa guide</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Applying for an Australian visa?
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>
            Every visa journey is different. Select your category and we'll show you exactly where you are, what comes next, and who can help.
          </p>
        </div>

        {/* Category grid */}
        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Select your visa category</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  sessionStorage.setItem("visaCategory", cat.key);
                  sessionStorage.removeItem("visaAnswers");
                  sessionStorage.removeItem("visaQuestionState");
                  router.push("/visa/questions");
                }}
                style={{ textAlign: "left", padding: "1rem", borderRadius: 14, border: "1.5px solid #f1f5f9", background: "#f8fafc", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = cat.color; (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#f1f5f9"; (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>{cat.emoji}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 2px" }}>{cat.title}</p>
                <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 6px", lineHeight: 1.4 }}>{cat.desc}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: cat.color, margin: 0 }}>{cat.vol}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>What you get</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ display: "flex", alignItems: "center", gap: 12, background: "#eef2ff", borderRadius: 12, padding: "10px 14px", border: "1px solid #e0e7ff" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{b.emoji}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{b.title}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>No sign-up. No advice. No pressure. Takes 2 minutes.</p>

      </div>
    </main>
  );
}
