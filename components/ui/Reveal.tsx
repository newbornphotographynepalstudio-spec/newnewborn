"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** SSR-safe reduced-motion read — no effect/setState needed to sync it. */
function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noSubscription = () => () => {};

/**
 * True once mounted on the client, false during SSR and the first
 * hydration pass — the standard useSyncExternalStore "has hydrated" idiom,
 * so the flip happens without an effect/setState (see React docs on
 * useSyncExternalStore for this exact pattern).
 */
function useMounted() {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
}

/**
 * Gentle fade + soft rise when the element enters the viewport. A one-time
 * reveal, not a scroll-linked/parallax effect — matches "subtle premium
 * motion", not "aggressive scroll effects." Always renders a <div>; wrap
 * the semantic element inside it rather than needing a polymorphic tag.
 *
 * Renders children fully visible when the visitor prefers reduced motion,
 * or before JS has hydrated (no flash-of-hidden-content on slow
 * connections/no-JS — the base state is visible and only the intersection
 * observer adds the initial hidden state once mounted).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** milliseconds, kept small — this is a polish detail, not a sequence */
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const ready = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const [intersected, setIntersected] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersected(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const visible = reducedMotion || intersected;

  return (
    <div
      ref={ref}
      style={ready ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${ready ? "transition-[opacity,transform] duration-slow ease-premium" : ""} ${
        ready && !visible ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
