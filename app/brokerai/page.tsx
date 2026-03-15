"use client";

import { useState } from "react";

const PROMPT = `You are an expert Australian mortgage broker assistant. A broker has sent you raw client notes. Restructure them into a clean, professional client summary report.

Use exactly these sections with these headers (use ** for bold headers):
**Client summary**
**Income**
**Dependants**
**Liabilities**
**Deposit position**
**Flags to resolve**

Rules:
- Under Income and Liabilities, prefix key items with [PAYG], [HECS], [Car loan], [Credit card] etc in brackets
- Under Flags, prefix each item with [ACTION], [ELIGIBLE], or [DISCUSS] in brackets
- Be concise and professional
- Use Australian lending context (HEM, HECS, FHOG Victoria, LMI thresholds)
- At the very end, on a new line, output a JSON object like: {"time_saved_hours": 2.5, "flags_count": 3, "action_items": 2}
- The JSON must be the last thing in your response`;

const SAMPLE = `Client: John & Sarah Miller
Meet them thru referral from Dave at Ray White
He works at Telstra - been there 6 yrs, she just went back to work part time 3 days after mat leave
Gross income: him 110k, her like 42k maybe? need to confirm
They got 2 kids, 1 is 6months old still
HECS debt - him 28k remaining approx
Car loan: 650/mth Toyota - 3 yrs left
Credit cards: him 15k limit (says barely uses it), her 8k limit
Rent currently: 2400/mth in Fitzroy
Looking to buy in Preston or Reservoir - budget around 750k
Have 95k saved - parents might gift 30k more not confirmed yet
First home buyers - FHOG eligible maybe? check vic rules
Nervous about rates going up - fixed vs variable convo needed
Pre-approval asap - going to auctions next weekend!!`;

type Metrics = {
  time_saved_hours: number;
  flags_count: number;
  action_items: number;
};

function renderReport(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="block mt-6 mb-2 text-slate-800">$1</strong>')
    .replace(/\[ACTION\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 mr-1">Action</span>')
    .replace(/\[ELIGIBLE\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 mr-1">Eligible</span>')
    .replace(/\[DISCUSS\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 mr-1">Discuss</span>')
    .replace(/\[PAYG\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mr-1">PAYG</span>')
    .replace(/\[HECS\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mr-1">HECS</span>')
    .replace(/\[Car loan\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mr-1">Car loan</span>')
    .replace(/\[Credit card\]/g, '<span class="inline-block text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 mr-1">Credit card</span>')
    .replace(/\n/g, '<br/>');
}

export default function BrokerAI() {
  const [notes, setNotes] = useState("");
  const [report, setReport] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generateReport() {
    if (!notes.trim()) return;
    setLoading(true);
    setError("");
    setReport("");
    setMetrics(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: PROMPT + "\n\nRaw notes:\n" + notes }],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Something went wrong");

      let fullText: string = data.choices[0].message.content;
      let parsedMetrics: Metrics = { time_saved_hours: 2.5, flags_count: 3, action_items: 2 };

      const cleaned = fullText.replace(/```json|```/g, "").trim();
	  const jsonMatch = cleaned.match(/\{[\s\S]*"time_saved_hours"[\s\S]*\}/);
      if (jsonMatch) {
        try { parsedMetrics = JSON.parse(jsonMatch[0]); } catch (e) {}
        fullText = cleaned.replace(jsonMatch[0], "").trim();
      }

      setMetrics(parsedMetrics);
      setReport(fullText);
    } catch (e: any) {
      setError(e.message || "Error — please try again.");
    }

    setLoading(false);
  }

  function copyReport() {
    const el = document.getElementById("report-output");
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        {/* Header */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            BrokerAI
          </h1>
          <p className="text-slate-500">
            Paste raw client notes. Get a clean professional report in seconds.
          </p>
        </div>

        {/* Input card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm space-y-4 mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Raw client notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your raw client notes here — messy is fine..."
            className="w-full min-h-48 text-sm font-mono resize-y border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-700 focus:outline-none focus:border-slate-400"
          />
          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={generateReport}
              disabled={loading || !notes.trim()}
              className="px-5 py-2 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate report"}
            </button>
            <button
              onClick={() => setNotes(SAMPLE)}
              className="px-5 py-2 text-sm text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Load sample notes
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { val: metrics.time_saved_hours.toFixed(1) + "h", lbl: "time saved" },
              { val: metrics.flags_count, lbl: "flags found" },
              { val: metrics.action_items, lbl: "action items" },
            ].map((m) => (
              <div key={m.lbl} className="rounded-2xl bg-white p-4 shadow-sm text-center">
                <div className="text-2xl font-semibold text-slate-800">{m.val}</div>
                <div className="text-xs text-slate-400 mt-1">{m.lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Report output */}
        {report && (
          <div className="rounded-3xl bg-white p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Generated report
              </p>
              <button
                onClick={copyReport}
                className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50"
              >
                {copied ? "Copied!" : "Copy report"}
              </button>
            </div>
            <div
              id="report-output"
              className="text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderReport(report) }}
            />
            <button
              onClick={() => { setReport(""); setMetrics(null); setNotes(""); }}
              className="text-xs text-slate-400 hover:text-slate-600 pt-2"
            >
              Start new report
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-slate-400 text-center mt-10">
          Built for Australian mortgage brokers. Powered by AI.
        </p>

      </div>
    </main>
  );
}
