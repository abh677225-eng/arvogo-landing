"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 15%, rgba(99,102,241,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 85%, rgba(14,165,233,0.18) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 15%, rgba(139,92,246,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 85%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #f0f4ff
`;

type CategoryKey = "student" | "pr" | "visitor" | "sponsored" | "whv" | "family";

const CATEGORY_META: Record<CategoryKey, { title: string; emoji: string; color: string }> = {
  student:   { title: "Student visa",        emoji: "🎓", color: "#6366f1" },
  pr:        { title: "Permanent residency", emoji: "⭐", color: "#059669" },
  visitor:   { title: "Visitor visa",        emoji: "✈️", color: "#0ea5e9" },
  sponsored: { title: "Employer sponsored",  emoji: "💼", color: "#d97706" },
  whv:       { title: "Working holiday",     emoji: "🏄", color: "#7c3aed" },
  family:    { title: "Family visa",         emoji: "👨‍👩‍👧", color: "#db2777" },
};

type DocItem = { label: string; note: string; status: "required" | "if-applicable" | "recommended" };

const CATEGORY_DOCS: Record<CategoryKey, { heading: string; docs: DocItem[] }> = {
  student: {
    heading: "Documents for your student visa application",
    docs: [
      { label: "Valid passport", note: "Must be valid for duration of your course", status: "required" },
      { label: "Confirmation of Enrolment (CoE)", note: "Issued by your institution after accepting your offer", status: "required" },
      { label: "Overseas Student Health Cover (OSHC)", note: "Must be arranged before lodging — from an approved insurer", status: "required" },
      { label: "Genuine Temporary Entrant (GTE) statement", note: "Written explanation of why you want to study in Australia", status: "required" },
      { label: "Proof of financial capacity", note: "Bank statements showing funds for tuition + living costs", status: "required" },
      { label: "English language test results", note: "IELTS, TOEFL, PTE etc — if required for your course", status: "if-applicable" },
      { label: "Academic transcripts", note: "From your most recent institution", status: "required" },
      { label: "Immunisation records", note: "Required for health requirement", status: "if-applicable" },
    ],
  },
  pr: {
    heading: "Documents for your skilled PR application",
    docs: [
      { label: "Skills assessment outcome", note: "Positive result from your relevant assessing authority", status: "required" },
      { label: "English test results", note: "IELTS, PTE or OET — must meet competent English minimum", status: "required" },
      { label: "Employment evidence", note: "Reference letters, payslips, contracts for all nominated employment", status: "required" },
      { label: "Educational qualification documents", note: "Degrees, transcripts, certified translations if not in English", status: "required" },
      { label: "Expression of Interest (EOI) in SkillSelect", note: "Submitted online — invitation required before applying", status: "required" },
      { label: "State nomination letter", note: "For 190 and 491 visas only", status: "if-applicable" },
      { label: "Partner evidence", note: "Marriage certificate, relationship evidence if claiming partner points", status: "if-applicable" },
      { label: "National police clearances", note: "From each country you've lived in for 12+ months", status: "required" },
      { label: "Health examination", note: "Completed through an approved BUPA panel doctor", status: "required" },
    ],
  },
  visitor: {
    heading: "Documents for your visitor visa application",
    docs: [
      { label: "Valid passport", note: "Must be valid for intended stay", status: "required" },
      { label: "Proof of ties to home country", note: "Employment letter, property documents, family evidence", status: "required" },
      { label: "Financial evidence", note: "Bank statements showing capacity to fund your visit", status: "required" },
      { label: "Travel itinerary", note: "Planned dates and purpose of visit", status: "recommended" },
      { label: "Invitation letter", note: "If visiting friends or family in Australia", status: "if-applicable" },
      { label: "Health insurance", note: "Overseas Visitor Health Cover (OVHC) recommended", status: "recommended" },
    ],
  },
  sponsored: {
    heading: "Documents for your 482 employer sponsored application",
    docs: [
      { label: "Employment contract or offer letter", note: "From your sponsoring employer, showing salary and position", status: "required" },
      { label: "Skills assessment (if required)", note: "Some occupations require assessment — check with your agent", status: "if-applicable" },
      { label: "English test results", note: "Must meet the required level for your occupation stream", status: "required" },
      { label: "Educational qualifications", note: "Relevant to your nominated occupation", status: "required" },
      { label: "Employment evidence", note: "For the past 5 years — payslips, references, contracts", status: "required" },
      { label: "National police clearances", note: "From each country you've lived in for 12+ months", status: "required" },
      { label: "Health examination", note: "Completed through a BUPA approved panel doctor", status: "required" },
    ],
  },
  whv: {
    heading: "What you need for your working holiday visa",
    docs: [
      { label: "Valid passport", note: "Must be from an eligible country", status: "required" },
      { label: "Application fee", note: "AUD $635 — payable online at time of application", status: "required" },
      { label: "ImmiAccount login", note: "Create at immi.homeaffairs.gov.au before applying", status: "required" },
      { label: "Health declaration", note: "Answered as part of the online application — no medical required", status: "required" },
      { label: "Evidence of regional work (2nd/3rd year only)", note: "Payslips and employer confirmation of 88 days / 6 months regional work", status: "if-applicable" },
    ],
  },
  family: {
    heading: "Documents for your family visa application",
    docs: [
      { label: "Sponsor's Australian citizenship or PR evidence", note: "Citizenship certificate or visa grant letter", status: "required" },
      { label: "Relationship evidence", note: "Marriage certificate, photos, communications, joint finances", status: "required" },
      { label: "Sponsor's identity documents", note: "Passport, birth certificate", status: "required" },
      { label: "Your passport", note: "Valid for duration of the application processing", status: "required" },
      { label: "Police clearances", note: "From each country you've lived in for 12+ months", status: "required" },
      { label: "Health examination", note: "Through a BUPA approved panel doctor", status: "required" },
      { label: "Sponsorship declaration form", note: "Completed and signed by your Australian sponsor", status: "required" },
    ],
  },
};

const PROFESSIONALS = [
  {
    key: "agent",
    emoji: "⚖️",
    title: "Registered migration agent (MARA)",
    what: "Lodges visa applications on your behalf, advises on visa type and eligibility, and handles all Department of Home Affairs correspondence.",
    when: "For any complex application — PR, family, employer sponsored. Working holiday and eVisitor/ETA you can usually do yourself.",
    cost: "From $500 (simple) to $5,000+ (PR/family). Free consultation typically available.",
    costType: "paid" as const,
    status: "essential" as const,
    statusNote: "Required for PR, family and employer sponsored",
    iconBg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
    showFor: ["student", "pr", "visitor", "sponsored", "family"] as CategoryKey[],
  },
  {
    key: "education",
    emoji: "🎓",
    title: "Education agent",
    what: "Helps with institution selection, course advice, and managing your CoE. Usually free to students — paid by the institution.",
    when: "Before you choose an institution or apply for your CoE.",
    cost: "Free — paid by institutions",
    costType: "free" as const,
    status: "recommended" as const,
    statusNote: "Useful if still choosing an institution",
    iconBg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    showFor: ["student"] as CategoryKey[],
  },
  {
    key: "english",
    emoji: "📖",
    title: "English test prep provider",
    what: "Structured preparation for IELTS, PTE or OET. Higher English scores mean more points for PR and better visa outcomes.",
    when: "Before taking your English test — especially if aiming for superior English (IELTS 8+) for extra PR points.",
    cost: "Course fees vary — typically $300–$1,500",
    costType: "paid" as const,
    status: "recommended" as const,
    statusNote: "Worth it for PR — each band score level adds 10 points",
    iconBg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    showFor: ["pr", "sponsored", "student"] as CategoryKey[],
  },
];

function StatusBadge({ status }: { status: "essential" | "recommended" }) {
  const cfg = {
    essential:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "✓ Essential" },
    recommended: { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "⚠ Recommended" },
  }[status];
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>{cfg.label}</span>;
}

function DocStatusBadge({ status }: { status: "required" | "if-applicable" | "recommended" }) {
  const cfg = {
    required:      { bg: "#fef2f2", color: "#ef4444", border: "#fecaca", label: "Required" },
    "if-applicable": { bg: "#fffbeb", color: "#d97706", border: "#fde68a", label: "If applicable" },
    recommended:   { bg: "#eef2ff", color: "#6366f1", border: "#c7d2fe", label: "Recommended" },
  }[status];
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, textTransform: "uppercase" as const, letterSpacing: "0.04em", flexShrink: 0 }}>{cfg.label}</span>;
}

type LeadForm = { name: string; email: string; phone: string; message: string };

export default function VisaNextStep() {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryKey>("pr");
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set());
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(["agent"]));

  useEffect(() => {
    const cat = (sessionStorage.getItem("visaCategory") || "pr") as CategoryKey;
    setCategory(cat);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const meta = CATEGORY_META[category];
  const docsData = CATEGORY_DOCS[category];
  const visibleProfessionals = PROFESSIONALS.filter(p => p.showFor.includes(category));
  const isValid = name.trim() && email.trim() && selected.size > 0;

  function toggleDoc(i: number) { setCheckedDocs(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; }); }
  function togglePro(key: string) { setSelected(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; }); }

  async function handleSubmit() {
    if (!isValid) return;
    setSubmitting(true);
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, message, categories: Array.from(selected), visaCategory: category, type: "visa" }) });
    setSubmitted(true); setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", outline: "none", boxSizing: "border-box" };

  return (
    <main style={{ minHeight: "100vh", background: meshBg, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: "4rem", paddingBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        <button onClick={() => router.push("/visa/position")} style={{ background: "none", border: "none", fontSize: 13, color: "#64748b", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>← Back</button>

        {/* Header */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.1)", borderRadius: 99, padding: "3px 10px", marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>{meta.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{meta.title}</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.4rem, 4vw, 1.75rem)", fontWeight: 400, color: "#1e293b", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 8 }}>What to prepare 📋</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>Documents you'll need and professionals who can help — specific to your {meta.title.toLowerCase()} situation.</p>
        </div>

        {/* PR points link */}
        {category === "pr" && (
          <a href="/visa/points" style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, rgba(238,242,255,0.95), rgba(224,231,255,0.95))", borderRadius: 20, border: "1.5px solid rgba(99,102,241,0.2)", padding: "1.25rem 1.5rem", marginBottom: "1rem", textDecoration: "none", boxShadow: "0 4px 24px rgba(99,102,241,0.08)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧮</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#4338ca", margin: "0 0 2px" }}>Points calculator</p>
              <p style={{ fontSize: 12, color: "#6366f1", margin: 0 }}>See your score across 189, 190 and 491 pathways — updates live.</p>
            </div>
            <span style={{ fontSize: 18, color: "#6366f1" }}>→</span>
          </a>
        )}

        {/* Documents checklist */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.25rem 1.5rem", marginBottom: "1rem", boxShadow: "0 4px 24px rgba(99,102,241,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg, #fef3c7, #fde68a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 1px" }}>{docsData.heading}</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Tick off what you've gathered.</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {docsData.docs.map((doc, i) => {
              const isChecked = checkedDocs.has(i);
              return (
                <div key={i} onClick={() => toggleDoc(i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: isChecked ? "#f0fdf4" : "#f8fafc", borderRadius: 12, padding: "9px 12px", border: `1px solid ${isChecked ? "#d1fae5" : "#f1f5f9"}`, cursor: "pointer", transition: "all 0.15s ease" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, background: isChecked ? "#059669" : "#f1f5f9", border: isChecked ? "none" : "2px solid #d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", transition: "all 0.15s ease" }}>{isChecked ? "✓" : ""}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: isChecked ? "#94a3b8" : "#1e293b", margin: 0, textDecoration: isChecked ? "line-through" : "none" }}>{doc.label}</p>
                      <DocStatusBadge status={doc.status} />
                    </div>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{doc.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "10px 0 0" }}>
            ✦ Document requirements vary by individual circumstances. Confirm with a migration agent or at{" "}
            <a href="https://www.immi.homeaffairs.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>immi.homeaffairs.gov.au</a>
          </p>
        </div>

        {/* Professionals + form */}
        {submitted ? (
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "2rem", textAlign: "center", boxShadow: "0 4px 24px rgba(99,102,241,0.06)", marginBottom: "1rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", margin: "0 auto 1rem", background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✅</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8 }}>Request received</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem" }}>We'll connect you within 1 business day. No obligation.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {Array.from(selected).map(key => { const p = PROFESSIONALS.find(x => x.key === key); return p ? <span key={key} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 99, background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe" }}>{p.emoji} {p.title}</span> : null; })}
            </div>
          </div>
        ) : (
          <>
            {/* Professional checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
              {visibleProfessionals.map(pro => {
                const isChecked = selected.has(pro.key);
                return (
                  <div key={pro.key} onClick={() => togglePro(pro.key)} style={{ background: isChecked ? "rgba(238,242,255,0.95)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 18, border: isChecked ? "2px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.9)", padding: "1rem 1.25rem", cursor: "pointer", boxShadow: isChecked ? "0 4px 20px rgba(99,102,241,0.1)" : "0 2px 12px rgba(99,102,241,0.03)", transition: "all 0.15s ease" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, background: isChecked ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f1f5f9", border: isChecked ? "none" : "2px solid #e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", transition: "all 0.15s ease", boxShadow: isChecked ? "0 2px 8px rgba(99,102,241,0.3)" : "none" }}>{isChecked ? "✓" : ""}</div>
                      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: pro.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{pro.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{pro.title}</p>
                          <StatusBadge status={pro.status} />
                        </div>
                        <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "0 0 4px" }}>{pro.statusNote}</p>
                        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 6px" }}>{pro.what}</p>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: pro.costType === "free" ? "#f0fdf4" : "#fff7ed", border: `1px solid ${pro.costType === "free" ? "#bbf7d0" : "#fed7aa"}`, borderRadius: 99, padding: "2px 9px", fontSize: 11, fontWeight: 600, color: pro.costType === "free" ? "#16a34a" : "#ea580c" }}>
                          {pro.costType === "free" ? "✓" : "💰"} {pro.cost}
                        </span>
                        <div style={{ padding: "6px 10px", borderRadius: 8, background: isChecked ? "rgba(255,255,255,0.7)" : "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "flex-start", gap: 6, marginTop: 6 }}>
                          <span style={{ fontSize: 12, flexShrink: 0 }}>⏰</span>
                          <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}><strong style={{ color: "#475569" }}>When:</strong> {pro.when}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shared form */}
            <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.06)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Your details</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Your name</label><input type="text" placeholder="e.g. Alex" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                  <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Phone (optional)</label><input type="tel" placeholder="04xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                </div>
                <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Email address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
                <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Tell us about your situation (optional)</label><textarea placeholder={`e.g. ${category === "pr" ? "Software engineer, 8 years experience, currently on 482 visa, 80 points..." : category === "student" ? "Starting a Masters in February, offshore application, offer from RMIT..." : "Brief description of your situation..."}`} value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" as const }} onFocus={e => e.target.style.borderColor = "#a5b4fc"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
              </div>
              {selected.size > 0 && <div style={{ marginTop: "1rem", marginBottom: "1rem" }}><p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 6px" }}>Requesting introductions to:</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{Array.from(selected).map(key => { const p = PROFESSIONALS.find(x => x.key === key); return p ? <span key={key} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe" }}>{p.emoji} {p.title}</span> : null; })}</div></div>}
              {selected.size === 0 && <p style={{ fontSize: 12, color: "#f59e0b", margin: "1rem 0 0", textAlign: "center" }}>↑ Select at least one professional above</p>}
              <button onClick={handleSubmit} disabled={!isValid || submitting} style={{ width: "100%", padding: "13px", borderRadius: 12, marginTop: "1rem", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: isValid ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: isValid ? 1 : 0.45, boxShadow: isValid ? "0 4px 20px rgba(99,102,241,0.3)" : "none", transition: "opacity 0.15s ease" }}>
                {submitting ? "Sending... ⏳" : "Request introductions ✦"}
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0" }}>We'll be in touch within 1 business day. No obligation.</p>
            </div>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          ✦ This is orientation only, not legal advice. Visa rules change — confirm with a MARA-registered migration agent.
        </p>
      </div>
    </main>
  );
}
