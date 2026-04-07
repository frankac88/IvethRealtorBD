import { useEffect, useRef, useState } from "react";

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { root = null, rootMargin, threshold = 0.15 } = options ?? {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);

  return { ref, isVisible };
}
