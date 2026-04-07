import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MIN_FORM_FILL_MS = 4000;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;
const VALID_INTERESTS = ["precon", "miami", "orlando", "financing", "other"] as const;

const BodySchema = z.object({
  name: z.string().trim().min(2).max(100).regex(NAME_REGEX),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20).regex(PHONE_REGEX),
  country: z.string().trim().min(2).max(60).regex(COUNTRY_REGEX),
  interest: z.enum(VALID_INTERESTS),
  message: z.string().trim().max(1000).nullable().optional(),
  honeypot: z.string().max(255).optional().default(""),
  startedAt: z.number().int().positive(),
});

const suspiciousSuccessResponse = () => new Response(
  JSON.stringify({ success: true }),
  {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  },
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase server credentials are not configured");
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { honeypot, startedAt, ...leadData } = parsed.data;

    if (honeypot.trim() !== "") {
      return suspiciousSuccessResponse();
    }

    if (Date.now() - startedAt < MIN_FORM_FILL_MS) {
      return suspiciousSuccessResponse();
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        ...leadData,
        message: leadData.message || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    try {
      await fetch(`${SUPABASE_URL}/functions/v1/notify-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
        },
        body: JSON.stringify(leadData),
      });
    } catch (notifyError) {
      console.error("notify-lead failed:", notifyError);
    }

    return new Response(JSON.stringify({ success: true, lead: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("submit-lead failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
