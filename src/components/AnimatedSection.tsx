import React from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  delay?: number;
  children: React.ReactNode;
}

const AnimatedSection = ({
  as: Tag = "section",
  delay = 0,
  className,
  children,
  ...props
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
