"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Step({
  number,
  title,
  core,
  reassurance,
  how,
  isLater = false,
}: {
  number: number;
  title: string;
  core: string;
  how: string;
  reassurance?: string;
  isLater?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-6">
      <div
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
          ${
            isLater
              ? "border border-indigo-200 bg-white text-indigo-400"
              : "bg-indigo-600 text-white"
          }`}
      >
        {number}
      </div>

      <div
        className={`w-full rounded-xl border p-6
          ${
            isLater
              ? "border-indigo-100 bg-indigo-50/50"
              : "border-slate-200 bg-white"
          }`}
      >
        <h2 className="font-medium">{title}</h2>

        <div className="mt-3 space-y-3">
          <p className="text-slate-600 leading-relaxed">
            {core}
          </p>

          {reassurance && (
            <p className="text-slate-500">
              {reassurance}
            </p>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="mt-6 text-sm text-indigo-600 hover:underline underline-offset-4"
        >
          {open
            ? "Hide how people usually approach this"
            : "How people usually approach this"}
        </button>

        {open && (
          <div className="mt-4 rounded-lg bg-sky-50 p-4 text-slate-600">
            <p className="leading-relaxed">
              {how}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

type PositionKey =
  | "exploring"
  | "considering"
  | "preparing"
  | "in-process";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stability = answers[2];
  const execution = answers[3];

  if (execution === "I’m already making offers") return "in-process";

  if (execution === "I’m actively looking") {
    if (stability === "Uncertain" || stability === "Hard to say") {
      return "considering";
    }
    return "preparing";
  }

  if (execution === "I’ve been browsing a bit") return "considering";

  return "exploring";
}

export default function HousePath() {
  const router = useRouter();
  const [position, setPosition] =
    useState<PositionKey>("exploring");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-3xl px-6 py-24">

        <div className="rounded-2xl bg-white p-10 shadow-sm">

          {/* Top bar */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => router.push("/house/position")}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          </div>

          <h1 className="text-2xl font-semibold mb-10">
            A way to keep the decision contained
          </h1>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-indigo-200"></div>

            <div className="space-y-10">

              <Step
                number={1}
                title="Clarify whether buying is even the right category"
                core="At the beginning, the real question usually isn’t which house to buy. It’s whether ownership actually fits what you want right now."
                reassurance="It’s okay if the answer is no — or not yet."
                how="People often reflect on what’s prompting the idea of buying, and what they hope ownership would change. This is more about orientation than research."
              />

              <Step
                number={2}
                title="Understand the boundaries, not the numbers"
                core="Before getting specific, it helps to have a loose sense of constraints — what feels comfortable, risky, or unrealistic."
                reassurance="Precision isn’t useful here."
                how="Most people do this informally at first, just to avoid drifting into situations that would clearly feel stressful or misaligned later."
              />

              <Step
                number={3}
                title="Get clear on trade-offs you’re willing to live with"
                core="Every home involves compromises. Knowing which ones matter to you prevents getting pulled into decisions that don’t actually fit."
                reassurance="You don’t need to look at properties yet."
                how="This usually looks like thinking through day-to-day life — space, location, flexibility — rather than searching listings."
              />

              <div className="ml-4 my-6 text-sm text-slate-500">
                Later, once the earlier pieces feel clear
              </div>

              <Step
                number={4}
                title="Check what’s realistically possible"
                core="Only after the earlier steps feel grounded does it make sense to confirm what’s feasible financially."
                how="People often talk to a lender or broker here to validate assumptions, not to commit to anything."
                isLater
              />

              <Step
                number={5}
                title="Move into inspections and offers"
                core="This is the phase where decisions become more concrete and harder to reverse."
                how="Most people reach this point after looping back through earlier steps a few times, feeling informed rather than rushed."
                isLater
              />

            </div>
          </div>

          <div className="mt-16 rounded-xl bg-indigo-50 border border-indigo-100 p-6">
            <p className="font-medium text-slate-700 mb-1">
              You don’t need to do all of this now.
            </p>
            <p className="text-slate-600">
              People often move back and forth between earlier steps before anything else makes sense.
              That’s normal.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
