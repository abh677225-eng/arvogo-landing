import { NextRequest, NextResponse } from "next/server";

const YOUR_EMAIL = "abh677225@gmail.com";

// ── LABEL MAPS ─────────────────────────────────────────────

const WORKFLOW_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  house:    { label: "Home buying",        color: "#6366f1", emoji: "🏡" },
  business: { label: "Starting a business", color: "#059669", emoji: "🚀" },
  visa:     { label: "Visa application",    color: "#0ea5e9", emoji: "🌏" },
};

const CATEGORY_LABELS: Record<string, string> = {
  // House
  "broker":          "🏦 Mortgage broker",
  "buyers-agent":    "🔍 Buyers agent",
  "conveyancer":     "📋 Conveyancer",
  "building-pest":   "🔬 Building & pest inspector",
  // Business
  "accountant":      "🧮 Accountant",
  "banker":          "🏦 Business banker",
  "insurance":       "🛡️ Insurance broker",
  "lawyer":          "⚖️ Business lawyer",
  // Visa
  "agent":           "⚖️ Migration agent (MARA)",
};

const POSITION_LABELS: Record<string, string> = {
  // House
  "browsing":        "👀 Just browsing",
  "searching":       "🔍 Actively searching",
  "buying":          "🏡 Ready to buy",
  // Business
  "exploring":       "💡 Still exploring",
  "setting-up":      "🔧 Setting up",
  "already-trading": "📈 Already trading",
};

const VISA_CATEGORY_LABELS: Record<string, string> = {
  "student":   "🎓 Student visa",
  "pr":        "⭐ Permanent residency",
  "visitor":   "✈️ Visitor / tourist",
  "sponsored": "💼 Employer sponsored",
  "whv":       "🏄 Working holiday",
  "family":    "👨‍👩‍👧 Family visa",
};

const STATE_LABELS: Record<string, string> = {
  VIC: "Victoria", NSW: "New South Wales", QLD: "Queensland",
  SA: "South Australia", WA: "Western Australia", TAS: "Tasmania",
  ACT: "Australian Capital Territory", NT: "Northern Territory",
};

// ── HELPER ─────────────────────────────────────────────────

function row(label: string, value: string | undefined | null, link?: string) {
  if (!value) return "";
  const display = link
    ? `<a href="${link}" style="color: #6366f1;">${value}</a>`
    : `<span style="color: #1e293b; font-weight: 600;">${value}</span>`;
  return `
    <tr>
      <td style="color: #64748b; padding: 5px 0; width: 160px; font-size: 13px; vertical-align: top;">${label}</td>
      <td style="padding: 5px 0; font-size: 13px;">${display}</td>
    </tr>`;
}

// ── HANDLER ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, message,
      categories,
      // Context
      type,           // "house" | "business" | "visa" (set by nextstep pages)
      position,       // position key
      state,          // state code e.g. "VIC"
      isFirstHome,    // boolean
      visaCategory,   // visa category key
    } = body;

    // Derive workflow from type or categories
    const workflowKey = type || (
      categories?.includes("agent") ? "visa" :
      categories?.includes("accountant") ? "business" : "house"
    );
    const workflow = WORKFLOW_LABELS[workflowKey] || { label: workflowKey, color: "#6366f1", emoji: "📋" };

    // Format categories
    const categoryList = Array.isArray(categories)
      ? categories.map((c: string) => CATEGORY_LABELS[c] || c).join("<br>")
      : CATEGORY_LABELS[categories] || categories || "Not specified";

    // Email subject
    const catCount = Array.isArray(categories) ? categories.length : 1;
    const subject = `${workflow.emoji} ${workflow.label} lead — ${name} (${catCount} introduction${catCount > 1 ? "s" : ""})`;

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${workflow.color}, ${workflow.color}cc); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px;">
          <p style="color: rgba(255,255,255,0.8); font-size: 11px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.08em;">New lead from Arvogo · ${workflow.emoji} ${workflow.label}</p>
          <h1 style="color: #fff; font-size: 20px; margin: 0; font-weight: 600;">${name} is looking for an introduction</h1>
        </div>

        <!-- Contact -->
        <div style="background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 10px;">Contact details</p>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Name", name)}
            ${row("Email", email, `mailto:${email}`)}
            ${row("Phone", phone || null)}
          </table>
        </div>

        <!-- Workflow context -->
        <div style="background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 10px;">Their situation</p>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Workflow", `${workflow.emoji} ${workflow.label}`)}
            ${position ? row("Position", POSITION_LABELS[position] || position) : ""}
            ${visaCategory ? row("Visa category", VISA_CATEGORY_LABELS[visaCategory] || visaCategory) : ""}
            ${state ? row("State", STATE_LABELS[state] || state) : ""}
            ${isFirstHome === true ? row("First home buyer", "✅ Yes") : isFirstHome === false ? row("First home buyer", "No") : ""}
          </table>
        </div>

        <!-- Introductions requested -->
        <div style="background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 10px;">Introductions requested</p>
          <p style="font-size: 14px; color: #1e293b; font-weight: 600; margin: 0; line-height: 1.9;">${categoryList}</p>
        </div>

        <!-- Message -->
        ${message ? `
        <div style="background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 10px;">Their message</p>
          <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.7; font-style: italic;">"${message}"</p>
        </div>
        ` : ""}

        <!-- CTA -->
        <div style="background: #eef2ff; border-radius: 12px; padding: 14px 18px; border: 1px solid #c7d2fe;">
          <p style="font-size: 13px; color: #6366f1; margin: 0;">
            Reply to this email or contact ${name} directly at <a href="mailto:${email}" style="color: #4338ca; font-weight: 600;">${email}</a>.
          </p>
        </div>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 18px;">Sent from arvogo.com</p>

      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Arvogo Leads <onboarding@resend.dev>",
        to: YOUR_EMAIL,
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
