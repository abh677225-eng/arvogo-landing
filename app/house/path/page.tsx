"use client";

import { useState } from "react";

function Step({
  number,
  title,
  core,
  how,
  reassurance,
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
            ? "Hide how people usually do this"
            : "How people usually do this"}
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

export default function HousePath() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-3xl px-6 py-24">

        <div className="rounded-2xl bg-white p-10 shadow-sm">

          <h1 className="text-2xl font-semibold mb-10">
            A sensible order of things
          </h1>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-indigo-200"></div>

            <div className="space-y-10">

              <Step
                number={1}
                title="Get a rough sense of what’s affordable"
                core="This is about understanding a range, not a precise number. The goal is to set boundaries before getting emotionally attached."
                reassurance="You don’t need pre-approval yet."
                how="Most people start by looking at typical price ranges in areas they’d consider, just to get a feel for what’s common. Some then sanity-check that by searching for things like “borrowing power calculator” or “mortgage repayment calculator” online, and playing with the numbers to understand rough ranges — not to arrive at a final answer."
              />

              <Step
                number={2}
                title="Understand the real costs"
                core="Buying a home involves more than the purchase price. There are upfront costs, ongoing costs, and one-off expenses that are easy to underestimate."
                how="People usually get clarity here by looking at a simple breakdown of common costs — such as upfront fees, ongoing ownership costs, and one-off expenses — rather than trying to calculate everything precisely."
              />

              <Step
                number={3}
                title="Narrow what kind of home actually fits you"
                core="Before you look seriously, it helps to be clear on trade-offs like space versus location, or flexibility versus certainty."
                reassurance="You don’t need an agent yet."
                how="This step is often more about reflection than searching — thinking through what matters most day-to-day, and which compromises you’re comfortable making."
              />

              <div className="ml-4 my-6 text-sm text-slate-500">
                Later, when the above feels clear
              </div>

              <Step
                number={4}
                title="Get finance confidence"
                core="Once the earlier steps feel clear, some people choose to understand what’s realistically available to them financially."
                how="This often involves talking to a lender or broker to confirm assumptions, rather than to lock anything in."
                isLater
              />

              <Step
                number={5}
                title="Start inspections and offers"
                core="This is the stage where things move faster and decisions carry more weight."
                how="Most people reach this point after looping through the earlier steps a few times, feeling informed rather than rushed."
                isLater
              />

            </div>
          </div>

          <div className="mt-16 rounded-xl bg-indigo-50 border border-indigo-100 p-6">
            <p className="font-medium text-slate-700 mb-1">
              You don’t need to do all of this now.
            </p>
            <p className="text-slate-600">
              Many people move back and forth between early steps before moving on.
              That’s normal.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
