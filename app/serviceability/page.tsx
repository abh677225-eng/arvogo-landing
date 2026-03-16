"use client";

import { useState } from "react";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

const STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

const INCOME_TYPES = [
  { value: "rental", label: "Rental income", shade: 0.8 },
  { value: "dividends", label: "Dividends", shade: 0.8 },
  { value: "government", label: "Government payments", shade: 1.0 },
  { value: "child_support", label: "Child support received", shade: 1.0 },
  { value: "other", label: "Other", shade: 0.8 },
];

type OtherIncome = { type: string; amount: string };

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
  netMonthlyIncome: number;
  totalMonthlyCommitments: number;
  surplusIncome: number;
  dsr: number;
  loanAmount: number;
  contractRate: number;
};

// ATO 2024-25 tax brackets
function calcAnnualTax(gross: number): number {
  if (gross <= 18200) return 0;
  if (gross <= 45000) return (gross - 18200) * 0.19;
  if (gross <= 120000) return 5092 + (gross - 45000) * 0.325;
  if (gross <= 180000) return 29467 + (gross - 120000) * 0.37;
  return 51667 + (gross - 180000) * 0.45;
}

// HEM benchmarks — income-scaled
function calcHEM(grossIncome: number, hasPartner: boolean, dependants: number): number {
  let base: number;
  if (!hasPartner) {
    base = grossIncome < 50000 ? 2100 : grossIncome < 100000 ? 2400 : 2800;
  } else {
    base = grossIncome < 80000 ? 3100 : grossIncome < 150000 ? 3500 : 4000;
  }
  return base + dependants * 650;
}

const FHOG: Record<string, { amount: number; threshold: number }> = {
  VIC: { amount: 10000, threshold: 750000 },
  NSW: { amount: 10000, threshold: 600000 },
  QLD: { amount: 15000, threshold: 750000 },
  SA:  { amount: 15000, threshold: 650000 },
  WA:  { amount: 10000, threshold: 750000 },
  TAS: { amount: 10000, threshold: 750000 },
  ACT: { amount: 0,     threshold: 0 },
  NT:  { amount: 10000, threshold: 750000 },
};

const defaultForm = {
  purpose: "owner" as "owner" | "investment",
  income1: "",
  income2: "",
  dependants: "0",
  otherIncomes: [] as OtherIncome[],
  carLoan: "",
  creditCards: "",
  otherLiabilities: "",
  additionalExpenses: "",
  continuingRent: "no" as "yes" | "no",
  continuingRentAmount: "",
  deposit: "",
  purchasePrice: "",
  firstHome: "yes",
  state: "VIC",
};

function calculateResults(form: typeof defaultForm): Results {
  const income1 = parseFloat(form.income1) || 0;
  const income2 = parseFloat(form.income2) || 0;
  const grossIncome = income1 + income2;
  const hasPartner = income2 > 0;

  // Net income after tax + Medicare
  const tax1 = calcAnnualTax(income1) + income1 * 0.02;
  const tax2 = calcAnnualTax(income2) + income2 * 0.02;
  let netAnnual = grossIncome - tax1 - tax2;

  // Add shaded other income
  for (const oi of form.otherIncomes) {
    const amount = parseFloat(oi.amount) || 0;
    const shade = INCOME_TYPES.find(t => t.value === oi.type)?.shade || 0.8;
    netAnnual += amount * shade;
  }
  const netMonthlyIncome = netAnnual / 12;

  const dependants = parseInt(form.dependants) || 0;

  // Liabilities
  const carLoan = parseFloat(form.carLoan) || 0;
  const creditCardLimit = parseFloat(form.creditCards) || 0;
  const creditCardMonthly = (creditCardLimit * 0.038) / 12;
  const otherLiabilities = parseFloat(form.otherLiabilities) || 0;
  const additionalExpenses = parseFloat(form.additionalExpenses) || 0;
  const continuingRent = form.continuingRent === "yes"
    ? parseFloat(form.continuingRentAmount) || 0
    : 0;

  // HEM + property expenses for investment
  const hem = calcHEM(grossIncome, hasPartner, dependants);
  const propertyExpenses = form.purpose === "investment" ? 200 : 0;

  const totalMonthlyCommitments =
    carLoan + creditCardMonthly + otherLiabilities +
    additionalExpenses + continuingRent +
    hem + propertyExpenses;

  // Rates — investment is higher
  const contractRate = form.purpose === "investment" ? 0.0655 : 0.0625;
  const assessmentRate = contractRate + 0.03;
  const months = 30 * 12;
  const monthlyAssessRate = assessmentRate / 12;

  // Borrowing capacity — surplus method
  const surplusIncome = netMonthlyIncome - totalMonthlyCommitments;
  const maxMonthlyRepayment = Math.max(0, surplusIncome);

  const borrowingCapacity = maxMonthlyRepayment > 0
    ? Math.round((maxMonthlyRepayment * (Math.pow(1 + monthlyAssessRate, months) - 1)) /
        (monthlyAssessRate * Math.pow(1 + monthlyAssessRate, months)))
    : 0;

  const purchasePrice = parseFloat(form.purchasePrice) || borrowingCapacity * 1.1;
  const deposit = parseFloat(form.deposit) || 0;
  const loanAmount = Math.max(0, purchasePrice - deposit);

  // Max LVR — investment typically 80%
  const maxLvr = form.purpose === "investment" ? 80 : 95;
  const lvr = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;

  const monthlyRate = contractRate / 12;
  const monthlyRepayment = loanAmount > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1))
    : 0;

  const totalRepayable = monthlyRepayment * months;
  const totalInterest = totalRepayable - loanAmount;

  // LMI threshold differs by purpose
  const lmiThreshold = form.purpose === "investment" ? 80 : 80;
  const lmiApplies = lvr > lmiThreshold;
  const lmiEstimate = lmiApplies ? Math.round(loanAmount * 0.02) : 0;

  // FHOG — owner occupier only
  const isFirstHome = form.firstHome === "yes" && form.purpose === "owner";
  const fhogData = FHOG[form.state];
  const fhogEligible = isFirstHome && fhogData && fhogData.amount > 0 && purchasePrice <= fhogData.threshold;
  const fhogAmount = fhogEligible ? fhogData.amount : 0;

  const minDeposit = purchasePrice * (form.purpose === "investment" ? 0.2 : 0.05);
  const depositGap = Math.max(0, minDeposit - deposit);
  const dsr = grossIncome > 0 ? ((monthlyRepayment * 12) / grossIncome) * 100 : 0;

  return {
    borrowingCapacity, monthlyRepayment,
    fortnightlyRepayment: Math.round(monthlyRepayment * 12 / 26),
    weeklyRepayment: Math.round(monthlyRepayment * 12 / 52),
    totalRepayable, totalInterest, lvr, lmiApplies, lmiEstimate,
    fhogEligible, fhogAmount, depositGap,
    netMonthlyIncome, totalMonthlyCommitments, surplusIncome,
    dsr, loanAmount, contractRate,
  };
}

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function Card({ children, mb = "1rem" }: { children: React.ReactNode; mb?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
      padding: "1.5rem", marginBottom: mb,
      boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
      }}>{emoji}</div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function Input({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: hint ? 2 : 4 }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 4px", fontStyle: "italic" }}>{hint}</p>}
      <input {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 10,
        border: "1.5px solid #e2e8f0", fontSize: 13,
        fontFamily: "inherit", background: "#f8fafc", color: "#1e293b",
        outline: "none", boxSizing: "border-box" as const,
        transition: "border-color 0.15s ease",
      }}
        onFocus={e => e.target.style.borderColor = "#a5b4fc"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{label}</label>
      <select {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 10,
        border: "1.5px solid #e2e8f0", fontSize: 13,
        fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none",
        boxSizing: "border-box" as const,
      }}>
        {children}
      </select>
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: color, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function ServiceabilityCalculator() {
  const [form, setForm] = useState(defaultForm);
  const [results, setResults] = useState<Results | null>(null);

  function set<K extends keyof typeof defaultForm>(key: K, value: typeof defaultForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addOtherIncome() {
    setForm(f => ({ ...f, otherIncomes: [...f.otherIncomes, { type: "rental", amount: "" }] }));
  }

  function updateOtherIncome(i: number, field: keyof OtherIncome, value: string) {
    setForm(f => {
      const next = [...f.otherIncomes];
      next[i] = { ...next[i], [field]: value };
      return { ...f, otherIncomes: next };
    });
  }

  function removeOtherIncome(i: number) {
    setForm(f => ({ ...f, otherIncomes: f.otherIncomes.filter((_, idx) => idx !== i) }));
  }

  function calculate() {
    setResults(calculateResults(form));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const isInvestment = form.purpose === "investment";

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        {/* Back */}
        <a href="/house" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: "2rem" }}>
          ← Back
        </a>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.1)", borderRadius: 99,
            padding: "4px 12px", marginBottom: "0.75rem",
          }}>
            <span style={{ fontSize: 12 }}>🧮</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Serviceability calculator</span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: "0.5rem",
          }}>
            What can you borrow?
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            Based on real bank methodology. Takes 2 minutes.
          </p>
        </div>

        {/* Purpose */}
        <Card>
          <SectionLabel emoji="🏠" label="Purpose of purchase" />
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[
              { value: "owner", label: "🏡 Home to live in" },
              { value: "investment", label: "📈 Investment property" },
            ].map(opt => (
              <button key={opt.value} onClick={() => set("purpose", opt.value as "owner" | "investment")}
                style={{
                  flex: 1, padding: "10px", borderRadius: 12,
                  background: form.purpose === opt.value ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8fafc",
                  border: form.purpose === opt.value ? "none" : "1.5px solid #e2e8f0",
                  color: form.purpose === opt.value ? "#fff" : "#64748b",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: form.purpose === opt.value ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                  transition: "all 0.15s ease",
                }}>
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 12px", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              {isInvestment
                ? "💡 Investment loans typically have higher interest rates (≈0.3% above owner-occupier) and require a 20% deposit. Rental income is counted at 80%."
                : "💡 Owner-occupier loans have lower rates and you can borrow with as little as a 5% deposit (LMI applies under 20%)."}
            </p>
          </div>
        </Card>

        {/* Income */}
        <Card>
          <SectionLabel emoji="💼" label="Income" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Input label="Your gross income (p.a.)" hint="Before tax" type="number" placeholder="e.g. 95000" value={form.income1} onChange={e => set("income1", e.target.value)} />
            <Input label="Partner gross income (p.a.)" hint="Before tax · optional" type="number" placeholder="optional" value={form.income2} onChange={e => set("income2", e.target.value)} />
          </div>
          <Select label="Dependants" value={form.dependants} onChange={e => set("dependants", e.target.value)}>
            {["0","1","2","3","4","5+"].map(n => <option key={n}>{n}</option>)}
          </Select>

          {/* Other income */}
          <div style={{ marginTop: "1rem", background: "#f8fafc", borderRadius: 12, padding: "1rem", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 4px" }}>Other income sources</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 10px", fontStyle: "italic" }}>
              Banks shade rental income and dividends at 80%. Government payments and child support count at 100%.
            </p>
            {form.otherIncomes.map((oi, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "end" }}>
                <Select label="Type" value={oi.type} onChange={e => updateOtherIncome(i, "type", e.target.value)}>
                  {INCOME_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
                <Input label="Annual amount" type="number" placeholder="e.g. 20000" value={oi.amount} onChange={e => updateOtherIncome(i, "amount", e.target.value)} />
                <button onClick={() => removeOtherIncome(i)} style={{
                  padding: "10px", borderRadius: 10, border: "1.5px solid #fecaca",
                  background: "#fef2f2", color: "#ef4444", fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit", marginBottom: 0,
                }}>✕</button>
              </div>
            ))}
            <button onClick={addOtherIncome} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#6366f1", background: "none", border: "none",
              cursor: "pointer", fontFamily: "inherit", padding: 0, marginTop: form.otherIncomes.length ? 4 : 0,
            }}>
              + Add other income source
            </button>
          </div>
        </Card>

        {/* Liabilities & expenses */}
        <Card>
          <SectionLabel emoji="💳" label="Liabilities & expenses" />
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 12px", border: "1px solid #f1f5f9", marginBottom: "1rem" }}>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
              ✦ Everyday living expenses (groceries, utilities, transport) are estimated using the bank HEM benchmark — only enter debts and expenses above this.
            </p>
          </div>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 10px" }}>Existing debts</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Input label="Car loan (monthly repayment)" type="number" placeholder="e.g. 650" value={form.carLoan} onChange={e => set("carLoan", e.target.value)} />
            <Input label="Credit card limits (total)" type="number" placeholder="e.g. 10000" value={form.creditCards} onChange={e => set("creditCards", e.target.value)} />
          </div>
          <Input label="Other loan repayments/month" hint="Personal loans, HECS, BNPL etc — not rent" type="number" placeholder="e.g. 300" value={form.otherLiabilities} onChange={e => set("otherLiabilities", e.target.value)} />

          <div style={{ borderTop: "1px solid #f1f5f9", margin: "1rem 0" }} />

          <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 4px" }}>Additional monthly expenses</p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 10px", fontStyle: "italic" }}>
            Only enter costs above typical living expenses — e.g. private school fees, regular medical costs.
          </p>
          <Input label="Additional expenses/month" type="number" placeholder="e.g. 800" value={form.additionalExpenses} onChange={e => set("additionalExpenses", e.target.value)} />

          <div style={{ borderTop: "1px solid #f1f5f9", margin: "1rem 0" }} />

          {/* Rent continuation */}
          <div style={{ background: "#fffbeb", borderRadius: 12, padding: "1rem", border: "1px solid #fde68a" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: "0 0 8px" }}>
              Will you continue paying rent after taking out this loan?
            </p>
            <p style={{ fontSize: 11, color: "#b45309", margin: "0 0 10px", fontStyle: "italic" }}>
              Relevant if you're buying an investment property while renting your own home.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: form.continuingRent === "yes" ? 10 : 0 }}>
              {[
                { value: "no", label: "No — moving into this property" },
                { value: "yes", label: "Yes — I'll still be renting" },
              ].map(opt => (
                <button key={opt.value} onClick={() => set("continuingRent", opt.value as "yes" | "no")}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                    background: form.continuingRent === opt.value ? "#f59e0b" : "#fff",
                    border: form.continuingRent === opt.value ? "none" : "1.5px solid #fde68a",
                    color: form.continuingRent === opt.value ? "#fff" : "#92400e",
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s ease",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {form.continuingRent === "yes" && (
              <Input label="Monthly rent amount" type="number" placeholder="e.g. 2400" value={form.continuingRentAmount} onChange={e => set("continuingRentAmount", e.target.value)} />
            )}
          </div>
        </Card>

        {/* Property & deposit */}
        <Card>
          <SectionLabel emoji="🏡" label="Property & deposit" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Target purchase price" type="number" placeholder="e.g. 750000" value={form.purchasePrice} onChange={e => set("purchasePrice", e.target.value)} />
            <Input label="Deposit saved" type="number" placeholder="e.g. 95000" value={form.deposit} onChange={e => set("deposit", e.target.value)} />
          </div>
          {isInvestment && (
            <div style={{ marginTop: 10, background: "#fff7ed", borderRadius: 10, padding: "8px 12px", border: "1px solid #fed7aa" }}>
              <p style={{ fontSize: 11, color: "#ea580c", margin: 0 }}>
                ⚠ Most lenders require a 20% deposit for investment properties. A smaller deposit may be possible but attracts LMI.
              </p>
            </div>
          )}
        </Card>

        {/* FHOG — owner only */}
        {!isInvestment && (
          <Card>
            <SectionLabel emoji="🎉" label="First home buyer" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Select label="First home buyer?" value={form.firstHome} onChange={e => set("firstHome", e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              <Select label="State" value={form.state} onChange={e => set("state", e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </div>
          </Card>
        )}

        {/* CTA */}
        <button onClick={calculate} style={{
          width: "100%", padding: "15px", borderRadius: 16, marginBottom: "0.75rem",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
        }}>
          Calculate my position 🧮
        </button>

        {/* Results */}
        {results && (
          <div id="results" style={{ marginTop: "2rem" }}>

            {/* Borrowing capacity hero */}
            <div style={{
              borderRadius: 24, padding: "1.75rem",
              background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
              border: "1px solid rgba(255,255,255,0.6)",
              marginBottom: "1rem",
              boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Estimated borrowing capacity
              </p>
              <p style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 8vw, 3rem)",
                fontWeight: 400, color: "#1e293b", lineHeight: 1,
                letterSpacing: "-0.02em", marginBottom: 8,
              }}>
                {fmt(results.borrowingCapacity)}
              </p>
              <p style={{ fontSize: 13, color: "#6d28d9", margin: 0 }}>
                Assessment rate: {((results.contractRate + 0.03) * 100).toFixed(2)}% (APRA 3% buffer included)
                {isInvestment && " · Investment property rate"}
              </p>
            </div>

            {/* Income breakdown */}
            <Card>
              <SectionLabel emoji="📊" label="Income breakdown" />
              <Bar label="Net monthly income" value={results.netMonthlyIncome} max={results.netMonthlyIncome} color="linear-gradient(90deg, #6366f1, #8b5cf6)" />
              <Bar label="Monthly commitments" value={results.totalMonthlyCommitments} max={results.netMonthlyIncome} color="#f87171" />
              <Bar label="Available surplus" value={Math.max(0, results.surplusIncome)} max={results.netMonthlyIncome} color="#34d399" />
            </Card>

            {/* Repayments */}
            <Card>
              <SectionLabel emoji="📅" label="Repayment breakdown" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1rem" }}>
                {[
                  { label: "Monthly", val: fmt(results.monthlyRepayment) },
                  { label: "Fortnightly", val: fmt(results.fortnightlyRepayment) },
                  { label: "Weekly", val: fmt(results.weeklyRepayment) },
                ].map(m => (
                  <div key={m.label} style={{ background: "#f8fafc", borderRadius: 14, padding: "12px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "0 0 3px" }}>{m.val}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{m.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "1rem", border: "1px solid #f1f5f9" }}>
                {[
                  { label: "Total repayable (30 yrs)", value: fmt(results.totalRepayable), color: "#1e293b" },
                  { label: "Total interest", value: fmt(results.totalInterest), color: "#ef4444" },
                  { label: "Debt service ratio", value: `${results.dsr.toFixed(1)}% — ${results.dsr > 35 ? "⚠️ high" : "✅ healthy"}`, color: results.dsr > 35 ? "#ef4444" : "#059669" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* LVR */}
            <Card>
              <SectionLabel emoji="🏦" label="LVR & LMI" />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 400, color: "#1e293b", margin: 0 }}>
                  {results.lvr.toFixed(1)}%
                </p>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99,
                  background: results.lmiApplies ? "#fef2f2" : "#f0fdf4",
                  color: results.lmiApplies ? "#ef4444" : "#16a34a",
                  border: `1px solid ${results.lmiApplies ? "#fecaca" : "#bbf7d0"}`,
                }}>
                  {results.lmiApplies ? "⚠️ LMI applies" : "✅ No LMI required"}
                </span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  width: `${Math.min(results.lvr, 100)}%`,
                  background: results.lvr > 90 ? "linear-gradient(90deg, #f87171, #ef4444)" : results.lvr > 80 ? "linear-gradient(90deg, #fbbf24, #f59e0b)" : "linear-gradient(90deg, #34d399, #10b981)",
                  transition: "width 0.6s ease",
                }} />
              </div>
              {results.lmiApplies ? (
                <div style={{ background: "#fef2f2", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #fecaca" }}>
                  <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>
                    Estimated LMI cost: <strong>{fmt(results.lmiEstimate)}</strong>
                    {isInvestment ? " — a 20% deposit removes this cost entirely." : " — a deposit above 20% removes this cost entirely."}
                  </p>
                </div>
              ) : (
                <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #bbf7d0" }}>
                  <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>Your deposit is above 20% — no LMI required 🎉</p>
                </div>
              )}
              {results.depositGap > 0 && (
                <div style={{ background: "#fffbeb", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #fde68a", marginTop: 10 }}>
                  <p style={{ fontSize: 13, color: "#d97706", margin: 0 }}>
                    ⏳ You need <strong>{fmt(results.depositGap)}</strong> more for a {isInvestment ? "20%" : "5%"} deposit minimum.
                  </p>
                </div>
              )}
            </Card>

            {/* FHOG */}
            {!isInvestment && (
              <Card>
                <SectionLabel emoji="🎁" label="First home owner grant" />
                {results.fhogEligible ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 400, color: "#16a34a", margin: 0 }}>
                        {fmt(results.fhogAmount)}
                      </p>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                        ✅ Likely eligible
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Based on your state ({form.state}) and purchase price. Confirm eligibility with your broker.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      {form.firstHome === "no"
                        ? "FHOG is not available for non-first home buyers."
                        : `Your purchase price exceeds the FHOG threshold for ${form.state}.`}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Disclaimer */}
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "1rem 1.25rem", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.8)" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                ✦ Estimates only. Not financial advice. Based on {(results.contractRate * 100).toFixed(2)}% interest rate, 30-year term, and standard HEM benchmarks. Speak to a licensed mortgage broker for personalised advice.
              </p>
            </div>

            <a href="/house/nextstep" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "14px", borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 15, fontWeight: 600,
              textDecoration: "none", marginBottom: 10,
              boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
            }}>
              Talk to a broker about these numbers 🤝
            </a>

            <button onClick={() => { setResults(null); setForm(defaultForm); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{
              width: "100%", padding: "12px", borderRadius: 16,
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(99,102,241,0.2)",
              color: "#6366f1", fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Try different numbers 🔄
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
