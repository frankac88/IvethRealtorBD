import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import {
  createSourceFingerprint,
  createSubmissionFingerprint,
  extractClientIp,
  LEAD_INTEREST_VALUES,
  normalizeLeadSubmission,
} from "../_shared/leadProtection.ts";

const MIN_FORM_FILL_MS = 750;
const GUIDE_MIN_FORM_FILL_MS = 150;
const GUIDE_DOWNLOAD_LINK_TTL_SECONDS = 15 * 60;
const DEDUPE_WINDOW_MINUTES = 15;
const SOURCE_RATE_LIMIT_WINDOW_MINUTES = 10;
const MAX_SUBMISSIONS_PER_SOURCE_WINDOW = 5;
const EMAIL_RATE_LIMIT_WINDOW_MINUTES = 30;
const MAX_SUBMISSIONS_PER_EMAIL_WINDOW = 3;
const NAME_REGEX = /^[\p{L}\s'.-]{2,100}$/u;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;
const COUNTRY_REGEX = /^[\p{L}\s'.-]{2,60}$/u;
const GUIDE_KEYS = ["investor", "preconstruction", "financing", "buyer"] as const;
const GUIDE_LANGUAGE_KEYS = ["es", "en"] as const;
const DEFAULT_GUIDE_LANGUAGE = "es";
const textEncoder = new TextEncoder();
const RATE_LIMIT_ERROR = "Too many requests. Please wait before trying again.";

const BodySchema = z.object({
  name: z.string().trim().min(2).max(100).regex(NAME_REGEX),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).refine((value) => value === "" || PHONE_REGEX.test(value)),
  country: z.string().trim().min(2).max(60).regex(COUNTRY_REGEX),
  interest: z.enum(LEAD_INTEREST_VALUES),
  message: z.string().trim().max(1000).nullable().optional(),
  honeypot: z.string().max(255).optional().default(""),
  startedAt: z.number().int().positive(),
  guideKey: z.enum(GUIDE_KEYS).optional(),
  language: z.enum(GUIDE_LANGUAGE_KEYS).optional(),
});

const suspiciousSuccessResponse = (req: Request) => new Response(
  JSON.stringify({ success: true }),
  {
    status: 200,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  },
);

async function signGuideDownloadToken(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload))))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createGuideDownloadUrl(
  guideKey: typeof GUIDE_KEYS[number],
  language: typeof GUIDE_LANGUAGE_KEYS[number] = DEFAULT_GUIDE_LANGUAGE,
) {
  const baseUrl = Deno.env.get("GUIDE_DOWNLOAD_BASE_URL");
  const signingSecret = Deno.env.get("GUIDE_DOWNLOAD_SIGNING_SECRET");

  if (!baseUrl || !signingSecret) {
    throw new Error("Guide download service is not configured");
  }

  const expires = Math.floor(Date.now() / 1000) + GUIDE_DOWNLOAD_LINK_TTL_SECONDS;
  const signature = await signGuideDownloadToken(signingSecret, `${guideKey}.${language}.${expires}`);
  const url = new URL("/download", baseUrl);

  url.searchParams.set("guide", guideKey);
  url.searchParams.set("language", language);
  url.searchParams.set("expires", String(expires));
  url.searchParams.set("signature", signature);

  return url.toString();
}

async function enforceLeadRateLimit(
  supabaseAdmin: Pick<ReturnType<typeof createClient>, "from">,
  email: string,
  req: Request,
) {
  const windowStartIso = new Date(
    Date.now() - EMAIL_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabaseAdmin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", windowStartIso);

  if (error) {
    throw error;
  }

  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_EMAIL_WINDOW) {
    return new Response(JSON.stringify({
      success: false,
      error: RATE_LIMIT_ERROR,
    }), {
      status: 429,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  return null;
}

async function enforceSourceRateLimit(
  supabaseAdmin: Pick<ReturnType<typeof createClient>, "from">,
  sourceFingerprint: string | null,
  req: Request,
) {
  if (!sourceFingerprint) {
    return null;
  }

  const windowStartIso = new Date(
    Date.now() - SOURCE_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabaseAdmin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("source_fingerprint", sourceFingerprint)
    .gte("created_at", windowStartIso);

  if (error) {
    throw error;
  }

  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_SOURCE_WINDOW) {
    return new Response(JSON.stringify({
      success: false,
      error: RATE_LIMIT_ERROR,
    }), {
      status: 429,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  return null;
}

async function hasRecentDuplicateLead(
  supabaseAdmin: Pick<ReturnType<typeof createClient>, "from">,
  submissionFingerprint: string,
) {
  const windowStartIso = new Date(
    Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabaseAdmin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("submission_fingerprint", submissionFingerprint)
    .gte("created_at", windowStartIso);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const NOTIFY_LEAD_SECRET = Deno.env.get("NOTIFY_LEAD_SECRET");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase server credentials are not configured");
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { guideKey, honeypot, startedAt, language, ...leadData } = parsed.data;

    if (honeypot.trim() !== "") {
      return suspiciousSuccessResponse(req);
    }

    const minFormFillMs = guideKey ? GUIDE_MIN_FORM_FILL_MS : MIN_FORM_FILL_MS;
    const elapsedMs = Date.now() - startedAt;

    if (minFormFillMs > 0 && elapsedMs >= 0 && elapsedMs < minFormFillMs) {
      return suspiciousSuccessResponse(req);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const normalizedLeadData = normalizeLeadSubmission(leadData);
    const submissionFingerprint = await createSubmissionFingerprint(normalizedLeadData);
    const sourceFingerprint = await createSourceFingerprint(
      extractClientIp(req.headers),
      req.headers.get("user-agent"),
    );

    if (await hasRecentDuplicateLead(supabaseAdmin, submissionFingerprint)) {
      return suspiciousSuccessResponse(req);
    }

    const sourceRateLimitResponse = await enforceSourceRateLimit(supabaseAdmin, sourceFingerprint, req);
    if (sourceRateLimitResponse) {
      return sourceRateLimitResponse;
    }

    const rateLimitResponse = await enforceLeadRateLimit(supabaseAdmin, normalizedLeadData.email, req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        ...normalizedLeadData,
        message: normalizedLeadData.message,
        source_fingerprint: sourceFingerprint,
        submission_fingerprint: submissionFingerprint,
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
          Authorization: `Bearer ${NOTIFY_LEAD_SECRET || SUPABASE_SERVICE_ROLE_KEY}`,
          ...(NOTIFY_LEAD_SECRET ? { "x-notify-secret": NOTIFY_LEAD_SECRET } : { apikey: SUPABASE_SERVICE_ROLE_KEY }),
        },
        body: JSON.stringify(normalizedLeadData),
      });
    } catch (notifyError) {
      console.error("notify-lead failed:", notifyError);
    }

    const guideDownloadUrl = guideKey
      ? await createGuideDownloadUrl(guideKey, language ?? DEFAULT_GUIDE_LANGUAGE)
      : null;

    return new Response(JSON.stringify({ success: true, lead: data, guideDownloadUrl }), {
      status: 200,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("submit-lead failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
