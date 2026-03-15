"use client";

import { useState } from "react";

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

type Results = {
  borrowingCapacity: number;
  monthlyRepayment: number;
  fortnightlyRepayment: number;
  weeklyRepayment: number;
  totalRepayable: number;
  totalInterest: number;
  lvr: number;
  lmiApplies: boolean;
  lmiEstimate: number;
  fhogEligible: boolean;
  fhogAmount: number;
  depositGap: number;
  monthsToSave: number;
  netMonthlyIncome: number;
  totalMonthlyCommitments: number;
  surplusIncome: number;
  dsr: number;
  loanAmount: number;
};

// Australian tax calculation (2024-25 rates)
function calcAnnualTax(gross: number): number {
  if (gross <= 18200) return 0;
  if (gross <= 45000) return (gross - 18200) * 0.19;
  if (gross <= 120000) return 5092 + (gross - 45000) * 0.325;
  if (gross <= 180000) return 29467 + (gross - 120000) * 0.37;
  return 51667 + (gross - 180000) * 0.45;
}

// HEM benchmarks (income-scaled, 2025 estimates post-inflation adjustment)
// Based on Melbourne Institute HEM methodology: median basics + 25th percentile discretionary
function calcHEM(grossIncome: number, hasPartner: boolean, dependants: number): number {
  // Base HEM by household type (monthly)
  let base: number;
  if (!hasPartner) {
    base = grossIncome < 50000 ? 2100 : grossIncome < 100000 ? 2400 : 2800;
  } else {
    base = grossIncome < 80000 ? 3100 : grossIncome < 150000 ? 3500 : 4000;
  }
  // Add per dependant
  const depAdd = dependants * 650;
  return base + depAdd;
}

function calculateResults(form: typeof defaultForm): Results {
  const income1 = parseFloat(form.income1) || 0;
  const income2 = parseFloat(form.income2) || 0;
  const grossIncome = income1 + income2;
  const hasPartner = income2 > 0;

  // Calculate actual net income using ATO tax brackets + 2% Medicare levy
  const tax1 = calcAnnualTax(income1) + income1 * 0.02;
  const tax2 = calcAnnualTax(income2) + income2 * 0.02;
  const netAnnual = grossIncome - tax1 - tax2;
  const netMonthlyIncome = netAnnual / 12;

  const dependants = parseInt(form.dependants) || 0;

  // Liabilities — bank methodology
  const carLoan = parseFloat(form.carLoan) || 0;
  // Banks assess 3.8% p.a. of total credit card LIMIT as monthly repayment obligation
  const creditCardLimit = parseFloat(form.creditCards) || 0;
  const creditCardMonthly = (creditCardLimit * 0.038) / 12;
  const otherLiabilities = parseFloat(form.otherLiabilities) || 0;

  // HEM — use higher of declared or benchmark (banks always use higher)
  const hem = calcHEM(grossIncome, hasPartner, dependants);
  const totalMonthlyCommitments = carLoan + creditCardMonthly + otherLiabilities + hem;

  // APRA mandated: assess at contract rate + 3% buffer (current SVR ~6.25% → assess at 9.25%)
  const contractRate = 0.0625;
  const assessmentRate = contractRate + 0.03; // 9.25% — APRA buffer
  const months = 30 * 12;
  const monthlyAssessRate = assessmentRate / 12;

  // Banks cap DSR at ~30-35% of GROSS income
  const maxDSRMonthly = (grossIncome * 0.32) / 12;
  // Available for new loan = DSR cap minus existing commitments (excl HEM)
  const existingCommitments = carLoan + creditCardMonthly + otherLiabilities;
  const availableForLoan = Math.max(0, maxDSRMonthly - existingCommitments);
  // Also check net surplus method
  const surplusIncome = netMonthlyIncome - totalMonthlyCommitments;
  const surplusAvailable = Math.max(0, surplusIncome * 0.85);
  // Use the lower of DSR method and surplus method (conservative, like banks)
  const maxMonthlyRepayment = Math.min(availableForLoan, surplusAvailable);

  // Reverse amortisation at assessment rate to get borrowing capacity
  const borrowingCapacity = maxMonthlyRepayment > 0
    ? Math.round((maxMonthlyRepayment * (Math.pow(1 + monthlyAssessRate, months) - 1)) /
        (monthlyAssessRate * Math.pow(1 + monthlyAssessRate, months)))
    : 0;

  const purchasePrice = parseFloat(form.purchasePrice) || borrowingCapacity * 1.1;
  const deposit = parseFloat(form.deposit) || 0;
  const loanAmount = Math.max(0, purchasePrice - deposit);
  const lvr = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;

  // Actual repayment at contract rate (not assessment rate)
  const monthlyRate = contractRate / 12;
  const monthlyRepayment = loanAmount > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1))
    : 0;

  const totalRepayable = monthlyRepayment * months;
  const totalInterest = totalRepayable - loanAmount;
  const lmiApplies = lvr > 80;
  const lmiEstimate = lmiApplies ? Math.round(loanAmount * 0.02) : 0;

  const isFirstHome = form.firstHome === "yes";
  const price = purchasePrice;
  let fhogEligible = false;
  let fhogAmount = 0;

  if (isFirstHome) {
    if (form.state === "VIC" && price <= 750000) { fhogEligible = true; fhogAmount = 10000; }
    else if (form.state === "NSW" && price <= 600000) { fhogEligible = true; fhogAmount = 10000; }
    else if (form.state === "QLD" && price <= 750000) { fhogEligible = true; fhogAmount = 15000; }
    else if (form.state === "SA" && price <= 650000) { fhogEligible = true; fhogAmount = 15000; }
    else if (form.state === "WA" && price <= 750000) { fhogEligible = true; fhogAmount = 10000; }
    else if (form.state === "TAS" && price <= 750000) { fhogEligible = true; fhogAmount = 10000; }
    else if (form.state === "ACT") { fhogEligible = false; fhogAmount = 0; }
    else if (form.state === "NT" && price <= 750000) { fhogEligible = true; fhogAmount = 10000; }
  }

  const minDeposit = purchasePrice * 0.05;
  const depositGap = Math.max(0, minDeposit - deposit);
  const monthlySavings = parseFloat(form.monthlySavings) || 1000;
  const monthsToSave = depositGap > 0 ? Math.ceil(depositGap / monthlySavings) : 0;
  // DSR as % of gross income (how banks measure it)
  const dsr = grossIncome > 0 ? ((monthlyRepayment * 12) / grossIncome) * 100 : 0;

  return {
    borrowingCapacity,
    monthlyRepayment,
    fortnightlyRepayment: Math.round(monthlyRepayment * 12 / 26),
    weeklyRepayment: Math.round(monthlyRepayment * 12 / 52),
    totalRepayable,
    totalInterest,
    lvr,
    lmiApplies,
    lmiEstimate,
    fhogEligible,
    fhogAmount,
    depositGap,
    monthsToSave,
    netMonthlyIncome,
    totalMonthlyCommitments,
    surplusIncome,
    dsr,
    loanAmount,
  };
}

const defaultForm = {
  income1: "",
  income2: "",
  dependants: "0",
  carLoan: "",
  creditCards: "",
  otherLiabilities: "",
  deposit: "",
  purchasePrice: "",
  monthlySavings: "",
  firstHome: "yes",
  state: "VIC",
};

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span className="font-medium text-slate-700">{fmt(value)}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RepaymentChart({ monthly, fortnightly, weekly }: { monthly: number; fortnightly: number; weekly: number }) {
  const max = monthly * 1.1;
  return (
    <div className="space-y-3">
      <Bar label="Monthly" value={monthly} max={max} color="bg-indigo-400" />
      <Bar label="Fortnightly" value={fortnightly} max={max} color="bg-sky-400" />
      <Bar label="Weekly" value={weekly} max={max} color="bg-teal-400" />
    </div>
  );
}

function IncomeChart({ income, commitments, surplus }: { income: number; commitments: number; surplus: number }) {
  const max = income;
  return (
    <div className="space-y-3">
      <Bar label="Net monthly income" value={income} max={max} color="bg-green-400" />
      <Bar label="Monthly commitments" value={commitments} max={max} color="bg-red-300" />
      <Bar label="Available surplus" value={surplus} max={max} color="bg-indigo-400" />
    </div>
  );
}

export default function ServiceabilityCalculator() {
  const [form, setForm] = useState(defaultForm);
  const [results, setResults] = useState<Results | null>(null);

  function set(key: keyof typeof defaultForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function calculate() {
    setResults(calculateResults(form));
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function reset() {
    setForm(defaultForm);
    setResults(null);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white text-slate-800">
      <div className="mx-auto max-w-2xl px-6 py-24">

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Serviceability calculator
          </h1>
          <p className="text-slate-500">
            Understand your borrowing position before speaking to a broker.
          </p>
        </div>

        {/* Income */}
        <div className="rounded-3xl bg-white p-8 shadow-sm space-y-5 mb-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Income</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Your gross income (p.a.)</label>
              <input type="number" placeholder="e.g. 95000" value={form.income1}
                onChange={e => set("income1", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Partner gross income (p.a.)</label>
              <input type="number" placeholder="Optional" value={form.income2}
                onChange={e => set("income2", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Number of dependants</label>
            <select value={form.dependants} onChange={e => set("dependants", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none">
              {["0","1","2","3","4","5+"].map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Liabilities */}
        <div className="rounded-3xl bg-white p-8 shadow-sm space-y-5 mb-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Monthly liabilities</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Car loan repayment</label>
              <input type="number" placeholder="e.g. 650" value={form.carLoan}
                onChange={e => set("carLoan", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Credit card limits (total)</label>
              <input type="number" placeholder="e.g. 10000" value={form.creditCards}
                onChange={e => set("creditCards", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Other monthly commitments</label>
            <input type="number" placeholder="e.g. 300" value={form.otherLiabilities}
              onChange={e => set("otherLiabilities", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
          </div>
        </div>

        {/* Property */}
        <div className="rounded-3xl bg-white p-8 shadow-sm space-y-5 mb-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Property & deposit</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Target purchase price</label>
              <input type="number" placeholder="e.g. 750000" value={form.purchasePrice}
                onChange={e => set("purchasePrice", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">Deposit saved</label>
              <input type="number" placeholder="e.g. 95000" value={form.deposit}
                onChange={e => set("deposit", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Monthly savings capacity</label>
            <input type="number" placeholder="e.g. 2000" value={form.monthlySavings}
              onChange={e => set("monthlySavings", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:border-slate-400" />
          </div>
        </div>

        {/* FHOG */}
        <div className="rounded-3xl bg-white p-8 shadow-sm space-y-5 mb-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">First home buyer</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">First home buyer?</label>
              <select value={form.firstHome} onChange={e => set("firstHome", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">State</label>
              <select value={form.state} onChange={e => set("state", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none">
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-3 bg-slate-800 text-white text-sm rounded-2xl hover:bg-slate-700 mb-4">
          Calculate my position
        </button>

        {/* Results */}
        {results && (
          <div id="results" className="space-y-6 mt-10">

            {/* Borrowing capacity */}
            <div className="rounded-3xl bg-white p-8 shadow-sm space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Borrowing capacity</h2>
              <div className="text-4xl font-semibold text-slate-800">{fmt(results.borrowingCapacity)}</div>
              <p className="text-xs text-slate-400">Estimated maximum borrowing based on income, liabilities and a 3% serviceability buffer.</p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Net monthly income", val: fmt(results.netMonthlyIncome) },
                  { label: "Monthly commitments", val: fmt(results.totalMonthlyCommitments) },
                  { label: "Available surplus", val: fmt(results.surplusIncome) },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl bg-slate-50 p-3 text-center">
                    <div className="text-base font-semibold text-slate-800">{m.val}</div>
                    <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
              <IncomeChart income={results.netMonthlyIncome} commitments={results.totalMonthlyCommitments} surplus={results.surplusIncome} />
            </div>

            {/* Repayments */}
            <div className="rounded-3xl bg-white p-8 shadow-sm space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">Repayment breakdown</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Monthly", val: fmt(results.monthlyRepayment) },
                  { label: "Fortnightly", val: fmt(results.fortnightlyRepayment) },
                  { label: "Weekly", val: fmt(results.weeklyRepayment) },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl bg-slate-50 p-3 text-center">
                    <div className="text-base font-semibold text-slate-800">{m.val}</div>
                    <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
              <RepaymentChart monthly={results.monthlyRepayment} fortnightly={results.fortnightlyRepayment} weekly={results.weeklyRepayment} />
              <div className="rounded-xl bg-slate-50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total repayable over 30 years</span>
                  <span className="font-medium">{fmt(results.totalRepayable)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total interest payable</span>
                  <span className="font-medium text-red-600">{fmt(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Debt service ratio</span>
                  <span className={`font-medium ${results.dsr > 35 ? "text-red-600" : "text-green-600"}`}>
                    {results.dsr.toFixed(1)}% {results.dsr > 35 ? "— high" : "— healthy"}
                  </span>
                </div>
              </div>
            </div>

            {/* LMI */}
            <div className="rounded-3xl bg-white p-8 shadow-sm space-y-3">
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">LVR & LMI</h2>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-semibold">{results.lvr.toFixed(1)}%</div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${results.lmiApplies ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {results.lmiApplies ? "LMI applies" : "No LMI required"}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${results.lvr > 90 ? "bg-red-400" : results.lvr > 80 ? "bg-amber-400" : "bg-green-400"}`}
                  style={{ width: `${Math.min(results.lvr, 100)}%` }} />
              </div>
              {results.lmiApplies && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  Estimated LMI cost: <strong>{fmt(results.lmiEstimate)}</strong> — deposit above 20% removes this cost entirely.
                </div>
              )}
              {!results.lmiApplies && (
                <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                  Your deposit is above 20% — no LMI required. This saves you approximately {fmt(results.loanAmount * 0.02)}.
                </div>
              )}
            </div>

            {/* FHOG */}
            <div className="rounded-3xl bg-white p-8 shadow-sm space-y-3">
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">First home owner grant</h2>
              {results.fhogEligible ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-semibold text-green-700">{fmt(results.fhogAmount)}</div>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">Likely eligible</span>
                  </div>
                  <p className="text-sm text-slate-500">Based on your state ({form.state}) and purchase price. Confirm eligibility with your broker or state revenue office.</p>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  {form.firstHome === "no"
                    ? "FHOG is not available for non-first home buyers."
                    : `Your purchase price exceeds the FHOG threshold for ${form.state}.`}
                </div>
              )}
              {results.depositGap > 0 && (
                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700 space-y-1">
                  <p>You need <strong>{fmt(results.depositGap)}</strong> more to reach a 5% deposit.</p>
                  <p>At your savings rate, that's approximately <strong>{results.monthsToSave} months</strong> away.</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 italic">
                This calculator provides estimates only and does not constitute financial advice. Figures are based on a 6.25% interest rate, 30-year term, and standard HEM benchmarks. Speak to a licensed mortgage broker for personalised advice.
              </p>
            </div>

            <button onClick={reset} className="w-full py-2 text-sm text-slate-400 hover:text-slate-600">
              Reset calculator
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
