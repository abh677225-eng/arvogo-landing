"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type StoredState = {
  answers: (string | null)[];
  index: number;
};

const questions = [
  {
    text: "Why are you thinking about buying a house?",
    subtext: "There's no right answer — we just want to understand where this is coming from.",
    emoji: "🏠",
    options: [
      "I want something more permanent",
      "Something in my life is changing",
      "I feel pressure to consider it",
      "I'm not really sure",
    ],
  },
  {
    text: "Does buying feel time-sensitive right now?",
    subtext: "This helps us understand how much runway you have.",
    emoji: "⏳",
    options: [
      "No — I'm just exploring",
      "A little — there's a loose timeline",
      "Yes — there's a real deadline",
      "I'm not sure",
    ],
  },
  {
    text: "How settled does the rest of your life feel right now?",
    subtext: "Big decisions are easier when the rest of life feels stable.",
    emoji: "🌿",
    options: [
      "Pretty settled",
      "In transition",
      "Uncertain",
      "It's complicated",
    ],
  },
  {
    text: "How far have you gone so far?",
    subtext: "Just so we know which stage to orient you from.",
    emoji: "📍",
    options: [
      "I haven't started yet",
      "I've been browsing a bit",
      "I'm actively looking",
      "I'm already making offers",
    ],
  },
];

export default function HouseQuestions() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("houseQuestionState");
    if (!raw) return;
    const parsed: StoredState = JSON.parse(raw);
    if (parsed.index < questions.length - 1) {
      setAnswers(parsed.answers);
      setIndex(parsed.index);
    } else {
      sessionStorage.removeItem("houseQuestionState");
    }
  }, []);

  const q = questions[index];
  const progress = ((index + 1) / questions.length) * 100;

  function persist(nextAnswers: (string | null)[], nextIndex: number) {
    sessionStorage.setItem(
      "houseQuestionState",
      JSON.stringify({ answers: nextAnswers, index: nextIndex })
    );
  }

  function advance(option: string) {
    if (animating) return;
    setSelectedOption(option);

    setTimeout(() => {
      const nextAnswers = [...answers];
      nextAnswers[index] = option;

      if (index < questions.length - 1) {
        setAnimating(true);
        setDirection("forward");
        setVisible(false);
        setTimeout(() => {
          const nextIndex = index + 1;
          setAnswers(nextAnswers);
          setIndex(nextIndex);
          setSelectedOption(null);
          persist(nextAnswers, nextIndex);
          setVisible(true);
          setAnimating(false);
        }, 320);
      } else {
        sessionStorage.setItem("houseAnswers", JSON.stringify(nextAnswers));
        sessionStorage.removeItem("houseQuestionState");
        setAnimating(true);
        setVisible(false);
        setTimeout(() => router.push("/house/position"), 320);
      }
    }, 280);
  }

  function handleBack() {
    if (animating) return;
    if (index === 0) {
      router.push("/house");
      return;
    }
    setAnimating(true);
    setDirection("back");
    setVisible(false);
    setTimeout(() => {
      const nextIndex = index - 1;
      setIndex(nextIndex);
      setSelectedOption(null);
      persist(answers, nextIndex);
      setVisible(true);
      setAnimating(false);
    }, 320);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: `
        radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
        #eef2ff
      `,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", padding: "0 0.25rem" }}>
          <button onClick={handleBack} style={{
            background: "none", border: "none", fontSize: 13, color: "#64748b",
            cursor: "pointer", padding: "6px 0", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ← Back
          </button>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
            {index + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: "#e2e8f0", borderRadius: 99,
          marginBottom: "2rem", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            borderRadius: 99, transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>

        {/* Card */}
        <div
          ref={containerRef}
          style={{
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
            borderRadius: 24, padding: "2.5rem",
            boxShadow: "0 4px 40px rgba(99,102,241,0.08), 0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid rgba(255,255,255,0.9)",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : direction === "forward"
              ? "translateY(16px) scale(0.98)"
              : "translateY(-16px) scale(0.98)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Emoji badge */}
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, marginBottom: "1.25rem",
          }}>
            {q.emoji}
          </div>

          {/* Question */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.3,
            marginBottom: "0.5rem", letterSpacing: "-0.01em",
          }}>
            {q.text}
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 13, color: "#94a3b8", lineHeight: 1.6,
            marginBottom: "1.75rem",
          }}>
            {q.subtext}
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((option) => {
              const isSelected = selectedOption === option;
              const isPrevSelected = answers[index] === option && selectedOption === null;
              return (
                <button
                  key={option}
                  onClick={() => advance(option)}
                  disabled={animating}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "14px 18px", borderRadius: 14,
                    border: isSelected ? "2px solid #6366f1" : isPrevSelected ? "2px solid #c7d2fe" : "2px solid #f1f5f9",
                    background: isSelected
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : isPrevSelected ? "#eef2ff" : "#f8fafc",
                    color: isSelected ? "#ffffff" : isPrevSelected ? "#4338ca" : "#334155",
                    fontSize: 15, fontWeight: isSelected ? 500 : 400,
                    cursor: animating ? "default" : "pointer",
                    fontFamily: "inherit",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    transform: isSelected ? "scale(0.99)" : "scale(1)",
                    transition: "all 0.15s ease",
                    boxShadow: isSelected ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
                  }}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, flexShrink: 0,
                    }}>✓</span>
                  )}
                  {isPrevSelected && !isSelected && (
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "#c7d2fe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#4338ca", flexShrink: 0,
                    }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: "1.5rem" }}>
          No sign-up. No advice. No pressure.
        </p>

      </div>
    </main>
  );
}
