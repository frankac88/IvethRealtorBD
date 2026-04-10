import { describe, expect, it } from "vitest";

import { getAlternateLocalizedPath, getLanguageForPath, getLocalizedPath, getRouteKeyForPath } from "./routes";

describe("localized routes", () => {
  it("returns the localized slug for a route key", () => {
    expect(getLocalizedPath("contact", "es")).toBe("/contacto");
    expect(getLocalizedPath("contact", "en")).toBe("/contact");
    expect(getLocalizedPath("guides", "es")).toBe("/guias");
    expect(getLocalizedPath("guides", "en")).toBe("/guides");
  });

  it("maps localized paths back to a route key", () => {
    expect(getRouteKeyForPath("/sobre-iveth")).toBe("about");
    expect(getRouteKeyForPath("/about-iveth")).toBe("about");
    expect(getRouteKeyForPath("/guias")).toBe("guides");
    expect(getRouteKeyForPath("/guides")).toBe("guides");
  });

  it("returns the localized equivalent for the target language", () => {
    expect(getAlternateLocalizedPath("/contacto", "en")).toBe("/contact");
    expect(getAlternateLocalizedPath("/projects", "es")).toBe("/proyectos");
  });

  it("does not force a language for shared paths like home", () => {
    expect(getLanguageForPath("/")).toBeNull();
    expect(getLanguageForPath("/contact")).toBe("en");
    expect(getLanguageForPath("/contacto")).toBe("es");
  });
});
