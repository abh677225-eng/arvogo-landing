"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 85%, rgba(14,165,233,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 85%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #f0f4ff
`;

type PositionData = {
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
};

function mapToPosition(category: string, answers: (string | null)[]): PositionData {
  const a0 = answers[0] || "";
  const a1 = answers[1] || "";
  const a2 = answers[2] || "";

  if (category === "student") {
    if (a1.includes("already enrolled")) return {
      emoji: "🔄", title: "Extending your student visa", tagline: "You're already here — extending is simpler than your original application.",
      gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)", accent: "#7c3aed",
      nextTitle: "Lodge your extension before your current visa expires",
      nextText: "You must apply for an extension before your current visa expires — not after. Log into ImmiAccount and check your current visa expiry date today. If you're within 28 days of expiry, this is urgent. Your education provider can issue a new CoE if your study period has changed.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
    if (a1.includes("conditional or unconditional offer")) return {
      emoji: "📋", title: "Ready to apply", tagline: "You have an offer — now it's about gathering the right documents.",
      gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)", accent: "#2563eb",
      nextTitle: "Gather your documents and lodge through ImmiAccount",
      nextText: "With your CoE (Confirmation of Enrolment) in hand, the application is straightforward. You'll need proof of financial capacity, health insurance (OSHC), English language results, and a valid passport. Most student visa applications are decided within 4–6 weeks offshore.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
    return {
      emoji: "🔍", title: "Still researching", tagline: "You haven't chosen an institution yet — that's the right place to start.",
      gradient: "linear-gradient(135deg, #e0f2fe, #bae6fd)", accent: "#0ea5e9",
      nextTitle: "Find an institution before you think about the visa",
      nextText: "You cannot apply for a student visa without a Confirmation of Enrolment (CoE) from a registered Australian institution. Focus on choosing your institution and course first. Once you have your CoE, the visa application itself is relatively straightforward.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
  }

  if (category === "pr") {
    if (a1.includes("positive skills assessment")) return {
      emoji: "🧮", title: "Ready to calculate your points", tagline: "You have your skills assessed — now let's see where your profile sits.",
      gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)", accent: "#059669",
      nextTitle: "Use the points calculator and choose your best pathway",
      nextText: "With a positive skills assessment you can now calculate your exact points score and compare across the 189, 190 and 491 visa types. Most 189 invitations currently require 85–95+ points. If you're below 85, state nomination (190) or regional (491) pathways may be more achievable.",
      nextCTA: "Calculate my points →", secondaryCTA: "Talk to a migration agent", secondaryHref: "/visa/nextstep",
    };
    if (a1.includes("In progress") || a1.includes("Not sure")) return {
      emoji: "📋", title: "Getting your skills assessed", tagline: "A positive skills assessment is the essential first step for skilled PR.",
      gradient: "linear-gradient(135deg, #fef3c7, #fde68a)", accent: "#d97706",
      nextTitle: "Find your assessing authority and start the process",
      nextText: "Before you can submit an Expression of Interest (EOI) in SkillSelect, you need a positive skills assessment from the relevant authority for your occupation. This takes 4–12 weeks depending on the authority. Check which authority assesses your occupation at immi.homeaffairs.gov.au.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
    return {
      emoji: "🗺", title: "Exploring your PR options", tagline: "Let's work out which PR pathway suits your situation.",
      gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)", accent: "#7c3aed",
      nextTitle: "Start with a skills assessment and a points estimate",
      nextText: "The first step for most skilled PR pathways is having your occupation skills assessed by the relevant authority. While that's underway, calculate your likely points score — this will tell you whether 189, 190 or 491 is the most realistic pathway for you.",
      nextCTA: "Calculate my points →", secondaryCTA: "Talk to a migration agent", secondaryHref: "/visa/nextstep",
    };
  }

  if (category === "visitor") {
    if (a2.includes("eVisitor") || a2.includes("ETA")) return {
      emoji: "⚡", title: "You can apply online quickly", tagline: "Your passport is eligible for an electronic visa — this takes minutes.",
      gradient: "linear-gradient(135deg, #e0f2fe, #bae6fd)", accent: "#0ea5e9",
      nextTitle: "Apply online through ImmiAccount — no agent needed",
      nextText: "eVisitor (subclass 651) and ETA (subclass 601) applications are free or low cost, entirely online, and usually processed within minutes to 24 hours. You do not need a migration agent for this. You'll need a valid passport, a credit card for the application fee (ETA only — $20), and basic travel details.",
      nextCTA: "See what you need →", secondaryCTA: null, secondaryHref: null,
    };
    return {
      emoji: "📋", title: "Applying for a visitor visa (600)", tagline: "Your situation requires a standard visitor visa application.",
      gradient: "linear-gradient(135deg, #dbeafe, #bfdbfe)", accent: "#2563eb",
      nextTitle: "Gather your documents and apply through ImmiAccount",
      nextText: "The subclass 600 visitor visa requires evidence of your ties to your home country (property, employment, family), financial capacity to support your stay, and your intended itinerary. Processing times vary from 1–8 weeks. A migration agent can help if your situation is complex.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
  }

  if (category === "sponsored") {
    if (a0.includes("My employer has started") || a0.includes("ready to sponsor")) return {
      emoji: "⚡", title: "Your sponsorship is in motion", tagline: "Your employer is ready — now it's about lodging the right way.",
      gradient: "linear-gradient(135deg, #fef3c7, #fde68a)", accent: "#d97706",
      nextTitle: "Work with your employer and a migration agent to lodge correctly",
      nextText: "The 482 visa involves three stages: employer sponsorship approval, nomination of your position, and your visa application. These can run concurrently. A registered migration agent working with your employer will ensure each stage is lodged correctly — errors cause significant delays.",
      nextCTA: "See what to prepare →", secondaryCTA: "Find a migration agent", secondaryHref: "/visa/nextstep",
    };
    return {
      emoji: "🔍", title: "Finding an employer sponsor", tagline: "The 482 visa requires an approved employer — finding one is your first hurdle.",
      gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)", accent: "#7c3aed",
      nextTitle: "Target employers who are already approved sponsors",
      nextText: "Not all employers can sponsor — they need to be approved by the Department of Home Affairs first. Targeting companies who are already approved sponsors significantly increases your chances. A migration agent can also help you identify whether your occupation is on the eligible occupations list and what salary requirements apply.",
      nextCTA: "See what to prepare →", secondaryCTA: "Find a migration agent", secondaryHref: "/visa/nextstep",
    };
  }

  if (category === "whv") {
    if (a1.includes("Over 35")) return {
      emoji: "❌", title: "Working holiday visa not available", tagline: "Unfortunately working holiday visas are only available to those aged 35 or under.",
      gradient: "linear-gradient(135deg, #fee2e2, #fecaca)", accent: "#ef4444",
      nextTitle: "Consider other temporary work visa options",
      nextText: "At over 35, working holiday visas are not available. Depending on your skills and situation, you may qualify for a Temporary Skill Shortage visa (482) if you have a job offer, or explore other temporary work pathways. A migration agent can assess your options.",
      nextCTA: "Find a migration agent →", secondaryCTA: null, secondaryHref: null,
    };
    if (a2.includes("second year")) return {
      emoji: "🌾", title: "Applying for your second year", tagline: "You need to have completed 88 days of specified regional work to be eligible.",
      gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)", accent: "#059669",
      nextTitle: "Confirm your regional work and apply for the second year",
      nextText: "To be granted a second working holiday visa, you must complete 88 days (3 months) of specified work in a regional area. Your employer must provide a Regional Australia Tax Summary or payslips as evidence. Once confirmed, apply through ImmiAccount before your first visa expires.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
    if (a2.includes("third year")) return {
      emoji: "🌾", title: "Applying for your third year", tagline: "You need 6 months of specified regional work from your second year.",
      gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)", accent: "#059669",
      nextTitle: "Complete your 6 months regional work and lodge the third year application",
      nextText: "A third working holiday visa requires 6 months (179 days) of specified regional work completed during your second visa. The same documentation applies — payslips and employer confirmation. Lodge through ImmiAccount.",
      nextCTA: "See what to prepare →", secondaryCTA: null, secondaryHref: null,
    };
    return {
      emoji: "✅", title: "Ready to apply", tagline: "Working holiday visas are straightforward — this takes under an hour.",
      gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)", accent: "#7c3aed",
      nextTitle: "Apply directly through ImmiAccount — no agent needed",
      nextText: "Working holiday visas (417 and 462) are simple applications you can complete yourself. You'll need your passport, a credit card for the application fee (~$635), and answers to health and character questions. Most applications are decided within 24–72 hours. You do not need a migration agent for this.",
      nextCTA: "See what you need →", secondaryCTA: null, secondaryHref: null,
    };
  }

  if (category === "family") {
    if (a0.includes("Partner")) return {
      emoji: "💑", title: "Partner visa pathway", tagline: "Partner visas are a two-stage process and typically take 24–48 months.",
      gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)", accent: "#db2777",
      nextTitle: "Understand the timeline before you start",
      nextText: "Partner visas are processed in two stages: a temporary visa (820 onshore or 309 offshore) followed by a permanent visa (801 or 100). Processing times are currently 24–48 months. You must demonstrate a genuine ongoing relationship. A migration agent is strongly recommended given the complexity and processing time.",
      nextCTA: "See what to prepare →", secondaryCTA: "Find a migration agent", secondaryHref: "/visa/nextstep",
    };
    if (a0.includes("Fiancé")) return {
      emoji: "💍", title: "Prospective marriage visa (300)", tagline: "You must marry within 9 months of arriving in Australia.",
      gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)", accent: "#db2777",
      nextTitle: "Apply before you travel and set a wedding date",
      nextText: "The prospective marriage visa (subclass 300) allows you to travel to Australia and marry your partner. You must marry within 9 months of arriving. After marrying, you apply for a partner visa (820/801) to stay permanently. Processing for the 300 visa is currently 18–28 months.",
      nextCTA: "See what to prepare →", secondaryCTA: "Find a migration agent", secondaryHref: "/visa/nextstep",
    };
    return {
      emoji: "👨‍👩‍👧", title: "Family visa pathway", tagline: "Family visas vary significantly by relationship type and circumstances.",
      gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)", accent: "#db2777",
      nextTitle: "Get professional advice — family visas are complex",
      nextText: "Family visas have long processing times, high documentation requirements, and strict criteria. A migration agent who specialises in family visas can assess your situation and advise on the most viable pathway for your specific relationship and circumstances.",
      nextCTA: "Find a migration agent →", secondaryCTA: null, secondaryHref: null,
    };
  }

  // Fallback
  return {
    emoji: "📋", title: "Let's get you oriented", tagline: "Based on your answers, here's where to focus.",
    gradient: "linear-gradient(135deg, #eef2ff, #e0e7ff)", accent: "#6366f1",
    nextTitle: "Talk to a registered migration agent",
    nextText: "Your situation has some complexity. A MARA-registered migration agent can assess your specific circumstances and advise on the most appropriate visa pathway.",
    nextCTA: "Find a migration agent →", secondaryCTA: null, secondaryHref: null,
  };
}

const CATEGORY_LABELS: Record<string, { title: string; emoji: string }> = {
  student:   { title: "Student visa",        emoji: "🎓" },
  pr:        { title: "Permanent residency", emoji: "⭐" },
  visitor:   { title: "Visitor visa",        emoji: "✈️" },
  sponsored: { title: "Employer sponsored",  emoji: "💼" },
  whv:       { title: "Working holiday",     emoji: "🏄" },
  family:    { title: "Family visa",         emoji: "👨‍👩‍👧" },
};

export default function VisaPosition() {
  const router = useRouter();
  const [category, setCategory] = useState("student");
  const [position, setPosition] = useState<PositionData | null>(null);
  const [visible, setVisible] = useState(false);
  const [showPR, setShowPR] = useState(false);

  useEffect(() => {
    const cat = sessionStorage.getItem("visaCategory") || "student";
    const raw = sessionStorage.getItem("visaAnswers");
    const answers: (string | null)[] = raw ? JSON.parse(raw) : [];
    setCategory(cat);
    const pos = mapToPosition(cat, answers);
    setPosition(pos);
    setShowPR(cat === "pr" && pos.nextCTA.includes("points"));
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!position) return null;
  const catMeta = CATEGORY_LABELS[category] || CATEGORY_LABELS.student;

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        <button onClick={() => router.push("/visa/questions")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Category badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.8)", borderRadius: 99, padding: "4px 12px", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.9)" }}>
          <span style={{ fontSize: 14 }}>{catMeta.emoji}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{catMeta.title}</span>
        </div>

        {/* Position hero */}
        <div style={{ borderRadius: 24, padding: "2rem", background: position.gradient, border: "1px solid rgba(255,255,255,0.6)", marginBottom: "1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 52, marginBottom: "0.75rem" }}>{position.emoji}</div>
          <p style={{ fontSize: 11, fontWeight: 700, color: position.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Where you are</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 8 }}>{position.title}</h1>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>{position.tagline}</p>
        </div>

        {/* One thing to do next */}
        <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700, flexShrink: 0 }}>1</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>The one thing to do next</p>
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.25rem", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, marginBottom: 10, letterSpacing: "-0.01em" }}>{position.nextTitle}</h2>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{position.nextText}</p>

          <a href={showPR ? "/visa/points" : "/visa/nextstep"} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px 20px", borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(99,102,241,0.3)", marginBottom: position.secondaryCTA ? 10 : 0 }}>
            {position.nextCTA}
          </a>

          {position.secondaryCTA && position.secondaryHref && (
            <a href={position.secondaryHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              {position.secondaryCTA}
            </a>
          )}
        </div>

        <button onClick={() => router.push("/visa/guide")} style={{ width: "100%", padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.8)", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginBottom: "1rem" }}>
          See the full visa application guide →
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>This is orientation, not legal advice. Visa rules change — confirm details with a MARA agent.</p>
      </div>
    </main>
  );
}
