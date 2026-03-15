"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type PositionKey = "exploring" | "considering" | "preparing" | "in-process";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stability = answers[2];
  const execution = answers[3];
  if (execution === "I'm already making offers") return "in-process";
  if (execution === "I'm actively looking") {
    if (stability === "Uncertain" || stability === "Hard to say") return "considering";
    return "preparing";
  }
  if (execution === "I've been browsing a bit") return "considering";
  return "exploring";
}

const ACTIVE_STEP: Record<PositionKey, number> = {
  exploring: 1,
  considering: 2,
  preparing: 3,
  "in-process": 5,
};

type Step = {
  number: number;
  emoji: string;
  title: string;
  summary: string;
  detail: string;
  isLater?: boolean;
};

const STEPS: Step[] = [
  {
    number: 1,
    emoji: "🪞",
    title: "Is buying even the right move?",
    summary: "The real question isn't which home — it's whether ownership fits your life right now.",
    detail: "Reflect on what's prompting the idea. What would ownership actually change? What wouldn't it change? This is orientation, not research.",
  },
  {
    number: 2,
    emoji: "🧭",
    title: "Understand your constraints",
    summary: "Get a loose sense of what feels comfortable, risky, or unrealistic — before any numbers.",
    detail: "Most people do this informally. The goal is to avoid drifting into situations that would clearly feel stressful later.",
  },
  {
    number: 3,
    emoji: "⚖️",
    title: "Know your trade-offs",
    summary: "Every home involves compromises. Know which ones you can live with.",
    detail: "Think through day-to-day life — space, location, commute, flexibility. This isn't about listings yet. It's about knowing yourself.",
  },
  {
    number: 4,
    emoji: "💰",
    title: "Check what's actually possible",
    summary: "Confirm your borrowing capacity and what lenders will look at.",
    detail: "Talk to a broker or use a calculator here — to validate assumptions, not to commit. This is where the numbers get real.",
    isLater: true,
  },
  {
    number: 5,
    emoji: "🏡",
    title: "Inspections and offers",
    summary: "Decisions get concrete and harder to reverse. Move steadily.",
    detail: "Most people reach this point after looping back through earlier steps. The goal is to feel informed, not rushed.",
    isLater: true,
  },
];

function StepCard({
  step,
  isActive,
  isPast,
}: {
  step: Step;
  isActive: boolean;
  isPast: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-4">
      {/* Left column — number + line */}
      <div className="flex flex-col items-center">
        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium
          ${isActive
            ? "bg-indigo-600 text-white"
            : isPast
            ? "bg-indigo-100 text-indigo-500 border border-indigo-200"
            : step.isLater
            ? "bg-white text-slate-300 border border-slate-200"
            : "bg-white text-slate-400 border border-slate-200"
          }`}>
          {isPast ? "✓" : step.number}
        </div>
        <div className="mt-1 w-px flex-1 bg-slate-200 min-h-4" />
      </div>

      {/* Right column — card */}
      <div className={`w-full rounded-2xl border p-5 mb-4
        ${isActive
          ? "border-indigo-200 bg-indigo-50"
          : step.isLater
          ? "border-slate-100 bg-slate-50"
          : "border-slate-200 bg-white"
        }`}>
        <div className="flex items-start gap-3">
          <span style={{ fontSize: 20 }}>{step.emoji}</span>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-medium text-sm ${isActive ? "text-indigo-800" : "text-slate-700"}`}>
                {step.title}
              </p>
              {isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white font-medium">
                  You are here
                </span>
              )}
              {step.isLater && !isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                  Later
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${isActive ? "text-indigo-700" : "text-slate-500"}`}>
              {step.summary}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`mt-3 text-xs hover:underline underline-offset-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
        >
          {open ? "Show less" : "How people approach this"}
        </button>

        {open && (
          <div className="mt-3 rounded-xl bg-white border border-slate-100 p-4">
            <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HousePath() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
  }, []);

  const activeStep = ACTIVE_STEP[position];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        {/* Back */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/house/position")}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Back
          </button>
        </div>

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm mb-6 space-y-1">
          <h1 className="text-2xl font-semibold">Your path forward</h1>
          <p className="text-sm text-slate-500">One step at a time. You don't need to do all of this now.</p>
        </div>

        {/* Steps */}
        <div className="relative">
          {STEPS.map((step) => (
            <StepCard
              key={step.number}
              step={step}
              isActive={step.number === activeStep}
              isPast={step.number < activeStep}
            />
          ))}
        </div>

        {/* Bottom nudge */}
        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 space-y-4 mt-2">
          <div className="space-y-1">
            <p className="font-medium text-slate-700">Ready to check what's financially possible?</p>
            <p className="text-sm text-slate-500">Use the serviceability calculator to get a rough sense before talking to anyone.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/serviceability"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Try the calculator
            </a>
            <a
              href="/house/nextstep"
              className="rounded-xl border border-indigo-200 px-5 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              Talk to a broker
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          People often move back and forth between steps. That's normal.
        </p>

      </div>
    </main>
  );
}
