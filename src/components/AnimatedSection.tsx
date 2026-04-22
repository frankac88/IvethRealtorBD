import React from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
};

const AnimatedSection = ({
  as: Tag = "section",
  delay = 0,
  className,
  children,
  ...props
}: AnimatedSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, isVisible } = useScrollAnimation({ disabled: prefersReducedMotion });

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
      style={prefersReducedMotion ? undefined : { transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
