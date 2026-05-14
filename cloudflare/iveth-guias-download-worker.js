const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const GUIDE_KEYS = new Set(["investor", "preconstruction", "financing", "buyer"]);
const GUIDE_KEY_LIST = ["investor", "preconstruction", "financing", "buyer"];
const LANGUAGE_KEYS = new Set(["es", "en"]);
const DEFAULT_LANGUAGE = "es";
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

function parseLanguage(value) {
  return LANGUAGE_KEYS.has(value) ? value : DEFAULT_LANGUAGE;
}

function getConfiguredObjectKeys(env, guide) {
  const objectMap = parseObjectMap(env);
  const entry = objectMap[guide];

  if (typeof entry === "string") {
    return {
      es: entry,
      en: null,
    };
  }

  if (!entry || typeof entry !== "object") {
    return {
      es: null,
      en: null,
    };
  }

  return {
    es: typeof entry.es === "string" && entry.es.trim() ? entry.es : null,
    en: typeof entry.en === "string" && entry.en.trim() ? entry.en : null,
  };
}

function resolveObjectKey(env, guide, language = DEFAULT_LANGUAGE) {
  const configuredKeys = getConfiguredObjectKeys(env, guide);
  const requestedKey = configuredKeys[language];

  if (requestedKey) {
    return requestedKey;
  }

  const alternateLanguage = language === "es" ? "en" : "es";
  const alternateKey = configuredKeys[alternateLanguage];
  const configuredCount = [configuredKeys.es, configuredKeys.en].filter(Boolean).length;

  if (configuredCount === 1 && alternateKey) {
    return alternateKey;
  }

  return null;
}

async function hasGuideObject(env, guide, language) {
  const objectKey = resolveObjectKey(env, guide, language);
  if (!objectKey) return false;

  const object = await env.GUIAS_BUCKET.head(objectKey);
  return Boolean(object);
}

async function buildAvailabilityMap(env, language) {
  const entries = await Promise.all(
    GUIDE_KEY_LIST.map(async (guide) => [guide, await hasGuideObject(env, guide, language)]),
  );

  return Object.fromEntries(entries);
}

function getContentType(key) {
  return key.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
}

function getDownloadName(key) {
  const parts = key.split("/");
  return parts[parts.length - 1] || "guia.pdf";
}

function toAsciiFilename(filename) {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/["\\]/g, "")
    .trim() || "guia.pdf";
}

function getContentDisposition(key) {
  const filename = getDownloadName(key);
  const fallbackFilename = toAsciiFilename(filename);
  const encodedFilename = encodeURIComponent(filename);

  return `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodedFilename}`;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    if (url.pathname === "/availability") {
      const language = parseLanguage(url.searchParams.get("language"));
      return jsonResponse({ guides: await buildAvailabilityMap(env, language) });
    }

    if (url.pathname !== "/download") {
      return jsonResponse({ ok: true });
    }

    if (!env.DOWNLOAD_SIGNING_SECRET) {
      return jsonResponse({ error: "Download service is not configured" }, 500);
    }

    const guide = url.searchParams.get("guide") || "investor";
    const language = parseLanguage(url.searchParams.get("language"));
    const expires = Number(url.searchParams.get("expires") || 0);
    const signature = url.searchParams.get("signature") || "";

    if (!GUIDE_KEYS.has(guide)) {
      return jsonResponse({ error: "Invalid guide" }, 400);
    }

    const now = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(expires) || expires <= now || expires - now > DEFAULT_MAX_AGE_SECONDS) {
      return jsonResponse({ error: "Expired link" }, 403);
    }

    const expectedSignature = await signToken(env.DOWNLOAD_SIGNING_SECRET, `${guide}.${language}.${expires}`);
    const legacyExpectedSignature = language === DEFAULT_LANGUAGE
      ? await signToken(env.DOWNLOAD_SIGNING_SECRET, `${guide}.${expires}`)
      : null;

    const hasValidSignature = signature
      && (
        timingSafeEqual(signature, expectedSignature)
        || (legacyExpectedSignature && timingSafeEqual(signature, legacyExpectedSignature))
      );

    if (!hasValidSignature) {
      return jsonResponse({ error: "Invalid link" }, 403);
    }

    const objectKey = resolveObjectKey(env, guide, language);
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
        "Content-Disposition": getContentDisposition(objectKey),
        "Cache-Control": "private, no-store",
      },
    });
  },
};
