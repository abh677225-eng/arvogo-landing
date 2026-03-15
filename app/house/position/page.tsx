"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PositionKey =
  | "exploring"
  | "considering"
  | "preparing"
  | "in-process";

const POSITION_COPY = {
  exploring: {
    title: "Exploring whether buying matters right now",
    description:
      "Buying a house isn’t something you’re actively trying to do. It’s more an idea that’s surfaced, and you’re noticing it.",
    meaning:
      "At this stage, there’s nothing you need to decide. Many people stay here for a long time — and many decide not to buy at all.",
    next:
      "For now, it’s enough to get a clearer sense of what owning a home would actually change in your life, and what it wouldn’t.",
    notYet: ["Looking at listings", "Mortgages", "Prices or timing"],
    reassurance: "There’s no rush to move past this.",
  },

  considering: {
    title: "Thinking about buying, without urgency",
    description:
      "Buying a house feels like a real possibility, but it doesn’t feel pressing or time-bound.",
    meaning:
      "You’re not choosing a home yet. You’re deciding whether this is something you want to take more seriously at all.",
    next:
      "It can help to untangle what’s coming from you, and what’s coming from outside pressure or expectations.",
    notYet: [
      "Viewing homes",
      "Talking to lenders",
      "Comparing options",
    ],
    reassurance: "It’s normal to sit here for a while.",
  },

  preparing: {
    title: "Preparing before taking action",
    description:
      "You’re engaging with the idea of buying more deliberately, but you haven’t committed to a specific home.",
    meaning:
      "This phase is about getting your footing. It’s still okay to slow down, pause, or change direction.",
    next:
      "Before narrowing in on a home, it helps to make sure the rest of your life can support this decision.",
    notYet: [
      "Making offers",
      "Optimizing deals",
      "Rushing timelines",
    ],
    reassurance: "Taking time here often makes the later steps calmer.",
  },

  "in-process": {
    title: "Already in the buying process",
    description:
      "You’re actively pursuing a home, and some steps may already feel hard to undo.",
    meaning:
      "The goal right now isn’t speed. It’s staying clear-headed and steady as decisions stack up.",
    next:
      "Keeping decisions small and sequential can make this phase feel more manageable.",
    notYet: [
      "Getting the perfect outcome",
      "Trying to ‘win’ the process",
      "Comparing yourself to others",
    ],
    reassurance: "Even now, it’s okay to pause.",
  },
};

function mapAnswersToPosition(
  answers: (string | null)[]
): PositionKey {
  const stability = answers[2];
  const execution = answers[3];

  if (execution === "I’m already making offers") {
    return "in-process";
  }

  if (execution === "I’m actively looking") {
    if (stability === "Uncertain" || stability === "Hard to say") {
      return "considering";
    }
    return "preparing";
  }

  if (execution === "I’ve been browsing a bit") {
    return "considering";
  }

  return "exploring";
}

export default function HousePosition() {
  const router = useRouter();
  const [position, setPosition] =
    useState<PositionKey>("exploring");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;

    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
  }, []);

  const copy = POSITION_COPY[position];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-3xl bg-white p-10 shadow-sm space-y-12">

          {/* Top bar */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/house/questions")}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>

          {/* Context */}
          <p className="text-sm text-slate-500">
            Based on your answers
          </p>

          {/* Title */}
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {copy.title}
          </h1>

          {/* Lead */}
          <p className="text-lg text-slate-600 leading-relaxed">
            {copy.description}
          </p>

          <div className="h-px bg-slate-200" />

          {/* Meaning */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              What this means
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {copy.meaning}
            </p>
          </div>

          {/* Next */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              What comes next
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {copy.next}
            </p>
          </div>

          {/* Not yet */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
              What doesn’t need attention yet
            </h2>
            <ul className="space-y-1 text-slate-700">
              {copy.notYet.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-slate-400">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reassurance */}
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-slate-600 italic">
              {copy.reassurance}
            </p>
          </div>

          {/* Footer */}
          <p className="text-sm text-slate-500">
            This doesn’t decide anything for you. It just helps you see where you are.
          </p>

        </div>
      </div>
    </main>
  );
}
