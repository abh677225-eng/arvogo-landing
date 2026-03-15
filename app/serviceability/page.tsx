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

function calcAnnualTax(gross: number): number {
  if (gross <= 18200) return 0;
  if (gross <= 45000) return (gross - 18200) * 0.19;
  if (gross <= 120000) return 5092 + (gross - 45000) * 0.325;
  if (gross <= 180000) return 29467 + (gross - 120000) * 0.37;
  return 51667 + (gross - 180000) * 0.45;
}

function calcHEM(grossIncome: number, hasPartner: boolean, dependants: number): number {
  let base: number;
  if (!hasPartner) {
    base = grossIncome < 50000 ? 2100 : grossIncome < 100000 ? 2400 : 2800;
  } else {
    base = grossIncome < 80000 ? 3100 : grossIncome < 150000 ? 3500 : 4000;
  }
  return base + dependants * 650;
}

const defaultForm = {
  income1: "", income2: "", dependants: "0",
  carLoan: "", creditCards: "", otherLiabilities: "",
  deposit: "", purchasePrice: "", monthlySavings: "",
  firstHome: "yes", state: "VIC",
};

function calculateResults(form: typeof defaultForm): Results {
  const income1 = parseFloat(form.income1) || 0;
  const income2 = parseFloat(form.income2) || 0;
  const grossIncome = income1 + income2;
  const hasPartner = income2 > 0;
  const tax1 = calcAnnualTax(income1) + income1 * 0.02;
  const tax2 = calcAnnualTax(income2) + income2 * 0.02;
  const netMonthlyIncome = (grossIncome - tax1 - tax2) / 12;
  const dependants = parseInt(form.dependants) || 0;
  const carLoan = parseFloat(form.carLoan) || 0;
  const creditCardLimit = parseFloat(form.creditCards) || 0;
  const creditCardMonthly = (creditCardLimit * 0.038) / 12;
  const otherLiabilities = parseFloat(form.otherLiabilities) || 0;
  const hem = calcHEM(grossIncome, hasPartner, dependants);
  const debtRepayments = carLoan + creditCardMonthly + otherLiabilities;
  const totalMonthlyCommitments = debtRepayments + hem;
  const contractRate = 0.0625;
  const assessmentRate = contractRate + 0.03;
  const months = 30 * 12;
  const monthlyAssessRate = assessmentRate / 12;
  const surplusIncome = netMonthlyIncome - totalMonthlyCommitments;
  const maxMonthlyRepayment = Math.max(0, surplusIncome);
  const borrowingCapacity = maxMonthlyRepayment > 0
    ? Math.round((maxMonthlyRepayment * (Math.pow(1 + monthlyAssessRate, months) - 1)) /
        (monthlyAssessRate * Math.pow(1 + monthlyAssessRate, months)))
    : 0;
  const purchasePrice = parseFloat(form.purchasePrice) || borrowingCapacity * 1.1;
  const deposit = parseFloat(form.deposit) || 0;
  const loanAmount = Math.max(0, purchasePrice - deposit);
  const lvr = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;
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
  const dsr = grossIncome > 0 ? ((monthlyRepayment * 12) / grossIncome) * 100 : 0;
  return {
    borrowingCapacity, monthlyRepayment,
    fortnightlyRepayment: Math.round(monthlyRepayment * 12 / 26),
    weeklyRepayment: Math.round(monthlyRepayment * 12 / 52),
    totalRepayable, totalInterest, lvr, lmiApplies, lmiEstimate,
    fhogEligible, fhogAmount, depositGap, monthsToSave,
    netMonthlyIncome, totalMonthlyCommitments, surplusIncome, dsr, loanAmount,
  };
}

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("en-AU");
}

function card(children: React.ReactNode, mb = "1rem") {
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
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>{emoji}</div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

function InputField({ label, note, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; note?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{label}</label>
      {note && <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 4px" }}>{note}</p>}
      <input
        {...props}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 10,
          border: "1.5px solid #e2e8f0", fontSize: 14,
          fontFamily: "inherit", background: "#f8fafc",
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s ease",
        }}
        onFocus={e => e.target.style.borderColor = "#a5b4fc"}
        onBlur={e => e.target.style.borderColor = "#e2e8f0"}
      />
    </div>
  );
}

function SelectField({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{label}</label>
      <select
        {...props}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 10,
          border: "1.5px solid #e2e8f0", fontSize: 14,
          fontFamily: "inherit", background: "#f8fafc",
          outline: "none", boxSizing: "border-box",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function MetricCard({ emoji, label, value, sub, accent }: { emoji: string; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", borderRadius: 16,
      padding: "1rem", textAlign: "center",
      border: "1px solid rgba(99,102,241,0.1)",
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: accent || "#1e293b", margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 99,
          background: color, transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

export default function ServiceabilityCalculator() {
  const [form, setForm] = useState(defaultForm);
  const [results, setResults] = useState<Results | null>(null);

  function set(key: keyof typeof defaultForm, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function calculate() {
    setResults(calculateResults(form));
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem" }}>

        {/* Back */}
        <a href="/house" style={{
          fontSize: 13, color: "#64748b", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6, marginBottom: "2rem",
        }}>
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
            Understand your position before speaking to a broker. Based on real bank methodology.
          </p>
        </div>

        {/* Income */}
        {card(
          <>
            <SectionLabel emoji="💼" label="Income" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <InputField label="Your gross income (p.a.)" placeholder="e.g. 95000" type="number" value={form.income1} onChange={e => set("income1", e.target.value)} />
              <InputField label="Partner income (p.a.)" placeholder="Optional" type="number" value={form.income2} onChange={e => set("income2", e.target.value)} />
            </div>
            <SelectField label="Dependants" value={form.dependants} onChange={e => set("dependants", e.target.value)}>
              {["0","1","2","3","4","5+"].map(n => <option key={n}>{n}</option>)}
            </SelectField>
          </>
        )}

        {/* Liabilities */}
        {card(
          <>
            <SectionLabel emoji="💳" label="Monthly liabilities" />
            <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic", marginBottom: "1rem", marginTop: "-0.5rem" }}>
              ✦ Living expenses are auto-estimated using the bank HEM benchmark — only enter actual loan repayments.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <InputField label="Car loan repayment/month" placeholder="e.g. 650" type="number" value={form.carLoan} onChange={e => set("carLoan", e.target.value)} />
              <InputField label="Credit card limits (total)" placeholder="e.g. 10000" type="number" value={form.creditCards} onChange={e => set("creditCards", e.target.value)} />
            </div>
            <InputField label="Other loan repayments/month (not rent)" placeholder="e.g. 300" type="number" value={form.otherLiabilities} onChange={e => set("otherLiabilities", e.target.value)} />
          </>
        )}

        {/* Property */}
        {card(
          <>
            <SectionLabel emoji="🏡" label="Property & deposit" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <InputField label="Target purchase price" placeholder="e.g. 750000" type="number" value={form.purchasePrice} onChange={e => set("purchasePrice", e.target.value)} />
              <InputField label="Deposit saved" placeholder="e.g. 95000" type="number" value={form.deposit} onChange={e => set("deposit", e.target.value)} />
            </div>
            <InputField label="Monthly savings capacity" placeholder="e.g. 2000" type="number" value={form.monthlySavings} onChange={e => set("monthlySavings", e.target.value)} />
          </>
        )}

        {/* FHOG */}
        {card(
          <>
            <SectionLabel emoji="🎉" label="First home buyer" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <SelectField label="First home buyer?" value={form.firstHome} onChange={e => set("firstHome", e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </SelectField>
              <SelectField label="State" value={form.state} onChange={e => set("state", e.target.value)}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </SelectField>
            </div>
          </>
        , "1.5rem")}

        {/* CTA */}
        <button
          onClick={calculate}
          style={{
            width: "100%", padding: "15px", borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", color: "#fff", fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            marginBottom: "0.75rem",
          }}
        >
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
                Based on a 9.25% assessment rate (APRA buffer included)
              </p>
            </div>

            {/* Income breakdown */}
            {card(
              <>
                <SectionLabel emoji="📊" label="Income breakdown" />
                <Bar label="Net monthly income" value={results.netMonthlyIncome} max={results.netMonthlyIncome} color="linear-gradient(90deg, #6366f1, #8b5cf6)" />
                <Bar label="Monthly commitments" value={results.totalMonthlyCommitments} max={results.netMonthlyIncome} color="#f87171" />
                <Bar label="Available surplus" value={Math.max(0, results.surplusIncome)} max={results.netMonthlyIncome} color="#34d399" />
              </>
            )}

            {/* Repayments */}
            {card(
              <>
                <SectionLabel emoji="📅" label="Repayment breakdown" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1rem" }}>
                  <MetricCard emoji="📆" label="Monthly" value={fmt(results.monthlyRepayment)} />
                  <MetricCard emoji="🗓️" label="Fortnightly" value={fmt(results.fortnightlyRepayment)} />
                  <MetricCard emoji="📅" label="Weekly" value={fmt(results.weeklyRepayment)} />
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
              </>
            )}

            {/* LVR */}
            {card(
              <>
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
                    background: results.lvr > 90
                      ? "linear-gradient(90deg, #f87171, #ef4444)"
                      : results.lvr > 80
                      ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                      : "linear-gradient(90deg, #34d399, #10b981)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                {results.lmiApplies ? (
                  <div style={{ background: "#fef2f2", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #fecaca" }}>
                    <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>
                      Estimated LMI cost: <strong>{fmt(results.lmiEstimate)}</strong> — a 20%+ deposit removes this entirely.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #bbf7d0" }}>
                    <p style={{ fontSize: 13, color: "#16a34a", margin: 0 }}>
                      Your deposit is above 20% — no LMI required 🎉
                    </p>
                  </div>
                )}
              </>
            )}

            {/* FHOG */}
            {card(
              <>
                <SectionLabel emoji="🎁" label="First home owner grant" />
                {results.fhogEligible ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", fontWeight: 400, color: "#16a34a", margin: 0 }}>
                        {fmt(results.fhogAmount)}
                      </p>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99,
                        background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
                      }}>
                        ✅ Likely eligible
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Based on your state ({form.state}) and purchase price. Confirm with your broker or state revenue office.
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
                {results.depositGap > 0 && (
                  <div style={{ background: "#fffbeb", borderRadius: 12, padding: "0.75rem 1rem", border: "1px solid #fde68a", marginTop: 10 }}>
                    <p style={{ fontSize: 13, color: "#d97706", margin: 0 }}>
                      ⏳ You need <strong>{fmt(results.depositGap)}</strong> more for a 5% deposit — about <strong>{results.monthsToSave} months</strong> at your savings rate.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Disclaimer */}
            <div style={{
              background: "rgba(255,255,255,0.6)", borderRadius: 16,
              padding: "1rem 1.25rem", marginBottom: "1rem",
              border: "1px solid rgba(255,255,255,0.8)",
            }}>
              <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
                ✦ This calculator provides estimates only and does not constitute financial advice. Based on 6.25% interest rate, 30-year term, and standard HEM benchmarks. Speak to a licensed mortgage broker for personalised advice.
              </p>
            </div>

            {/* CTA */}
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
              Start over 🔄
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
