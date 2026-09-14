"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  bookASessionCta,
  contactLink,
  newbornNav,
  primaryNav,
  servicesNav,
} from "@/lib/navigation/routes";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

/**
 * A dedicated full-screen mobile menu — not the desktop nav squeezed into a
 * drawer. Large editorial type, Services as an inline accordion (mirroring
 * the desktop dropdown's grouping), booking as the clear final action.
 *
 * Traps scroll AND keyboard focus on the body while open (`aria-modal`
 * only means something if Tab genuinely can't reach anything behind it —
 * found via real keyboard testing that Tab could escape the open overlay
 * into the page underneath, which a modal must never allow), and returns
 * focus to whatever opened it (the header's hamburger button) on close,
 * rather than dropping focus. Escape closes.
 */
export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-nav-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ivory lg:hidden"
    >
      <div className="flex h-16 items-center justify-end px-gutter">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex items-center justify-center rounded-sm border border-taupe/40 p-2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-between px-gutter pb-16">
        <ul className="flex flex-col gap-3 pt-8 font-display text-h3">
          <li>
            <Link href={newbornNav.href} onClick={onClose} className="block py-2 text-charcoal">
              {newbornNav.label}
            </Link>
          </li>
          <li>
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between py-2 text-left text-charcoal"
            >
              Services
              <svg
                width="14"
                height="14"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
                className={`transition-transform duration-base ${servicesOpen ? "rotate-180" : ""}`}
              >
                <path d="M2 3.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {servicesOpen ? (
              <ul className="flex flex-col gap-1 py-2 pl-6 font-sans text-body">
                {servicesNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className="block py-2 text-taupe">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose} className="block py-2 text-charcoal">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 pt-16">
          <Link
            href={contactLink.href}
            onClick={onClose}
            className="text-small text-taupe"
          >
            {contactLink.label}
          </Link>
          <Button href={bookASessionCta.href} onClick={onClose} className="w-full">
            {bookASessionCta.label}
          </Button>
        </div>
      </nav>
    </div>
  );
}
