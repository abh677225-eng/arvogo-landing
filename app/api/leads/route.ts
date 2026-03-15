import { NextRequest, NextResponse } from "next/server";

const YOUR_EMAIL = "abh677225@gmail.com"; // ← replace with your email

const CATEGORY_LABELS: Record<string, string> = {
  "broker": "🏦 Mortgage broker",
  "buyers-agent": "🔍 Buyers agent",
  "conveyancer": "📋 Conveyancer",
  "building-pest": "🔬 Building & pest inspector",
};

const POSITION_LABELS: Record<string, string> = {
  "exploring": "🌱 Exploring",
  "considering": "🤔 Considering",
  "preparing": "🗺️ Preparing",
  "in-process": "🏃 In process",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, categories, position } = body;

    const categoryList = Array.isArray(categories)
      ? categories.map((c: string) => CATEGORY_LABELS[c] || c).join("<br>")
      : CATEGORY_LABELS[categories] || categories || "Not specified";

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.08em;">New lead from Arvogo</p>
          <h1 style="color: #fff; font-size: 22px; margin: 0;">${name} is looking for an introduction</h1>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Contact details</p>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="color: #64748b; padding: 6px 0; width: 120px;">Name</td>
              <td style="color: #1e293b; font-weight: 600; padding: 6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Email</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Phone</td>
              <td style="color: #1e293b; padding: 6px 0;">${phone || "Not provided"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Journey position</p>
          <p style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 0;">
            ${POSITION_LABELS[position] || position || "Unknown"}
          </p>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Introductions requested</p>
          <p style="font-size: 14px; color: #1e293b; margin: 0; line-height: 1.8;">${categoryList}</p>
        </div>

        ${message ? `
        <div style="background: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 12px;">Their message</p>
          <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.7; font-style: italic;">"${message}"</p>
        </div>
        ` : ""}

        <div style="background: #eef2ff; border-radius: 12px; padding: 16px 20px; border: 1px solid #c7d2fe;">
          <p style="font-size: 13px; color: #6366f1; margin: 0;">
            Reply to this email or contact ${name} directly at <a href="mailto:${email}" style="color: #4338ca; font-weight: 600;">${email}</a> to make the introduction.
          </p>
        </div>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 20px;">
          Sent from arvogo.com
        </p>

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
        subject: `New lead — ${name} is looking for ${Array.isArray(categories) ? categories.length : 1} introduction${Array.isArray(categories) && categories.length > 1 ? "s" : ""}`,
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
