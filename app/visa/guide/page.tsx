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

type GuideCategory = { emoji: string; title: string; color: string; gradient: string; overview: string; steps: { emoji: string; title: string; summary: string; detail: string; timeframe: string; cost: string | null }[] };

const GUIDES: Record<string, GuideCategory> = {
  student: {
    emoji: "🎓", title: "Student visa (subclass 500)", color: "#6366f1",
    gradient: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    overview: "Australia's student visa allows you to study at a registered education provider for the duration of your course. Most applications are decided within 4–6 weeks offshore.",
    steps: [
      { emoji: "🏫", title: "Choose your institution and course", summary: "Research registered providers and apply for admission.", detail: "All institutions offering courses to international students must be registered on the Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS). Check at cricos.teqsa.gov.au. Education agents can help with applications at no cost to you — they're paid by institutions.", timeframe: "1–3 months", cost: "Free — agents paid by institutions" },
      { emoji: "📄", title: "Receive your Confirmation of Enrolment (CoE)", summary: "Once you accept your offer and pay fees, your institution issues a CoE.", detail: "Your CoE is the essential document for your visa application. It confirms your enrolment, the duration of your course, and your CRICOS provider code. You cannot apply for a student visa without it.", timeframe: "1–4 weeks after accepting offer", cost: null },
      { emoji: "🏥", title: "Arrange Overseas Student Health Cover (OSHC)", summary: "OSHC is mandatory before lodging your application.", detail: "OSHC covers hospital and medical costs during your stay. It must be purchased from an approved Australian insurer before you apply — not after. Your institution may have a preferred insurer. Cost varies by duration.", timeframe: "Before you lodge", cost: "From ~$600/year" },
      { emoji: "💻", title: "Lodge through ImmiAccount", summary: "Apply online at immi.homeaffairs.gov.au.", detail: "Create an ImmiAccount and complete the application online. You'll upload your CoE, OSHC certificate, financial evidence, academic transcripts, English test results, and a Genuine Temporary Entrant (GTE) statement explaining your study intentions. Application fee: AUD $710 (2025).", timeframe: "Processing: 4–6 weeks offshore", cost: "AUD $710" },
    ],
  },
  pr: {
    emoji: "⭐", title: "Skilled permanent residency", color: "#059669",
    gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    overview: "Australia's points-based skilled migration program offers three main pathways: the independent 189, state-nominated 190, and regional 491. The process is competitive and typically takes 12–24 months from skills assessment to visa grant.",
    steps: [
      { emoji: "📋", title: "Get your skills assessed", summary: "A positive assessment from your relevant authority is required first.", detail: "Every occupation has a designated assessing authority. Engineers go through Engineers Australia, accountants through CPA/ICAA, IT professionals through ACS, and so on. Find yours at immi.homeaffairs.gov.au. Assessment takes 4–12 weeks and costs $300–$1,200 depending on authority.", timeframe: "4–12 weeks", cost: "$300–$1,200" },
      { emoji: "🧮", title: "Calculate your points and choose a pathway", summary: "Minimum 65 points to submit an EOI. 189 typically needs 85–95+.", detail: "Use the Arvogo points calculator to estimate your score across 189, 190 and 491 pathways. If your score is below 85, consider state nomination (190, adds 5 pts) or regional (491, adds 15 pts). Age is the biggest single factor — the 25–32 age band gets the maximum 30 points.", timeframe: "Self-assessment", cost: null },
      { emoji: "🌐", title: "Submit an Expression of Interest (EOI) in SkillSelect", summary: "Create a profile in the Department's SkillSelect system.", detail: "SkillSelect is the online platform where you register your interest in skilled migration. Your EOI is not a visa application — it's an invitation to apply. Round invitations happen regularly; your points score determines when you're invited.", timeframe: "Ongoing — rounds vary", cost: "Free" },
      { emoji: "✉️", title: "Receive invitation and lodge visa application", summary: "Once invited, you have 60 days to lodge the full visa application.", detail: "After receiving an invitation, you lodge the full application including all supporting documents, health examinations, police clearances, and skills evidence. A migration agent can ensure everything is correct — errors cause significant delays.", timeframe: "60 days from invitation", cost: "AUD $4,640 (189/190)" },
    ],
  },
  visitor: {
    emoji: "✈️", title: "Visitor visa (subclass 600 / eVisitor / ETA)", color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
    overview: "Most visitors to Australia can apply online with minimal documentation. The type of visa depends on your nationality — eVisitor (651) and ETA (601) are electronic visas for eligible countries, while subclass 600 is for everyone else.",
    steps: [
      { emoji: "🛂", title: "Check if you need an eVisitor, ETA or 600", summary: "Your nationality determines which visitor visa applies.", detail: "eVisitor (651): Available for EU passport holders, UK, Norway, Iceland, Liechtenstein and Switzerland. Free to apply.\n\nETA (601): Available for passport holders from Singapore, Japan, South Korea, Malaysia, Brunei, Canada, Hong Kong, USA and others. AUD $20 fee.\n\nSubclass 600: Required for all other nationalities. More documentation, longer processing.", timeframe: "Check at immi.homeaffairs.gov.au", cost: null },
      { emoji: "💻", title: "Apply through ImmiAccount or the AusETA app", summary: "eVisitor and ETA applications are fully online.", detail: "eVisitor applications are made through immi.homeaffairs.gov.au and usually processed within minutes. ETA applications can be made through the AusETA mobile app. Subclass 600 applications are also made through ImmiAccount but require more documentation.", timeframe: "Minutes (eVisitor/ETA) to 4–8 weeks (600)", cost: "Free (eVisitor) · AUD $20 (ETA) · AUD $190 (600)" },
    ],
  },
  sponsored: {
    emoji: "💼", title: "Employer sponsored (subclass 482)", color: "#d97706",
    gradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
    overview: "The Temporary Skill Shortage visa (482) allows Australian employers to sponsor overseas workers. The process involves three stages: employer sponsorship, nomination, and your visa application.",
    steps: [
      { emoji: "🏢", title: "Your employer applies for standard business sponsorship", summary: "Only approved sponsors can nominate overseas workers.", detail: "Your employer must be approved as a Standard Business Sponsor before they can nominate you. If they're not already approved, they apply to the Department first. This is your employer's responsibility, not yours. Processing: 1–2 weeks.", timeframe: "1–2 weeks", cost: "Free for employer" },
      { emoji: "📝", title: "Employer lodges a nomination for your position", summary: "The specific role must be nominated and approved.", detail: "Your employer nominates the specific position they want to fill. The occupation must be on either the Short-term Skills Occupation List (STSOL) or Medium and Long-term Strategic Skills List (MLTSSL). Salary must meet or exceed the Temporary Skilled Migration Income Threshold (TSMIT — currently AUD $70,000).", timeframe: "2–4 weeks", cost: "AUD $330 (employer)" },
      { emoji: "📤", title: "You lodge the 482 visa application", summary: "Once nomination is approved, you apply for the visa.", detail: "Your application includes English language evidence, skills assessment (if required for your occupation), work experience documents, and health and character clearances. A migration agent working with you and your employer ensures both the nomination and visa application align correctly.", timeframe: "4–12 weeks", cost: "AUD $3,115" },
    ],
  },
  whv: {
    emoji: "🏄", title: "Working holiday visa (subclass 417 / 462)", color: "#7c3aed",
    gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    overview: "Working holiday visas are among Australia's simplest to apply for. Most applications are processed within 24–72 hours. You can work, travel, and study for short periods for up to 12 months.",
    steps: [
      { emoji: "✅", title: "Check your eligibility", summary: "Must be 18–35 (some countries 18–30) and from an eligible country.", detail: "417: UK, Ireland, Canada, France, Germany, Italy, Netherlands, Sweden and most other European countries, Japan, South Korea, Taiwan and others.\n\n462: USA, China, India, Argentina, Chile, Thailand, Vietnam, Indonesia, Peru and others.\n\nYou must have no dependent children accompanying you.", timeframe: "Immediate", cost: null },
      { emoji: "💻", title: "Apply online through ImmiAccount", summary: "The application takes about 20 minutes.", detail: "Go to immi.homeaffairs.gov.au, create an ImmiAccount, and complete the application. You'll need your passport, answer health and character questions, and pay the application fee. No medical required for most nationalities. Most applications are decided within 24–72 hours.", timeframe: "Processing: 24–72 hours", cost: "AUD $635" },
      { emoji: "🌾", title: "Complete regional work for a second and third year", summary: "88 days (2nd year) or 6 months (3rd year) of specified regional work required.", detail: "Specified work includes agriculture, fishing, mining, construction, and bushfire recovery work in designated regional areas. Your employer must provide payslips showing 88 days / 6 months worked. Apply for your second or third year visa before your current one expires.", timeframe: "During your first visa year", cost: "AUD $635 (same fee)" },
    ],
  },
  family: {
    emoji: "👨‍👩‍👧", title: "Family visa", color: "#db2777",
    gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
    overview: "Family visas have some of the longest processing times in Australia's migration program — partner visas currently take 24–48 months. Planning early and having correct documentation from the start significantly impacts outcomes.",
    steps: [
      { emoji: "💑", title: "Partner visas (820/801 and 309/100)", summary: "A two-stage process — temporary first, permanent second.", detail: "Onshore applicants apply for 820 (temporary) which converts to 801 (permanent) after 2 years. Offshore applicants apply for 309 (temporary) converting to 100 (permanent). Both require evidence of a genuine ongoing relationship: photos, communications, financial ties, and statutory declarations from people who know you as a couple.", timeframe: "24–48 months", cost: "AUD $8,850" },
      { emoji: "💍", title: "Prospective marriage visa (300)", summary: "Allows you to travel to Australia to marry within 9 months.", detail: "After marrying, you apply for a partner visa (820/801) to remain permanently. The 300 itself takes 18–28 months to process. You must intend to marry within 9 months of arriving — and actually do so.", timeframe: "18–28 months for 300 visa", cost: "AUD $8,850" },
      { emoji: "📋", title: "Build your evidence file from day one", summary: "The most common cause of delays and refusals is insufficient relationship evidence.", detail: "Start collecting evidence as early as possible: joint bank statements, utility bills, lease agreements, photos with dates, chat histories, travel records, and statutory declarations from friends and family. The more evidence, the stronger the application.", timeframe: "Ongoing", cost: null },
    ],
  },
};

function StepCard({ step, color }: { step: GuideCategory["steps"][0]; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${color}cc, ${color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 12px ${color}40` }}>{step.emoji}</div>
        <div style={{ width: 2, flex: 1, minHeight: 16, background: `linear-gradient(${color}40, #e2e8f0)`, margin: "4px 0" }} />
      </div>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.9)", padding: "1rem 1.25rem", marginBottom: 4, boxShadow: "0 2px 12px rgba(99,102,241,0.04)" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{step.title}</h2>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>{step.summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>⏱ {step.timeframe}</span>
          {step.cost && <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: step.cost.toLowerCase().startsWith("free") ? "#f0fdf4" : "#fff7ed", color: step.cost.toLowerCase().startsWith("free") ? "#16a34a" : "#ea580c", border: `1px solid ${step.cost.toLowerCase().startsWith("free") ? "#bbf7d0" : "#fed7aa"}` }}>💰 {step.cost}</span>}
        </div>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", padding: 0, fontSize: 12, color: "#6366f1", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>{open ? "Show less ↑" : "Read more ↓"}</button>
        {open && <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.85)", border: "1px solid #e2e8f0" }}>
          {step.detail.split("\n\n").map((para, i, arr) => <p key={i} style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: i < arr.length - 1 ? "0 0 10px" : "0" }}>{para.split("\n").map((line, j, lines) => <span key={j}>{line}{j < lines.length - 1 && <br />}</span>)}</p>)}
        </div>}
      </div>
    </div>
  );
}

export default function VisaGuide() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("pr");
  const guide = GUIDES[activeCategory];

  const CATEGORIES = [
    { key: "student", emoji: "🎓", label: "Student" },
    { key: "pr", emoji: "⭐", label: "PR" },
    { key: "visitor", emoji: "✈️", label: "Visitor" },
    { key: "sponsored", emoji: "💼", label: "Sponsored" },
    { key: "whv", emoji: "🏄", label: "WHV" },
    { key: "family", emoji: "👨‍👩‍👧", label: "Family" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Header */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.75rem", marginBottom: "1.5rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", borderRadius: 99, padding: "4px 12px", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 12 }}>🌏</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Visa guide</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 5vw, 2rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Australian visa guide</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem" }}>Plain-English overviews of each visa type — select the category that applies to you.</p>

          {/* Category tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{ padding: "8px 4px", borderRadius: 10, background: activeCategory === cat.key ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8fafc", border: activeCategory === cat.key ? "none" : "1.5px solid #e2e8f0", color: activeCategory === cat.key ? "#fff" : "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "center", transition: "all 0.15s ease", boxShadow: activeCategory === cat.key ? "0 2px 8px rgba(99,102,241,0.3)" : "none" }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{cat.emoji}</div>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active guide */}
        <div style={{ background: guide.gradient, borderRadius: 20, border: "1px solid rgba(255,255,255,0.6)", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: `0 4px 24px ${guide.color}20` }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{guide.emoji}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8 }}>{guide.title}</h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{guide.overview}</p>
        </div>

        <div>{guide.steps.map((step, i) => <StepCard key={i} step={step} color={guide.color} />)}</div>

        {/* Bottom CTAs */}
        <div style={{ background: "linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.95))", backdropFilter: "blur(12px)", borderRadius: 20, border: "1.5px solid rgba(99,102,241,0.15)", padding: "1.5rem", marginTop: "0.5rem", boxShadow: "0 4px 24px rgba(99,102,241,0.08)" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#4338ca", marginBottom: 4 }}>Not sure which category applies to you?</p>
          <p style={{ fontSize: 13, color: "#6366f1", marginBottom: "1rem", lineHeight: 1.6 }}>Answer a few questions and we'll orient you with the right pathway and documents.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/visa" style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>Get oriented in 2 minutes</a>
            {activeCategory === "pr" && <a href="/visa/points" style={{ padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Points calculator 🧮</a>}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          ✦ This guide is for information only and does not constitute migration advice. Visa rules change — confirm details with a MARA-registered migration agent or at immi.homeaffairs.gov.au.
        </p>
      </div>
    </main>
  );
}
