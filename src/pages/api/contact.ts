import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ContactPayload {
  lang: "it" | "en";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  privacy: boolean;
  honeypot?: string;
  turnstileToken?: string;
}

// ---------------------------------------------------------------------------
// Validation helpers (mirrors client-side validation)
// ---------------------------------------------------------------------------
const isName = (s: string) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(s);
const isEmail = (s: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(s);
const isPhone = (s: string) => /^\+?[0-9\s-]+$/.test(s);
const hasDangerousChars = (s: string) => /[<>{}[\]`\\]/.test(s);

function validate(p: ContactPayload): string | null {
  if (!p.firstName || p.firstName.length < 2 || p.firstName.length > 50 || !isName(p.firstName))
    return "Nome non valido";
  if (!p.lastName || p.lastName.length < 2 || p.lastName.length > 50 || !isName(p.lastName))
    return "Cognome non valido";
  if (!p.email || !isEmail(p.email))
    return "Email non valida";
  if (!p.phone || p.phone.length < 8 || p.phone.length > 20 || !isPhone(p.phone))
    return "Telefono non valido";
  if (!p.message || p.message.length < 10 || p.message.length > 1000 || hasDangerousChars(p.message))
    return "Messaggio non valido";
  if (!p.privacy)
    return "Privacy non accettata";
  return null;
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile verification (optional — skipped if no secret key)
// ---------------------------------------------------------------------------
async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    },
  );
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

// ---------------------------------------------------------------------------
// HTML email template
// ---------------------------------------------------------------------------
function buildEmailHtml(p: ContactPayload): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
      <h2 style="margin-top:0;color:#111827;">Nuova richiesta da marvindrone.com</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Nome</td><td style="padding:8px 0;font-weight:600;">${p.firstName} ${p.lastName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${p.email}">${p.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Telefono</td><td style="padding:8px 0;">${p.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;">Lingua</td><td style="padding:8px 0;">${p.lang.toUpperCase()}</td></tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;vertical-align:top;">Messaggio</td>
          <td style="padding:8px 0;white-space:pre-wrap;">${p.message}</td>
        </tr>
      </table>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export const POST: APIRoute = async ({ request }) => {
  const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // Parse body
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ error: "Richiesta non valida" }, 400);
  }

  // Honeypot check
  if (payload.honeypot) {
    return json({ ok: true }); // Silently ignore bots
  }

  // Server-side validation
  const validationError = validate(payload);
  if (validationError) {
    return json({ error: validationError }, 422);
  }

  // Turnstile verification (optional — only runs if secret key is configured)
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!payload.turnstileToken) {
      return json({ error: "Verifica antispam mancante" }, 422);
    }
    const ok = await verifyTurnstile(payload.turnstileToken, turnstileSecret);
    if (!ok) {
      return json({ error: "Verifica antispam fallita. Riprova." }, 422);
    }
  }

  // Send email via Resend
  const resendKey = import.meta.env.RESEND_API_KEY;
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL ?? "noreply@marvindrone.com";
  const toEmail = import.meta.env.RESEND_TO_EMAIL ?? "info@marvindrone.com";

  if (!resendKey) {
    console.error("[contact] RESEND_API_KEY not set");
    return json({ error: "Errore di configurazione server" }, 500);
  }

  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email,
    subject: `Nuova richiesta da marvindrone.com — ${payload.firstName} ${payload.lastName}`,
    html: buildEmailHtml(payload),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return json({ error: "Errore nell'invio dell'email. Riprova." }, 500);
  }

  return json({ ok: true });
};
