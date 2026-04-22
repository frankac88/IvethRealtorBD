import { expect, test } from "../playwright-fixture";

const routes = {
  es: [
    "/",
    "/sobre-iveth",
    "/equipo",
    "/proyectos",
    "/invertir-en-florida",
    "/financiamiento",
    "/guias",
    "/testimonios",
    "/contacto",
  ],
  en: [
    "/",
    "/about-iveth",
    "/team",
    "/projects",
    "/invest-in-florida",
    "/financing",
    "/guides",
    "/testimonials",
    "/contact",
  ],
} as const;

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});

test.describe("mobile layout", () => {
  for (const [locale, localizedRoutes] of Object.entries(routes)) {
    for (const route of localizedRoutes) {
      test(`has no horizontal overflow on ${locale}:${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("load");

        const result = await page.evaluate(() => {
          const viewportWidth = document.documentElement.clientWidth;
          const rootScrollWidth = Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          );

          const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
            .filter((element) => {
              const style = window.getComputedStyle(element);
              if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity) === 0
              ) {
                return false;
              }

              const rect = element.getBoundingClientRect();

              if (rect.width === 0 || rect.height === 0) {
                return false;
              }

              const exceedsViewport = rect.right - viewportWidth > 1 || rect.left < -1;
              const createsOwnOverflow = element.scrollWidth - element.clientWidth > 1;

              return exceedsViewport || createsOwnOverflow;
            })
            .slice(0, 10)
            .map((element) => {
              const rect = element.getBoundingClientRect();

              return {
                tag: element.tagName.toLowerCase(),
                className: element.className,
                text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
              };
            });

          return {
            viewportWidth,
            rootScrollWidth,
            offenders,
          };
        });

        await expect(
          result.rootScrollWidth,
          `Route ${locale}:${route} overflowed horizontally: ${JSON.stringify(result)}`,
        ).toBeLessThanOrEqual(result.viewportWidth + 1);
      });
    }
  }
});
