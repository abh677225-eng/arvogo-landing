"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HouseQuestions() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const questions = [
    {
      text: "Are you planning to buy on your own, or with someone else?",
      options: ["On my own", "With a partner", "With someone else", "Not sure yet"],
    },
    {
      text: "Is this home mainly for you to live in, or as an investment?",
      options: ["To live in", "As an investment", "Not sure yet"],
    },
    {
      text: "Which best describes where you are right now?",
      options: [
        "Just exploring",
        "Thinking about buying in the next year",
        "Looking seriously",
        "Already making offers",
      ],
    },
    {
      text: "Do you already have savings set aside for a deposit?",
      options: ["Yes", "Not yet", "Not sure"],
    },
  ];

  const q = questions[index];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <p className="text-sm text-slate-500">
            Question {index + 1} of {questions.length}
          </p>

          <div className="mt-6 space-y-8">
            <h1 className="text-2xl font-semibold">{q.text}</h1>

            <div className="space-y-3">
              {q.options.map((o) => (
                <label
                  key={o}
                  className={`block rounded-xl border p-4 cursor-pointer transition-colors
                    ${
                      selected === o
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={selected === o}
                    onChange={() => setSelected(o)}
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={!selected}
            onClick={() =>
              index < questions.length - 1
                ? (setIndex(index + 1), setSelected(null))
                : router.push("/house/position")
            }
            className={`mt-10 rounded-xl px-6 py-3 text-white font-medium
              ${
                selected
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
          >
            Continue
          </button>
        </div>

      </div>
    </main>
  );
}
