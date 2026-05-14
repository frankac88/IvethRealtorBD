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
  it("reports real availability by guide key for spanish", async () => {
    const bucket = createBucket(["guides/investor-es.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: "guides/investor-es.pdf",
        preconstruction: "guides/missing-es.pdf",
      }),
      GUIAS_BUCKET: bucket,
    };

    const response = await worker.fetch(new Request("https://example.com/availability?language=es"), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      guides: {
        investor: true,
        preconstruction: false,
        financing: false,
        buyer: false,
      },
    });
    expect(bucket.head).toHaveBeenCalledWith("guides/investor-es.pdf");
    expect(bucket.head).toHaveBeenCalledWith("guides/missing-es.pdf");
    expect(bucket.list).not.toHaveBeenCalled();
  });

  it("reports real availability by guide key for english", async () => {
    const bucket = createBucket(["guides/investor-en.pdf", "guides/financing-en.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: { es: "guides/investor-es.pdf", en: "guides/investor-en.pdf" },
        financing: { es: "guides/financing-es.pdf", en: "guides/financing-en.pdf" },
        preconstruction: "guides/preconstruction-es.pdf",
      }),
      GUIAS_BUCKET: bucket,
    };

    const response = await worker.fetch(new Request("https://example.com/availability?language=en"), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      guides: {
        investor: true,
        preconstruction: false,
        financing: true,
        buyer: false,
      },
    });
    expect(bucket.head).toHaveBeenCalledWith("guides/investor-en.pdf");
    expect(bucket.head).toHaveBeenCalledWith("guides/financing-en.pdf");
    expect(bucket.head).toHaveBeenCalledWith("guides/preconstruction-es.pdf");
  });

  it("reports english availability as true when only the spanish guide exists", async () => {
    const bucket = createBucket(["guides/investor-es.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: {
          es: "guides/investor-es.pdf",
        },
      }),
      GUIAS_BUCKET: bucket,
    };

    const response = await worker.fetch(new Request("https://example.com/availability?language=en"), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      guides: {
        investor: true,
        preconstruction: false,
        financing: false,
        buyer: false,
      },
    });
    expect(bucket.head).toHaveBeenCalledWith("guides/investor-es.pdf");
  });

  it("reports spanish availability as true when only the english guide exists", async () => {
    const bucket = createBucket(["guides/buyer-en.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        buyer: {
          en: "guides/buyer-en.pdf",
        },
      }),
      GUIAS_BUCKET: bucket,
    };

    const response = await worker.fetch(new Request("https://example.com/availability?language=es"), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      guides: {
        investor: false,
        preconstruction: false,
        financing: false,
        buyer: true,
      },
    });
    expect(bucket.head).toHaveBeenCalledWith("guides/buyer-en.pdf");
  });

  it("returns 404 for download requests without a mapped object", async () => {
    const bucket = createBucket(["guides/investor-es.pdf"]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: "guides/investor-es.pdf",
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

  it("downloads the localized english guide when the signed language is en", async () => {
    const objectKey = "Guía para Inversionistas Internacionales EN.pdf";
    const bucket = createBucket([objectKey]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: {
          es: "Guía para Inversionistas Internacionales ES.pdf",
          en: objectKey,
        },
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `investor.en.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=investor&language=en&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toBe(
      "attachment; filename=\"Guia para Inversionistas Internacionales EN.pdf\"; filename*=UTF-8''Gu%C3%ADa%20para%20Inversionistas%20Internacionales%20EN.pdf",
    );
    expect(bucket.get).toHaveBeenCalledWith(objectKey);
  });

  it("falls back to the spanish guide when english is requested and only spanish exists", async () => {
    const objectKey = "Guía para Inversionistas Internacionales ES.pdf";
    const bucket = createBucket([objectKey]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        investor: {
          es: objectKey,
        },
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `investor.en.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=investor&language=en&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(200);
    expect(bucket.get).toHaveBeenCalledWith(objectKey);
  });

  it("falls back to the english guide when spanish is requested and only english exists", async () => {
    const objectKey = "Strategic Buyer Guide EN.pdf";
    const bucket = createBucket([objectKey]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        buyer: {
          en: objectKey,
        },
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `buyer.es.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=buyer&language=es&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(200);
    expect(bucket.get).toHaveBeenCalledWith(objectKey);
  });

  it("returns UTF-8 content disposition with the original PDF filename", async () => {
    const objectKey = "Guía de Preconstrucción en Florida.pdf";
    const bucket = createBucket([objectKey]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        preconstruction: objectKey,
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `preconstruction.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=preconstruction&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      "attachment; filename=\"Guia de Preconstruccion en Florida.pdf\"; filename*=UTF-8''Gu%C3%ADa%20de%20Preconstrucci%C3%B3n%20en%20Florida.pdf",
    );
    expect(bucket.get).toHaveBeenCalledWith(objectKey);
  });

  it("accepts legacy spanish signatures without a language query param", async () => {
    const objectKey = "Guía de Financiamiento Inteligente ES.pdf";
    const bucket = createBucket([objectKey]);
    const env = {
      DOWNLOAD_SIGNING_SECRET: "secret",
      GUIDE_OBJECT_KEYS: JSON.stringify({
        financing: "Guía de Financiamiento Inteligente ES.pdf",
      }),
      GUIAS_BUCKET: bucket,
    };

    const expires = Math.floor(Date.now() / 1000) + 300;
    const signature = await signDownload(env.DOWNLOAD_SIGNING_SECRET, `financing.${expires}`);
    const response = await worker.fetch(
      new Request(`https://example.com/download?guide=financing&expires=${expires}&signature=${signature}`),
      env,
    );

    expect(response.status).toBe(200);
    expect(bucket.get).toHaveBeenCalledWith(objectKey);
  });
});
