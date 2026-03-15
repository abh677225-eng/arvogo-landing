"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PositionKey = "exploring" | "considering" | "preparing" | "in-process";

const POSITION_COPY: Record<PositionKey, {
  emoji: string;
  title: string;
  tagline: string;
  meaning: string;
  next: string;
  notYet: string[];
  reassurance: string;
  color: string;
  bg: string;
  border: string;
}> = {
  exploring: {
    emoji: "🌱",
    title: "Exploring",
    tagline: "You're noticing the idea — not committing to it.",
    meaning: "Nothing to decide yet. Many people stay here a long time, and that's completely normal.",
    next: "Get a clearer sense of what ownership would actually change in your life.",
    notYet: ["Looking at listings", "Mortgage research", "Timing the market"],
    reassurance: "There's no rush to move past this.",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  considering: {
    emoji: "🤔",
    title: "Considering",
    tagline: "Buying feels possible — but not urgent.",
    meaning: "You're not choosing a home yet. You're deciding whether to take this seriously at all.",
    next: "Untangle what's coming from you vs outside pressure or expectations.",
    notYet: ["Viewing homes", "Talking to lenders", "Comparing suburbs"],
    reassurance: "It's normal to sit here for a while.",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  preparing: {
    emoji: "🗺️",
    title: "Preparing",
    tagline: "You're engaging deliberately — but haven't committed yet.",
    meaning: "This phase is about getting your footing. Still okay to slow down or change direction.",
    next: "Make sure the rest of your life can support this decision before narrowing in on a home.",
    notYet: ["Making offers", "Rushing timelines", "Optimising deals"],
    reassurance: "Taking time here makes the later steps calmer.",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  "in-process": {
    emoji: "🏃",
    title: "In process",
    tagline: "You're actively pursuing a home.",
    meaning: "The goal right now isn't speed — it's staying clear-headed as decisions stack up.",
    next: "Keep decisions small and sequential. Create space between commitments where you can.",
    notYet: ["Trying to 'win'", "Comparing yourself to others", "Second-guessing every choice"],
    reassurance: "Even now, it's okay to pause.",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
};

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

const STAGES: PositionKey[] = ["exploring", "considering", "preparing", "in-process"];
const STAGE_LABELS: Record<PositionKey, string> = {
  exploring: "Exploring",
  considering: "Considering",
  preparing: "Preparing",
  "in-process": "In process",
};

export default function HousePosition() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
  }, []);

  const copy = POSITION_COPY[position];
  const currentIndex = STAGES.indexOf(position);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="space-y-5">

          {/* Back */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/house/questions")}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>

          {/* Journey progress bar */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-4">
              Your position
            </p>
            <div className="flex items-start gap-0">
              {STAGES.map((stage, i) => {
                const isActive = stage === position;
                const isPast = i < currentIndex;
                return (
                  <div key={stage} className="flex-1 flex flex-col items-center text-center relative">
                    {i < STAGES.length - 1 && (
                      <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${isPast || isActive ? "bg-indigo-300" : "bg-slate-200"}`} />
                    )}
                    <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mb-2 border-2
                      ${isActive ? "bg-indigo-600 border-indigo-600 text-white" : isPast ? "bg-indigo-100 border-indigo-300 text-indigo-500" : "bg-white border-slate-200 text-slate-400"}`}>
                      {isPast ? "✓" : i + 1}
                    </div>
                    <p className={`text-xs leading-snug px-1 ${isActive ? "font-medium text-indigo-700" : "text-slate-400"}`}>
                      {STAGE_LABELS[stage]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Position card */}
          <div className={`rounded-2xl p-6 shadow-sm border ${copy.bg} ${copy.border}`}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: 28 }}>{copy.emoji}</span>
              <div>
                <p className={`text-lg font-semibold ${copy.color}`}>{copy.title}</p>
                <p className="text-sm text-slate-600">{copy.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{copy.meaning}</p>
          </div>

          {/* What's next */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 16 }}>➡️</span>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">What comes next</p>
            </div>
            <p className="text-slate-700 leading-relaxed">{copy.next}</p>
          </div>

          {/* Not yet */}
          <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 16 }}>🚫</span>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Not yet</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {copy.notYet.map((item) => (
                <span key={item} className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Reassurance */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-6 py-4">
            <p className="text-slate-500 italic text-sm">{copy.reassurance}</p>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href="/house/nextstep"
              className="flex items-center justify-center w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              See who can help with your next step
            </a>
            <button
              onClick={() => router.push("/house/path")}
              className="w-full rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              See your full path
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            This doesn't decide anything for you. It just helps you see where you are.
          </p>

        </div>
      </div>
    </main>
  );
}
