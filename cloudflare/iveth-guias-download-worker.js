const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const GUIDE_KEYS = new Set(["investor", "preconstruction", "financing", "buyer"]);
const DEFAULT_MAX_AGE_SECONDS = 60 * 20;
const textEncoder = new TextEncoder();

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return toHex(await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload)));
}

function parseObjectMap(env) {
  if (!env.GUIDE_OBJECT_KEYS) return {};

  try {
    return JSON.parse(env.GUIDE_OBJECT_KEYS);
  } catch {
    return {};
  }
}

async function resolveObjectKey(env, guide) {
  const objectMap = parseObjectMap(env);
  const mappedKey = objectMap[guide] || env.GUIDE_OBJECT_KEY;

  if (mappedKey) return mappedKey;

  const listed = await env.GUIAS_BUCKET.list({ limit: 1 });
  return listed.objects[0]?.key || null;
}

function getContentType(key) {
  return key.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
}

function getDownloadName(key) {
  const parts = key.split("/");
  return parts[parts.length - 1] || "guia.pdf";
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    if (!env.DOWNLOAD_SIGNING_SECRET) {
      return jsonResponse({ error: "Download service is not configured" }, 500);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/download") {
      return jsonResponse({ ok: true });
    }

    const guide = url.searchParams.get("guide") || "investor";
    const expires = Number(url.searchParams.get("expires") || 0);
    const signature = url.searchParams.get("signature") || "";

    if (!GUIDE_KEYS.has(guide)) {
      return jsonResponse({ error: "Invalid guide" }, 400);
    }

    const now = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(expires) || expires <= now || expires - now > DEFAULT_MAX_AGE_SECONDS) {
      return jsonResponse({ error: "Expired link" }, 403);
    }

    const expectedSignature = await signToken(env.DOWNLOAD_SIGNING_SECRET, `${guide}.${expires}`);
    if (!signature || !timingSafeEqual(signature, expectedSignature)) {
      return jsonResponse({ error: "Invalid link" }, 403);
    }

    const objectKey = await resolveObjectKey(env, guide);
    if (!objectKey) {
      return jsonResponse({ error: "Guide file not found" }, 404);
    }

    if (request.method === "HEAD") {
      const object = await env.GUIAS_BUCKET.head(objectKey);

      if (!object) {
        return new Response(null, { status: 404, headers: corsHeaders });
      }

      return new Response(null, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": object.httpMetadata?.contentType || getContentType(objectKey),
          "Cache-Control": "private, no-store",
        },
      });
    }

    const object = await env.GUIAS_BUCKET.get(objectKey);
    if (!object) {
      return jsonResponse({ error: "Guide file not found" }, 404);
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || getContentType(objectKey),
        "Content-Disposition": `attachment; filename="${getDownloadName(objectKey).replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  },
};
