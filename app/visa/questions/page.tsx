"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 85%, rgba(14,165,233,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 85%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #f0f4ff
`;

type QuestionDef = {
  key: string;
  text: string;
  subtext: string;
  emoji: string;
  type: "list" | "grid";
  options: string[];
};

const CATEGORY_QUESTIONS: Record<string, QuestionDef[]> = {
  student: [
    {
      key: "level", text: "What level of study are you planning?", subtext: "This determines which requirements and documents apply.", emoji: "🎓", type: "list",
      options: ["University degree (bachelor / masters / PhD)", "VET / TAFE / diploma", "High school (secondary)", "English language course (ELICOS)"],
    },
    {
      key: "offer", text: "Have you received a letter of offer?", subtext: "This affects where you are in the process and what comes next.", emoji: "📄", type: "list",
      options: ["Not yet — still researching institutions", "Yes — I have a conditional or unconditional offer", "I'm already enrolled and need to extend my visa"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
  pr: [
    {
      key: "pathway", text: "Which PR pathway are you considering?", subtext: "Different pathways suit different profiles. We'll help you understand which fits.", emoji: "⭐", type: "list",
      options: ["Skilled independent (189) — no sponsor needed", "State nominated (190) — +5 pts, state commitment", "Regional provisional (491) — +15 pts, regional living", "Employer sponsored (186) — requires job offer", "Not sure yet — help me understand my options"],
    },
    {
      key: "assessed", text: "Have you had your skills assessed?", subtext: "A positive skills assessment is required before you can submit an EOI.", emoji: "📋", type: "list",
      options: ["Yes — I have a positive skills assessment", "In progress — awaiting outcome", "No — not started yet", "Not sure if I need one"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
  visitor: [
    {
      key: "purpose", text: "What is the main purpose of your visit?", subtext: "Visitor visas have different streams depending on your reason.", emoji: "✈️", type: "grid",
      options: ["🏖 Holiday / tourism", "👨‍👩‍👧 Visiting family", "💼 Business meetings", "🏥 Medical treatment"],
    },
    {
      key: "duration", text: "How long do you plan to stay?", subtext: "Standard visitor visas grant up to 3 or 12 months at a time.", emoji: "📅", type: "list",
      options: ["Up to 3 months", "Up to 12 months", "Multiple visits over several years", "Not sure yet"],
    },
    {
      key: "nationality", text: "Are you from an eVisitor or ETA eligible country?", subtext: "Many nationalities can apply online in minutes for short stays.", emoji: "🛂", type: "list",
      options: ["Yes — EU, UK, USA or other eVisitor country", "Yes — passport eligible for ETA (Singapore, Japan, South Korea etc.)", "No — I need to apply for a standard visitor visa (600)", "Not sure"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
  sponsored: [
    {
      key: "offer", text: "Do you have a job offer from an Australian employer?", subtext: "The 482 visa requires sponsorship from an approved employer.", emoji: "💼", type: "list",
      options: ["Yes — my employer is ready to sponsor me", "Not yet — I'm looking for an employer who will sponsor", "My employer has started the process but it's not finalised"],
    },
    {
      key: "stream", text: "Which stream does your occupation fall under?", subtext: "Short-term and medium-term streams have different conditions.", emoji: "🔍", type: "list",
      options: ["Short-term stream (2yr visa, occupation on STSOL)", "Medium-term stream (4yr visa, occupation on MLTSSL)", "Labour agreement stream (special arrangement)", "Not sure — I don't know which list my occupation is on"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
  whv: [
    {
      key: "subclass", text: "Which subclass are you likely eligible for?", subtext: "417 and 462 have different country eligibility. Both allow work and travel.", emoji: "🏄", type: "list",
      options: ["Subclass 417 — UK, Ireland, Canada, France, Germany and most European countries", "Subclass 462 — USA, China, India, Thailand, Vietnam and others", "New Zealand — special category visa (different rules)", "Not sure which subclass applies to me"],
    },
    {
      key: "age", text: "How old are you?", subtext: "Working holiday visas are only available to those aged 18–35 (some countries 18–30).", emoji: "🎂", type: "list",
      options: ["18–30 years old", "31–35 years old", "Under 18", "Over 35"],
    },
    {
      key: "previous", text: "Have you held a working holiday visa for Australia before?", subtext: "Second and third year visas require regional work to be completed first.", emoji: "🔄", type: "list",
      options: ["No — this would be my first", "Yes — I've had one before and want a second year", "Yes — I've had two and want a third year"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
  family: [
    {
      key: "relationship", text: "What is your relationship to your Australian sponsor?", subtext: "The visa type depends entirely on your relationship to the Australian citizen or resident.", emoji: "👨‍👩‍👧", type: "list",
      options: ["Partner / spouse / de facto (subclass 820/801 or 309/100)", "Fiancé(e) — planning to marry in Australia (subclass 300)", "Parent of an Australian citizen or resident", "Child or dependent of an Australian citizen or resident", "Other family member"],
    },
    {
      key: "status", text: "What is your sponsor's status in Australia?", subtext: "Sponsors must be Australian citizens, permanent residents, or eligible NZ citizens.", emoji: "🇦🇺", type: "list",
      options: ["Australian citizen", "Australian permanent resident", "Eligible New Zealand citizen", "Not sure of their exact status"],
    },
      {
      key: "location_current",
      text: "Are you currently in Australia?",
      subtext: "This helps us show you the most relevant resources and connections.",
      emoji: "🇦🇺",
      type: "list" as const,
      options: [
        "Yes — I am currently in Australia",
        "No — I am applying from overseas",
      ],
    },
  ],
};

const CATEGORY_LABELS: Record<string, { title: string; emoji: string; color: string; progressColor: string }> = {
  student:   { title: "Student visa",          emoji: "🎓", color: "#6366f1", progressColor: "linear-gradient(90deg, #6366f1, #8b5cf6)" },
  pr:        { title: "Permanent residency",   emoji: "⭐", color: "#059669", progressColor: "linear-gradient(90deg, #059669, #10b981)" },
  visitor:   { title: "Visitor visa",          emoji: "✈️", color: "#0ea5e9", progressColor: "linear-gradient(90deg, #0ea5e9, #38bdf8)" },
  sponsored: { title: "Employer sponsored",    emoji: "💼", color: "#d97706", progressColor: "linear-gradient(90deg, #d97706, #f59e0b)" },
  whv:       { title: "Working holiday",       emoji: "🏄", color: "#7c3aed", progressColor: "linear-gradient(90deg, #7c3aed, #a78bfa)" },
  family:    { title: "Family visa",           emoji: "👨‍👩‍👧", color: "#db2777", progressColor: "linear-gradient(90deg, #db2777, #ec4899)" },
};

type StoredState = { answers: (string | null)[]; index: number };

export default function VisaQuestions() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("student");
  const [questions, setQuestions] = useState<QuestionDef[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null]);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cat = sessionStorage.getItem("visaCategory") || "student";
    setCategory(cat);
    const qs = CATEGORY_QUESTIONS[cat] || CATEGORY_QUESTIONS.student;
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));

    const raw = sessionStorage.getItem("visaQuestionState");
    if (raw) {
      const parsed: StoredState = JSON.parse(raw);
      if (parsed.index < qs.length - 1) {
        setAnswers(parsed.answers);
        setIndex(parsed.index);
      } else {
        sessionStorage.removeItem("visaQuestionState");
      }
    }
  }, []);

  const catMeta = CATEGORY_LABELS[category] || CATEGORY_LABELS.student;
  const q = questions[index];
  const progress = questions.length > 0 ? ((index + 1) / questions.length) * 100 : 0;

  function persist(nextAnswers: (string | null)[], nextIndex: number) {
    sessionStorage.setItem("visaQuestionState", JSON.stringify({ answers: nextAnswers, index: nextIndex }));
  }

  function advance(option: string) {
    if (animating || !q) return;
    setSelectedOption(option);
    setTimeout(() => {
      const nextAnswers = [...answers];
      nextAnswers[index] = option;
      const isLast = index >= questions.length - 1;
      if (!isLast) {
        setAnimating(true); setDirection("forward"); setVisible(false);
        setTimeout(() => {
          const nextIndex = index + 1;
          setAnswers(nextAnswers); setIndex(nextIndex); setSelectedOption(null);
          persist(nextAnswers, nextIndex); setVisible(true); setAnimating(false);
        }, 320);
      } else {
        sessionStorage.setItem("visaAnswers", JSON.stringify(nextAnswers));
        sessionStorage.removeItem("visaQuestionState");
        setAnimating(true); setVisible(false);
        setTimeout(() => router.push("/visa/position"), 320);
      }
    }, 280);
  }

  function handleBack() {
    if (animating) return;
    if (index === 0) { router.push("/visa"); return; }
    setAnimating(true); setDirection("back"); setVisible(false);
    setTimeout(() => {
      const nextIndex = index - 1;
      setIndex(nextIndex); setSelectedOption(null);
      persist(answers, nextIndex); setVisible(true); setAnimating(false);
    }, 320);
  }

  if (!q) return null;

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <button onClick={handleBack} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: catMeta.color, fontWeight: 600 }}>{catMeta.emoji} {catMeta.title}</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{index + 1} / {questions.length}</span>
          </div>
        </div>

        <div style={{ height: 3, background: "#e2e8f0", borderRadius: 99, marginBottom: "2rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: catMeta.progressColor, borderRadius: 99, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>

        <div ref={containerRef} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "2.5rem", boxShadow: "0 4px 40px rgba(99,102,241,0.08)", border: "1px solid rgba(255,255,255,0.9)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : direction === "forward" ? "translateY(16px) scale(0.98)" : "translateY(-16px) scale(0.98)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>

          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: "1.25rem" }}>{q.emoji}</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.25rem, 4vw, 1.6rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{q.text}</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.75rem" }}>{q.subtext}</p>

          {q.type === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {q.options.map(option => {
                const isSelected = selectedOption === option || answers[index] === option;
                return (
                  <button key={option} onClick={() => advance(option)} disabled={animating} style={{ padding: "14px 10px", borderRadius: 12, border: isSelected ? `2px solid ${catMeta.color}` : "2px solid #f1f5f9", background: isSelected ? `${catMeta.color}15` : "#f8fafc", color: isSelected ? catMeta.color : "#334155", fontSize: 13, fontWeight: isSelected ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s ease", textAlign: "left" }}>
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map(option => {
                const isSelected = selectedOption === option;
                const isPrevSelected = answers[index] === option && selectedOption === null;
                return (
                  <button key={option} onClick={() => advance(option)} disabled={animating} style={{ width: "100%", textAlign: "left", padding: "13px 16px", borderRadius: 14, border: isSelected ? `2px solid ${catMeta.color}` : isPrevSelected ? `2px solid ${catMeta.color}40` : "2px solid #f1f5f9", background: isSelected ? `${catMeta.color}12` : isPrevSelected ? `${catMeta.color}08` : "#f8fafc", color: isSelected ? catMeta.color : isPrevSelected ? catMeta.color : "#334155", fontSize: 14, fontWeight: isSelected || isPrevSelected ? 500 : 400, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "all 0.15s ease" }}>
                    <span>{option}</span>
                    {(isSelected || isPrevSelected) && <span style={{ width: 22, height: 22, borderRadius: "50%", background: catMeta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>General information only — not migration advice. Confirm your situation with a MARA agent.</p>
      </div>
    </main>
  );
}
