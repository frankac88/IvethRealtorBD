import { useCallback, useEffect, useRef, useState } from "react";

type ScrollAnimationOptions = IntersectionObserverInit & {
  disabled?: boolean;
};

type SharedObserverRecord = {
  callbacks: Map<Element, (entry: IntersectionObserverEntry) => void>;
  observer: IntersectionObserver;
};

const sharedObservers = new Map<string, SharedObserverRecord>();

const createObserverKey = ({ rootMargin, threshold = 0.15 }: IntersectionObserverInit) => {
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : String(threshold);
  return `${rootMargin ?? ""}|${thresholdKey}`;
};

const cleanupSharedObserver = (key: string, record: SharedObserverRecord, element: Element) => {
  record.callbacks.delete(element);
  record.observer.unobserve(element);

  if (record.callbacks.size === 0) {
    record.observer.disconnect();
    sharedObservers.delete(key);
  }
};

const getSharedObserver = (options: IntersectionObserverInit) => {
  const key = createObserverKey(options);
  const existing = sharedObservers.get(key);

  if (existing) {
    return { key, record: existing };
  }

  const callbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callbacks.get(entry.target)?.(entry);
    });
  }, options);

  const record = { callbacks, observer };
  sharedObservers.set(key, record);

  return { key, record };
};

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options?: ScrollAnimationOptions,
) {
  const [isVisible, setIsVisible] = useState(Boolean(options?.disabled));
  const nodeRef = useRef<T | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const { disabled = false, root = null, rootMargin, threshold = 0.15 } = options ?? {};

  const stopObserving = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      stopObserving();
    }
  }, [disabled, stopObserving]);

  const ref = useCallback(
    (node: T | null) => {
      stopObserving();
      nodeRef.current = node;

      if (!node) return;
      if (disabled || isVisible || typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }

      const observerOptions = { root, rootMargin, threshold };

      if (root) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(node);
          }
        }, observerOptions);

        observer.observe(node);
        cleanupRef.current = () => observer.disconnect();
        return;
      }

      const { key, record } = getSharedObserver(observerOptions);
      const callback = (entry: IntersectionObserverEntry) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        cleanupSharedObserver(key, record, node);
      };

      record.callbacks.set(node, callback);
      record.observer.observe(node);

      cleanupRef.current = () => cleanupSharedObserver(key, record, node);
    },
    [disabled, isVisible, root, rootMargin, stopObserving, threshold],
  );

  useEffect(() => stopObserving, [stopObserving]);

  return { ref, isVisible };
}
