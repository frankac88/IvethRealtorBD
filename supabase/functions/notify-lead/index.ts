const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const BodySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).nullable().optional(),
  country: z.string().max(60).nullable().optional(),
  interest: z.string().max(50).nullable().optional(),
  message: z.string().max(1000).nullable().optional(),
});

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const NOTIFY_LEAD_SECRET = Deno.env.get("NOTIFY_LEAD_SECRET");
    if (!NOTIFY_LEAD_SECRET) {
      throw new Error("NOTIFY_LEAD_SECRET is not configured");
    }

    const authorization = req.headers.get("Authorization");
    const notifySecret = req.headers.get("x-notify-secret");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : null;

    if (bearerToken !== NOTIFY_LEAD_SECRET && notifySecret !== NOTIFY_LEAD_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const NOTIFY_FROM_EMAIL = Deno.env.get("NOTIFY_FROM_EMAIL");
    if (!NOTIFY_FROM_EMAIL) throw new Error("NOTIFY_FROM_EMAIL is not configured");

    const NOTIFY_TO_EMAIL = Deno.env.get("NOTIFY_TO_EMAIL");
    if (!NOTIFY_TO_EMAIL) throw new Error("NOTIFY_TO_EMAIL is not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, phone, country, interest, message } = parsed.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "—");
    const safeCountry = escapeHtml(country || "—");
    const safeInterest = escapeHtml(interest || "—");
    const safeMessage = escapeHtml(message || "—").replaceAll("\n", "<br>");

    const html = `
      <div style="display:none;max-height:0;overflow:hidden;color:transparent;">
        Nuevo mensaje recibido desde el formulario de ivethcollrealtor.com.
      </div>
      <div style="margin:0;padding:24px;background:#f6f1ea;font-family:Arial,sans-serif;color:#1f2937;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadfce;border-radius:18px;overflow:hidden;">
          <div style="padding:24px;background:#141827;color:#ffffff;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#d9b56d;">Iveth Coll Realtor</p>
            <h1 style="margin:0;font-size:24px;line-height:1.25;">Nuevo contacto desde ivethcollrealtor.com</h1>
          </div>

          <div style="padding:24px;">
            <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
              Se recibió una nueva solicitud desde el formulario del sitio web.
            </p>

            <table style="border-collapse:collapse;width:100%;font-size:15px;">
              <tr>
                <td style="width:140px;padding:12px;border-bottom:1px solid #eee7dc;font-weight:bold;color:#6b5b43;">Nombre</td>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;font-weight:bold;color:#6b5b43;">Email</td>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;"><a href="mailto:${safeEmail}" style="color:#9b6a1f;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;font-weight:bold;color:#6b5b43;">Teléfono</td>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;font-weight:bold;color:#6b5b43;">País</td>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;">${safeCountry}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;font-weight:bold;color:#6b5b43;">Interés</td>
                <td style="padding:12px;border-bottom:1px solid #eee7dc;">${safeInterest}</td>
              </tr>
              <tr>
                <td style="padding:12px;font-weight:bold;color:#6b5b43;vertical-align:top;">Mensaje</td>
                <td style="padding:12px;line-height:1.6;">${safeMessage}</td>
              </tr>
            </table>

            <div style="margin-top:24px;">
              <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 18px;background:#141827;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;">
                Responder a ${safeName}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: NOTIFY_FROM_EMAIL,
        to: NOTIFY_TO_EMAIL.split(",").map((value) => value.trim()).filter(Boolean),
        subject: `Nuevo contacto desde la web: ${name}`,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Resend API failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
