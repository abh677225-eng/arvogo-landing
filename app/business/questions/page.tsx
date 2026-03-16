"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 15% 25%, rgba(16,185,129,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 75%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 15%, rgba(245,158,11,0.12) 0%, transparent 50%),
  radial-gradient(ellipse at 15% 85%, rgba(14,165,233,0.12) 0%, transparent 50%),
  #f0fdf4
`;

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

const QUESTIONS = [
  {
    key: "stage",
    text: "Where are you with starting your business?",
    subtext: "There's no wrong answer — this helps us understand what stage you're at.",
    emoji: "🚀",
    type: "list",
    options: [
      "I have an idea but haven't started",
      "I'm researching and planning",
      "I'm ready to register and set up",
      "I've already started trading",
    ],
  },
  {
    key: "type",
    text: "What kind of business is it?",
    subtext: "This affects which structure makes sense and what registrations you'll need.",
    emoji: "💼",
    type: "grid",
    options: ["🛠 Trade / labour", "💻 Service / consulting", "📦 Products / retail", "🌐 Online only"],
  },
  {
    key: "employees",
    text: "Will you have employees?",
    subtext: "This affects your structure, insurance obligations, and payroll requirements.",
    emoji: "👥",
    type: "list",
    options: [
      "Just me — sole operator",
      "Maybe later — starting solo",
      "Yes — hiring from day one",
    ],
  },
  {
    key: "state",
    text: "Which state are you operating in?",
    subtext: "Some licences, permits and obligations vary by state.",
    emoji: "📍",
    type: "grid",
    options: STATES,
  },
];

type StoredState = { answers: (string | null)[]; index: number };

export default function BusinessQuestions() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, null]);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("businessQuestionState");
    if (!raw) return;
    const parsed: StoredState = JSON.parse(raw);
    if (parsed.index < QUESTIONS.length - 1) {
      setAnswers(parsed.answers);
      setIndex(parsed.index);
    } else {
      sessionStorage.removeItem("businessQuestionState");
    }
  }, []);

  const q = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;

  function persist(nextAnswers: (string | null)[], nextIndex: number) {
    sessionStorage.setItem("businessQuestionState", JSON.stringify({ answers: nextAnswers, index: nextIndex }));
  }

  function advance(option: string) {
    if (animating) return;
    setSelectedOption(option);
    setTimeout(() => {
      const nextAnswers = [...answers];
      nextAnswers[index] = option;
      const isLast = index >= QUESTIONS.length - 1;
      if (!isLast) {
        setAnimating(true); setDirection("forward"); setVisible(false);
        setTimeout(() => {
          const nextIndex = index + 1;
          setAnswers(nextAnswers); setIndex(nextIndex); setSelectedOption(null);
          persist(nextAnswers, nextIndex); setVisible(true); setAnimating(false);
        }, 320);
      } else {
        sessionStorage.setItem("businessAnswers", JSON.stringify(nextAnswers));
        sessionStorage.removeItem("businessQuestionState");
        setAnimating(true); setVisible(false);
        setTimeout(() => router.push("/business/position"), 320);
      }
    }, 280);
  }

  function handleBack() {
    if (animating) return;
    if (index === 0) { router.push("/business"); return; }
    setAnimating(true); setDirection("back"); setVisible(false);
    setTimeout(() => {
      const nextIndex = index - 1;
      setIndex(nextIndex); setSelectedOption(null);
      persist(answers, nextIndex); setVisible(true); setAnimating(false);
    }, 320);
  }

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", padding: "0 0.25rem" }}>
          <button onClick={handleBack} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", padding: "6px 0", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{index + 1} / {QUESTIONS.length}</span>
        </div>

        <div style={{ height: 3, background: "#d1fae5", borderRadius: 99, marginBottom: "2rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #059669, #10b981)", borderRadius: 99, transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        </div>

        <div ref={containerRef} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "2.5rem", boxShadow: "0 4px 40px rgba(16,185,129,0.08), 0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.9)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : direction === "forward" ? "translateY(16px) scale(0.98)" : "translateY(-16px) scale(0.98)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>

          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: "1.25rem" }}>{q.emoji}</div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.25rem, 4vw, 1.6rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.3, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{q.text}</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.75rem" }}>{q.subtext}</p>

          {q.type === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: q.key === "state" ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: 8 }}>
              {q.options.map(option => {
                const isSelected = selectedOption === option || answers[index] === option;
                return (
                  <button key={option} onClick={() => advance(option)} disabled={animating} style={{ padding: "12px 8px", borderRadius: 12, border: isSelected ? "2px solid #059669" : "2px solid #f1f5f9", background: isSelected ? "linear-gradient(135deg, #059669, #10b981)" : "#f8fafc", color: isSelected ? "#fff" : "#334155", fontSize: 13, fontWeight: isSelected ? 600 : 500, cursor: animating ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.15s ease", boxShadow: isSelected ? "0 4px 12px rgba(16,185,129,0.3)" : "none" }}>
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
                  <button key={option} onClick={() => advance(option)} disabled={animating} style={{ width: "100%", textAlign: "left", padding: "14px 18px", borderRadius: 14, border: isSelected ? "2px solid #059669" : isPrevSelected ? "2px solid #a7f3d0" : "2px solid #f1f5f9", background: isSelected ? "linear-gradient(135deg, #059669, #10b981)" : isPrevSelected ? "#f0fdf4" : "#f8fafc", color: isSelected ? "#fff" : isPrevSelected ? "#065f46" : "#334155", fontSize: 15, fontWeight: isSelected ? 500 : 400, cursor: animating ? "default" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transform: isSelected ? "scale(0.99)" : "scale(1)", transition: "all 0.15s ease", boxShadow: isSelected ? "0 4px 16px rgba(16,185,129,0.3)" : "none" }}>
                    <span>{option}</span>
                    {(isSelected || isPrevSelected) && (
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: isSelected ? "rgba(255,255,255,0.3)" : "#a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isSelected ? 13 : 12, color: isSelected ? "#fff" : "#065f46", flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>No sign-up. No advice. No pressure.</p>
      </div>
    </main>
  );
}
