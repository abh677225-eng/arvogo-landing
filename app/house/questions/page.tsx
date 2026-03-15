"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredState = {
  answers: (string | null)[];
  index: number;
};

const questions = [
  {
    text: "Why are you thinking about buying a house?",
    options: [
      "I want something more permanent",
      "Something in my life is changing",
      "I feel pressure to consider it",
      "I'm not really sure",
    ],
  },
  {
    text: "Does buying feel time-sensitive right now?",
    options: [
      "No — I'm just exploring",
      "A little — there's a loose timeline",
      "Yes — there's a real deadline",
      "I'm not sure",
    ],
  },
  {
    text: "How settled does the rest of your life feel right now?",
    options: [
      "Pretty settled",
      "In transition",
      "Uncertain",
      "Hard to say",
    ],
  },
  {
    text: "How far have you gone so far?",
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

  useEffect(() => {
    const raw = sessionStorage.getItem("houseQuestionState");
    if (!raw) return;
    const parsed: StoredState = JSON.parse(raw);
    // Only restore if genuinely mid-flow, not at the end
    if (parsed.index < questions.length - 1) {
      setAnswers(parsed.answers);
      setIndex(parsed.index);
    } else {
      // Clear stale completed state so flow starts fresh
      sessionStorage.removeItem("houseQuestionState");
    }
  }, []);

  const q = questions[index];
  const selected = answers[index];
  const progress = ((index + 1) / questions.length) * 100;

  function persist(nextAnswers: (string | null)[], nextIndex: number) {
    sessionStorage.setItem(
      "houseQuestionState",
      JSON.stringify({ answers: nextAnswers, index: nextIndex })
    );
  }

  function advance(option: string) {
    const nextAnswers = [...answers];
    nextAnswers[index] = option;

    if (index < questions.length - 1) {
      const nextIndex = index + 1;
      setAnswers(nextAnswers);
      setIndex(nextIndex);
      persist(nextAnswers, nextIndex);
    } else {
      sessionStorage.setItem("houseAnswers", JSON.stringify(nextAnswers));
      sessionStorage.removeItem("houseQuestionState");
      router.push("/house/position");
    }
  }

  function handleBack() {
    if (index === 0) {
      router.push("/house");
      return;
    }
    const nextIndex = index - 1;
    setIndex(nextIndex);
    persist(answers, nextIndex);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-2xl bg-white p-10 shadow-sm space-y-8">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Question {index + 1} of {questions.length}
            </p>
            <button
              onClick={handleBack}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <h1 className="text-2xl font-semibold leading-snug">
            {q.text}
          </h1>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((o) => {
              const isSelected = selected === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => advance(o)}
                  className={`w-full text-left rounded-xl border p-4 text-sm transition-colors
                    ${isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  {o}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-400 text-center">
            No sign-up. No advice. No pressure.
          </p>

        </div>
      </div>
    </main>
  );
}
