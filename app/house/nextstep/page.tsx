"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const meshBg = `
  radial-gradient(ellipse at 20% 20%, rgba(139,92,246,0.2) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.1) 0%, transparent 50%),
  #eef2ff
`;

type PositionKey = "exploring" | "considering" | "preparing" | "in-process";

function mapAnswersToPosition(answers: (string | null)[]): PositionKey {
  const stability = answers[2];
  const execution = answers[3];
  if (execution === "I'm already making offers") return "in-process";
  if (execution === "I'm actively looking") {
    if (stability === "Uncertain" || stability === "It's complicated") return "considering";
    return "preparing";
  }
  if (execution === "I've been browsing a bit") return "considering";
  return "exploring";
}

const INTROS: Record<PositionKey, { heading: string; subtext: string }> = {
  exploring: {
    heading: "Not ready for a broker yet — and that's fine 👋",
    subtext: "A good broker won't push you. They'll help you understand what's actually possible so the whole decision feels less abstract — with no obligation to go any further.",
  },
  considering: {
    heading: "A conversation, not a commitment 💬",
    subtext: "You're not applying for anything. A quick chat with a broker can give you a clearer picture of what's realistic — so you can decide whether to take this further with real information.",
  },
  preparing: {
    heading: "This is a good time to talk to a broker 🎯",
    subtext: "Before narrowing in on a specific home, it really helps to know your borrowing position. A broker can give you that clarity without locking you into anything.",
  },
  "in-process": {
    heading: "You probably need a broker now ⚡",
    subtext: "If you're making offers or close to it, having a broker in your corner makes a real difference — on speed, on lender choice, and on avoiding costly mistakes.",
  },
};

const PROVIDERS = [
  {
    name: "Sarah Mitchell",
    initials: "SM",
    title: "Mortgage Broker · Melbourne",
    blurb: "Sarah works with first home buyers who aren't sure where to start. She's known for making the whole process feel less overwhelming — no jargon, no rush, just clear guidance.",
    tag: "🏠 First home buyers",
  },
  {
    name: "James Okafor",
    initials: "JO",
    title: "Mortgage Broker · Melbourne & surrounds",
    blurb: "James specialises in helping buyers understand their real borrowing position early — before they start looking at homes. He's direct, thorough, and easy to talk to.",
    tag: "💡 Borrowing clarity",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    title: "Mortgage Broker · Victoria-wide",
    blurb: "Priya focuses on buyers who find the financial side of things stressful. She takes the time to explain everything clearly and won't push you toward anything that doesn't fit.",
    tag: "😌 Low-pressure approach",
  },
];

type LeadForm = { name: string; email: string; phone: string; message: string };
type SubmitState = "idle" | "submitting" | "done";

export default function HouseNextStep() {
  const router = useRouter();
  const [position, setPosition] = useState<PositionKey>("exploring");
  const [visible, setVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof PROVIDERS[0] | null>(null);
  const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", message: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem("houseAnswers");
    if (!raw) return;
    setPosition(mapAnswersToPosition(JSON.parse(raw)));
    setTimeout(() => setVisible(true), 100);
  }, []);

  const intro = INTROS[position];

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitState("submitting");
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, provider: selectedProvider?.name, position }),
    });
    setSubmitState("done");
  }

  return (
    <main style={{
      minHeight: "100vh", background: meshBg,
      fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 1rem",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{
        maxWidth: 520, margin: "0 auto",
        paddingTop: "4rem", paddingBottom: "4rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>

        <button onClick={() => router.push("/house/position")} style={{
          background: "none", border: "none", fontSize: 13, color: "#64748b",
          cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: 6, padding: 0,
        }}>← Back</button>

        {/* Intro */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
          padding: "1.5rem", marginBottom: "1.25rem",
          boxShadow: "0 4px 24px rgba(99,102,241,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            A possible next step
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
            fontWeight: 400, color: "#1e293b", lineHeight: 1.25,
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>{intro.heading}</h1>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{intro.subtext}</p>
        </div>

        {/* Provider cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.25rem" }}>
          {PROVIDERS.map((p) => (
            <div key={p.name} style={{
              background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
              borderRadius: 20, border: "1px solid rgba(255,255,255,0.9)",
              padding: "1.25rem", boxShadow: "0 4px 24px rgba(99,102,241,0.04)",
            }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff",
                }}>{p.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: 0 }}>{p.name}</p>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 99,
                      background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe",
                    }}>{p.tag}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{p.title}</p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 99,
                    background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
                  }}>✓ Verified</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 12 }}>{p.blurb}</p>
              <button
                onClick={() => { setSelectedProvider(p); setSubmitState("idle"); setForm({ name: "", email: "", phone: "", message: "" }); }}
                style={{
                  width: "100%", padding: "10px 16px", borderRadius: 12,
                  background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                  border: "1.5px solid rgba(99,102,241,0.2)",
                  color: "#4338ca", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Connect with {p.name.split(" ")[0]} 👋
              </button>
            </div>
          ))}
        </div>

        {/* Soft footer */}
        <div style={{
          background: "rgba(255,255,255,0.7)", borderRadius: 16,
          padding: "1rem 1.25rem", border: "1px solid rgba(255,255,255,0.8)",
          marginBottom: "1rem",
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 3 }}>
            Not ready to talk to anyone yet?
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
            That's completely fine.{" "}
            <a href="/serviceability" style={{ color: "#6366f1", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Try the serviceability calculator
            </a>{" "}
            to get a rough sense of your position on your own terms.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>
          ✦ Every broker on Arvogo has agreed to keep it low-pressure and honest.
        </p>

      </div>

      {/* Modal */}
      {selectedProvider && (
        <div
          onClick={() => setSelectedProvider(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 420,
              background: "rgba(255,255,255,0.98)",
              borderRadius: 24, padding: "2rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            {submitState === "done" ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 1rem",
                  background: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                }}>✅</div>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.5rem", fontWeight: 400, color: "#1e293b", marginBottom: 8,
                }}>Request sent!</h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {selectedProvider.name.split(" ")[0]} will be in touch shortly. No obligation — just a conversation.
                </p>
                <button onClick={() => setSelectedProvider(null)} style={{
                  padding: "10px 24px", borderRadius: 12,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>Done ✦</button>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.4rem", fontWeight: 400, color: "#1e293b", marginBottom: 4,
                }}>
                  Connect with {selectedProvider.name.split(" ")[0]}
                </h2>
                <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: "1.5rem" }}>
                  No obligation. Just a relaxed introductory chat.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1rem" }}>
                  {[
                    { key: "name", label: "Your name", placeholder: "e.g. Alex", type: "text" },
                    { key: "email", label: "Email address", placeholder: "you@email.com", type: "email" },
                    { key: "phone", label: "Phone (optional)", placeholder: "04xx xxx xxx", type: "tel" },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof LeadForm]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: 10,
                          border: "1.5px solid #e2e8f0", fontSize: 14,
                          fontFamily: "inherit", background: "#f8fafc",
                          outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Anything to share? (optional)</label>
                    <textarea
                      placeholder="e.g. First home buyer, not sure where to start..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={3}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 10,
                        border: "1.5px solid #e2e8f0", fontSize: 14,
                        fontFamily: "inherit", background: "#f8fafc",
                        outline: "none", resize: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!form.name.trim() || !form.email.trim() || submitState === "submitting"}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 12,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", marginBottom: 8,
                    opacity: !form.name.trim() || !form.email.trim() ? 0.5 : 1,
                  }}
                >
                  {submitState === "submitting" ? "Sending... ⏳" : "Send introduction request ✦"}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: 0 }}>
                  Your details are only shared with {selectedProvider.name.split(" ")[0]}.
                </p>
                <button onClick={() => setSelectedProvider(null)} style={{
                  display: "block", width: "100%", marginTop: 8,
                  background: "none", border: "none", fontSize: 12,
                  color: "#94a3b8", cursor: "pointer", fontFamily: "inherit",
                }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
