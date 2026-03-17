"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 85%, rgba(14,165,233,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 85%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #f0f4ff
`;

// ── POINTS DATA ────────────────────────────────────────────
// MAINTENANCE: Check immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189
// Points table last verified March 2026

const POINTS_CATEGORIES = [
  {
    key: "age", label: "Age",
    options: [
      { label: "18–24 years", points: 25 },
      { label: "25–32 years", points: 30 },
      { label: "33–39 years", points: 25 },
      { label: "40–44 years", points: 15 },
      { label: "45 years or over", points: 0 },
    ],
  },
  {
    key: "english", label: "English language",
    options: [
      { label: "Competent (IELTS 6 / PTE 50)", points: 0 },
      { label: "Proficient (IELTS 7 / PTE 65)", points: 10 },
      { label: "Superior (IELTS 8 / PTE 79)", points: 20 },
    ],
  },
  {
    key: "overseas_work", label: "Overseas skilled employment",
    hint: "In your nominated occupation, in the past 10 years",
    options: [
      { label: "Less than 3 years", points: 0 },
      { label: "3–4 years", points: 5 },
      { label: "5–7 years", points: 10 },
      { label: "8–10 years", points: 15 },
    ],
  },
  {
    key: "australian_work", label: "Australian skilled employment",
    hint: "In your nominated occupation, in the past 10 years",
    options: [
      { label: "None", points: 0 },
      { label: "1–2 years", points: 5 },
      { label: "3–4 years", points: 10 },
      { label: "5–7 years", points: 15 },
      { label: "8–10 years", points: 20 },
    ],
  },
  {
    key: "education", label: "Educational qualifications",
    options: [
      { label: "None of the below", points: 0 },
      { label: "Diploma or trade qualification", points: 10 },
      { label: "Bachelor degree", points: 15 },
      { label: "Doctorate (PhD)", points: 20 },
    ],
  },
  {
    key: "australian_study", label: "Australian study requirement",
    hint: "At least 2 years full-time study in a degree/diploma in Australia",
    options: [
      { label: "No", points: 0 },
      { label: "Yes", points: 5 },
    ],
  },
  {
    key: "specialist_education", label: "Specialist education qualification",
    hint: "Masters by research or Doctorate in STEM, agriculture, health, or education",
    options: [
      { label: "No", points: 0 },
      { label: "Yes", points: 10 },
    ],
  },
  {
    key: "partner", label: "Partner skills / status",
    options: [
      { label: "Partner with competent English + skilled assessment", points: 10 },
      { label: "Partner with superior English (no skills requirement)", points: 10 },
      { label: "No partner or partner is Australian citizen/PR", points: 10 },
      { label: "Single or partner not meeting requirements", points: 0 },
    ],
    hint: "10 pts if partner has skills assessment + competent English, OR you are single/partner is citizen/PR",
  },
  {
    key: "professional_year", label: "Professional Year in Australia",
    hint: "Completed a Professional Year program in accounting, IT, or engineering",
    options: [
      { label: "No", points: 0 },
      { label: "Yes", points: 5 },
    ],
  },
  {
    key: "naati", label: "Credentialled community language",
    hint: "NAATI accreditation in a community language",
    options: [
      { label: "No", points: 0 },
      { label: "Yes", points: 5 },
    ],
  },
  {
    key: "regional_study", label: "Study in regional Australia",
    hint: "At least 2 academic years of study in a regional area",
    options: [
      { label: "No", points: 0 },
      { label: "Yes", points: 5 },
    ],
  },
];

const DEFAULTS: Record<string, number> = {
  age: 30,
  english: 10,
  overseas_work: 10,
  australian_work: 5,
  education: 15,
  australian_study: 0,
  specialist_education: 0,
  partner: 10,
  professional_year: 0,
  naati: 0,
  regional_study: 0,
};

function getViabilityLabel(baseScore: number, visaBonus: number): { label: string; color: string; bg: string; border: string; detail: string } {
  const total = baseScore + visaBonus;
  if (total >= 90) return { label: "✅ Strong", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", detail: "Competitive for invitation in most rounds." };
  if (total >= 80) return { label: "⚠ Possible", color: "#d97706", bg: "#fffbeb", border: "#fde68a", detail: "May receive invitation — monitor SkillSelect closely." };
  if (total >= 65) return { label: "🟡 Eligible", color: "#b45309", bg: "#fefce8", border: "#fef08a", detail: "Meets minimum but invitations are unlikely at this score." };
  return { label: "❌ Below minimum", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", detail: "Below the 65-point minimum to submit an EOI." };
}

export default function VisaPointsCalculator() {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>(DEFAULTS);

  const baseScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const score189 = baseScore;
  const score190 = baseScore + 5;
  const score491 = baseScore + 15;

  const v189 = getViabilityLabel(baseScore, 0);
  const v190 = getViabilityLabel(baseScore, 5);
  const v491 = getViabilityLabel(baseScore, 15);

  const pct = Math.min((baseScore / 100) * 100, 100);
  const barColor = baseScore >= 90 ? "#059669" : baseScore >= 80 ? "#d97706" : baseScore >= 65 ? "#6366f1" : "#ef4444";

  function fmt(n: number) { return "$" + n.toLocaleString("en-AU"); }

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 12 }}>🧮</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>PR Points Calculator</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            How many points do you have?
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
            Adjust each category to match your profile. Your score updates live across all three skilled visa pathways.
          </p>
        </div>

        {/* Live score hero */}
        <div style={{ borderRadius: 24, padding: "1.75rem", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", border: "1px solid rgba(255,255,255,0.6)", marginBottom: "1rem", boxShadow: "0 8px 32px rgba(99,102,241,0.12)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Your base points score</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>{baseScore}</p>
            <span style={{ fontSize: 16, color: "#64748b" }}>points</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: baseScore >= 65 ? "#d1fae5" : "#fee2e2", color: baseScore >= 65 ? "#059669" : "#ef4444", border: `1px solid ${baseScore >= 65 ? "#a7f3d0" : "#fca5a5"}`, marginLeft: "auto" }}>
              {baseScore >= 65 ? "✓ Meets minimum" : "✗ Below minimum (65)"}
            </span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.4)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 99, transition: "width 0.4s ease, background 0.3s ease" }} />
          </div>
          <p style={{ fontSize: 12, color: "#6d28d9", margin: 0 }}>Minimum 65 to submit EOI · Most 189 invitations: 85–95+</p>
        </div>

        {/* Visa pathway comparison */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>How your score compares across visa types</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "189 Skilled Independent", score: score189, bonus: 0, viability: v189, note: "No sponsor needed. Highest competition." },
              { label: "190 State Nominated", score: score190, bonus: 5, viability: v190, note: "+5 pts. Must commit to state for 2 years." },
              { label: "491 Regional (Provisional)", score: score491, bonus: 15, viability: v491, note: "+15 pts. 5yr provisional → 191 permanent. Regional living required." },
            ].map(v => (
              <div key={v.label} style={{ background: v.viability.bg, borderRadius: 14, padding: "0.875rem 1rem", border: `1px solid ${v.viability.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}>{v.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {v.bonus > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", background: "#eef2ff", padding: "1px 6px", borderRadius: 99, border: "1px solid #c7d2fe" }}>+{v.bonus} pts</span>}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.7)", color: v.viability.color }}>{v.viability.label}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 3px" }}>{v.note}</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: v.viability.color, margin: 0 }}>Total: {v.score} pts — {v.viability.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
              ✦ Check if your occupation is on the skills list at{" "}
              <a href="https://www.immi.homeaffairs.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>immi.homeaffairs.gov.au</a>
            </p>
          </div>
        </div>

        {/* Points breakdown inputs */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Adjust your profile</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {POINTS_CATEGORIES.map((cat, i) => (
              <div key={cat.key} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: i < POINTS_CATEGORIES.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", margin: "0 0 1px" }}>{cat.label}</p>
                  {cat.hint && <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>{cat.hint}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <select
                    value={scores[cat.key]}
                    onChange={e => setScores(prev => ({ ...prev, [cat.key]: parseInt(e.target.value) }))}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 12, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none", maxWidth: 160 }}
                  >
                    {cat.options.map(opt => (
                      <option key={opt.label} value={opt.points}>{opt.label}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: 13, fontWeight: 700, color: scores[cat.key] > 0 ? "#6366f1" : "#94a3b8", minWidth: 36, textAlign: "right" }}>
                    {scores[cat.key] > 0 ? `+${scores[cat.key]}` : "0"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Running total */}
          <div style={{ marginTop: "1rem", background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", borderRadius: 14, padding: "12px 16px", border: "1px solid #c7d2fe" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4338ca" }}>Total base points</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#4338ca" }}>{baseScore}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer + CTA */}
        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.8)", marginBottom: "1rem" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
            ✦ Estimates only. Points tables are updated periodically by the Department of Home Affairs. Confirm your exact score with a MARA-registered migration agent.
          </p>
        </div>

        <a href="/visa/nextstep" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", borderRadius: 16, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 10, boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
          Talk to a migration agent about my score 🤝
        </a>

        <button onClick={() => router.push("/visa/guide")} style={{ width: "100%", padding: "12px", borderRadius: 16, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          See the full PR pathway guide →
        </button>

      </div>
    </main>
  );
}
