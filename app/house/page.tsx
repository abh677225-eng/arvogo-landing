"use client";

import { useRouter } from "next/navigation";

const STAGES = [
  { icon: "○", label: "Answer 4 questions" },
  { icon: "○", label: "See your position" },
  { icon: "○", label: "Get a clear path" },
];

export default function HouseEntry() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <div className="rounded-3xl bg-white p-10 shadow-sm space-y-10">

          {/* Header */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-indigo-500 uppercase tracking-wide">
              Home buying
            </p>
            <h1 className="text-3xl font-semibold leading-tight">
              Thinking about buying a house?
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Not sure where you stand or what to do next? This helps you get oriented in under 2 minutes.
            </p>
          </div>

          {/* Journey map */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-5">
              How it works
            </p>
            <div className="flex items-start gap-0">
              {STAGES.map((stage, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                  {/* Connector line */}
                  {i < STAGES.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-px bg-indigo-200" />
                  )}
                  {/* Circle */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-indigo-300 flex items-center justify-center text-indigo-400 text-sm font-medium mb-3">
                    {i + 1}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug px-2">{stage.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What you get */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              What you get
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { emoji: "📍", text: "Where you actually are in the process" },
                { emoji: "➡️", text: "What makes sense to focus on next" },
                { emoji: "🚫", text: "What you can safely ignore for now" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <p className="text-sm text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/house/questions")}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Help me get oriented
            </button>
            <p className="text-xs text-slate-400 text-center">
              No sign-up. No advice. No pressure. Takes 2 minutes.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
