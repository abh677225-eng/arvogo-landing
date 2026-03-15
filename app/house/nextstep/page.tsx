"use client";

import { useEffect, useState } from "react";
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

const POSITION_INTRO: Record<PositionKey, { heading: string; subtext: string }> = {
  exploring: {
    heading: "Not ready for a broker yet — and that's fine",
    subtext:
      "Most people at this stage just want a rough sense of what's possible. A good broker won't pressure you — they'll help you understand your position so the decision feels less abstract.",
  },
  considering: {
    heading: "A conversation, not a commitment",
    subtext:
      "Talking to a broker at this stage is low-stakes. You're not applying for anything. You're just getting a clearer picture of what's realistic before you decide whether to go further.",
  },
  preparing: {
    heading: "This is a good time to talk to a broker",
    subtext:
      "Before narrowing in on a home, it helps to know your borrowing capacity and what lenders will look at. A broker can give you that clarity without locking you into anything.",
  },
  "in-process": {
    heading: "You probably need a broker now",
    subtext:
      "If you're making offers or close to it, having a broker in your corner makes a real difference — on speed, on lender choice, and on avoiding mistakes that are hard to undo.",
  },
};

type Provider = {
  name: string;
  title: string;
  blurb: string;
  tag: string;
};

const PROVIDERS: Provider[] = [
  {
    name: "Sarah Mitchell",
    title: "Mortgage Broker · Melbourne",
    blurb:
      "Works with first home buyers and people navigating complex income situations. No jargon, no rush.",
    tag: "First home buyers",
  },
  {
    name: "James Okafor",
    title: "Mortgage Broker · Melbourne & surrounds",
    blurb:
      "Specialises in helping buyers understand their real borrowing position before they start looking at homes.",
    tag: "Borrowing clarity",
  },
  {
    name: "Priya Nair",
    title: "Mortgage Broker · Victoria-wide",
    blurb:
      "Focuses on making the lending process feel manageable — especially for buyers who find financial decisions stressful.",
    tag: "Stress-free process",
  },
];

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type SubmitState = "idle" | "submitting" | "done";

function ProviderCard({
  provider,
  position,
  onConnect,
}: {
  provider: Provider;
  position: PositionKey;
  onConnect: (provider: Provider) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
            {provider.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-medium text-slate-800">{provider.name}</p>
            <p className="text-xs text-slate-500">{provider.title}</p>
          </div>
        </div>
        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          {provider.tag}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{provider.blurb}</p>
      <button
        onClick={() => onConnect(provider)}
        className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
      >
        Connect with {provider.name.split(" ")[0]}
      </button>
    </div>
  );
}

function LeadModal({
  provider,
  position,
  onClose,
  onSubmit,
  submitState,
}: {
  provider: Provider;
  position: PositionKey;
  onClose: () => void;
  onSubmit: (form: LeadForm) => void;
  submitState: SubmitState;
}) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function set(key: keyof LeadForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const isValid = form.name.trim() && form.email.trim();

  if (submitState === "done") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg space-y-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Request sent</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {provider.name.split(" ")[0]} will be in touch shortly. There's no obligation — just a conversation.
          </p>
          <button
            onClick={onClose}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-800">
            Connect with {provider.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-slate-500">
            No obligation. {provider.name.split(" ")[0]} will reach out for a relaxed introductory chat.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Your name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Alex"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="04xx xxx xxx"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Anything you'd like them to know? (optional)</label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="e.g. First home buyer, not sure where to start..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => isValid && onSubmit(form)}
          disabled={!isValid || submitState === "submitting"}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitState === "submitting" ? "Sending..." : "Send introduction request"}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Your details are only shared with {provider.name.split(" ")[0]}. No spam.
        </p>

        <button
          onClick={onClose}
          className="w-full text-xs text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    const answers: (string | null)[] = JSON.parse(raw);
    setPosition(mapAnswersToPosition(answers));
  }, []);

  const intro = POSITION_INTRO[position];

  async function handleSubmit(form: LeadForm) {
    setSubmitState("submitting");
    // TODO: Replace with your real lead capture endpoint
    // e.g. POST to /api/leads with { ...form, provider: selectedProvider, position }
    await new Promise((res) => setTimeout(res, 1200));
    setSubmitState("done");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        {/* Back */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => router.push("/house/position")}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Back
          </button>
        </div>

        {/* Intro */}
        <div className="rounded-3xl bg-white p-10 shadow-sm space-y-4 mb-8">
          <p className="text-sm text-slate-500">A possible next step</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {intro.heading}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {intro.subtext}
          </p>
        </div>

        {/* Providers */}
        <div className="space-y-4 mb-10">
          {PROVIDERS.map((p) => (
            <ProviderCard
              key={p.name}
              provider={p}
              position={position}
              onConnect={setSelectedProvider}
            />
          ))}
        </div>

        {/* Soft footer */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 space-y-1">
          <p className="text-sm font-medium text-slate-700">Not ready to talk to anyone yet?</p>
          <p className="text-sm text-slate-500">
            That's completely fine.{" "}
            <button
              onClick={() => router.push("/serviceability")}
              className="text-indigo-600 hover:underline underline-offset-2"
            >
              Try the serviceability calculator
            </button>{" "}
            to get a rough sense of your position on your own terms.
          </p>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 text-center mt-8">
          Providers listed on Arvogo have agreed to our no-pressure introduction guidelines.
        </p>

      </div>

      {/* Lead modal */}
      {selectedProvider && (
        <LeadModal
          provider={selectedProvider}
          position={position}
          onClose={() => {
            setSelectedProvider(null);
            setSubmitState("idle");
          }}
          onSubmit={handleSubmit}
          submitState={submitState}
        />
      )}
    </main>
  );
}
