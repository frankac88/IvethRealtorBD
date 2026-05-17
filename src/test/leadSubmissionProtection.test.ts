import { describe, expect, it } from "vitest";

import {
  createSourceFingerprint,
  createSubmissionFingerprint,
  extractClientIp,
  normalizeLeadSubmission,
} from "../../supabase/functions/_shared/leadProtection";

describe("leadProtection", () => {
  it("normalizes lead payload fields before downstream checks", () => {
    expect(normalizeLeadSubmission({
      name: "  Jane Doe  ",
      email: "  Jane.Doe@Example.COM ",
      phone: " +593 999 999 999 ",
      country: "  Ecuador ",
      interest: "financing",
      message: "  Necesito información.\n\n ",
    })).toEqual({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+593 999 999 999",
      country: "Ecuador",
      interest: "financing",
      message: "Necesito información.",
    });
  });

  it("builds the same fingerprint for equivalent repeated submissions", async () => {
    const first = await createSubmissionFingerprint({
      name: "Jane Doe",
      email: "Jane.Doe@Example.com",
      phone: "+593 999 999 999",
      country: "Ecuador",
      interest: "financing",
      message: "Necesito    información.",
    });

    const second = await createSubmissionFingerprint({
      name: " Jane Doe ",
      email: " jane.doe@example.com ",
      phone: " +593 999 999 999 ",
      country: " Ecuador ",
      interest: "financing",
      message: "Necesito información.",
    });

    expect(first).toBe(second);
  });

  it("extracts the first forwarded client ip", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.9, 10.0.0.1",
    });

    expect(extractClientIp(headers)).toBe("203.0.113.9");
  });

  it("creates a stable source fingerprint from ip and user agent", async () => {
    const first = await createSourceFingerprint("203.0.113.9", "Mozilla/5.0");
    const second = await createSourceFingerprint("203.0.113.9", "Mozilla/5.0");

    expect(first).toBeTruthy();
    expect(first).toBe(second);
  });
});
