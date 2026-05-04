import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { localizedRoutes } from "@/i18n/routes";

const SITE_URL = "https://ivethcoll.com";

const publicFile = (fileName: string) => resolve(process.cwd(), "public", fileName);

describe("sitemap", () => {
  it("exposes all public localized routes and excludes private routes", async () => {
    const sitemap = await readFile(publicFile("sitemap.xml"), "utf8");
    const routePaths = new Set(Object.values(localizedRoutes).flatMap((route) => [route.es, route.en]));

    for (const path of routePaths) {
      expect(sitemap).toContain(`<loc>${SITE_URL}${path === "/" ? "/" : path}</loc>`);
    }

    expect(sitemap).not.toContain(`${SITE_URL}/admin`);
    expect(sitemap).not.toContain(`${SITE_URL}/login`);
  });

  it("declares the sitemap in robots.txt", async () => {
    const robots = await readFile(publicFile("robots.txt"), "utf8");

    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
