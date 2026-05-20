import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { LanguageProvider } from "@/i18n/LanguageContext";

import Index from "./Index";

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("@/components/AnimatedSection", () => ({
  default: ({
    children,
    as: Component = "section",
    ...props
  }: {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
  }) => <Component {...props}>{children}</Component>,
}));

vi.mock("@/components/home/HomeTestimonialsCarousel", () => ({
  default: () => <div data-testid="testimonials-carousel" />,
}));

vi.mock("@/features/projects/hooks", () => ({
  useFeaturedProjectsQuery: () => ({
    isLoading: false,
    data: [
      {
        id: "edge-house",
        title: "EDGE HOUSE",
        slug: "edge-house",
        imageUrl: "/edge-house.webp",
        badge: { es: "Airbnb", en: "Airbnb" },
        location: { es: "Edgewater, Miami", en: "Edgewater, Miami" },
        priceFrom: 540000,
      },
    ],
  }),
}));

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("Index featured projects", () => {
  it("links each featured project card to its detail page", async () => {
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: undefined,
    });

    render(
      <MemoryRouter initialEntries={["/"]} future={ROUTER_FUTURE_FLAGS}>
        <LanguageProvider>
          <Index />
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole("link", { name: /ver proyecto/i })).toHaveAttribute(
      "href",
      "/proyectos/edge-house",
    );
    expect(screen.getByRole("heading", { name: /edge house/i }).closest("article")).toHaveClass(
      "border-gold/30",
      "bg-card/90",
      "flex",
      "h-full",
      "flex-col",
    );
    expect(screen.getByText(/desde \$540,000/i)).toHaveClass("mt-auto");
  });
});
