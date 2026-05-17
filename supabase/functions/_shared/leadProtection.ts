const textEncoder = new TextEncoder();

export const LEAD_INTEREST_VALUES = ["precon", "miami", "orlando", "financing", "other"] as const;

export interface LeadProtectionPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  message?: string | null;
}

export interface NormalizedLeadProtectionPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  message: string | null;
}

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export function normalizeOptionalLeadText(value?: string | null) {
  if (!value) return null;

  const normalized = collapseWhitespace(value);
  return normalized.length > 0 ? normalized : null;
}

export function normalizeLeadSubmission(payload: LeadProtectionPayload): NormalizedLeadProtectionPayload {
  return {
    name: collapseWhitespace(payload.name),
    email: payload.email.trim().toLowerCase(),
    phone: collapseWhitespace(payload.phone),
    country: collapseWhitespace(payload.country),
    interest: payload.interest.trim().toLowerCase(),
    message: normalizeOptionalLeadText(payload.message),
  };
}

export async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", textEncoder.encode(value)));
}

export async function createSubmissionFingerprint(payload: LeadProtectionPayload) {
  const normalized = normalizeLeadSubmission(payload);
  return sha256Hex([
    normalized.email,
    normalized.phone,
    normalized.country,
    normalized.interest,
    normalized.message ?? "",
  ].join("|"));
}

export function extractClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstForwardedIp = forwardedFor.split(",")[0]?.trim();
    if (firstForwardedIp) return firstForwardedIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp) return cfConnectingIp;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return null;
}

export async function createSourceFingerprint(clientIp: string | null, userAgent?: string | null) {
  if (!clientIp) return null;

  const normalizedUserAgent = collapseWhitespace(userAgent ?? "").slice(0, 255);
  return sha256Hex(`${clientIp}|${normalizedUserAgent}`);
}
