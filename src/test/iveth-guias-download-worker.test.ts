import { describe, expect, it, vi } from "vitest";

import worker from "../../cloudflare/iveth-guias-download-worker.js";

const createBucket = (existingKeys: string[]) => ({
  head: vi.fn(async (key: string) => (
    existingKeys.includes(key)
      ? { key, httpMetadata: { contentType: "application/pdf" } }
      : null
  )),
  get: vi.fn(async (key: string) => (
    existingKeys.includes(key)
      ? { body: new ReadableStream() }
      : null
  )),
  list: vi.fn(async () => ({
    objects: existingKeys.map((key) => ({ key })),
  })),
});

async function signDownload(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const buffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

describe("iveth-guias-download-worker", () => {
  it("reports real availability by guide key", async () => {
    const bucket = createBucket(["guides/investor.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: "guides/investor.pdf",
        preconstruction: "guides/missing.pdf",
      }),
      GUIAS_BUCKET: bucket,
    };

    const response = await worker.fetch(new Request("https://example.com/availability"), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      guides: {
        investor: true,
        preconstruction: false,
        financing: false,
        buyer: false,
      },
    });
    expect(bucket.head).toHaveBeenCalledWith("guides/investor.pdf");
    expect(bucket.head).toHaveBeenCalledWith("guides/missing.pdf");
    expect(bucket.list).not.toHaveBeenCalled();
  });

  it("returns 404 for download requests without a mapped object", async () => {
    const bucket = createBucket(["guides/investor.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: "guides/investor.pdf",
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `preconstruction.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=preconstruction&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Guide file not found" });
    expect(bucket.get).not.toHaveBeenCalled();
    expect(bucket.list).not.toHaveBeenCalled();
  });
});
