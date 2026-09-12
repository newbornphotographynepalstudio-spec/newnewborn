"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  bookASessionCta,
  contactLink,
  primaryNav,
  servicesNav,
} from "@/lib/navigation/routes";

/**
 * A dedicated full-screen mobile menu — not the desktop nav squeezed into a
 * drawer. Large editorial type, Services as an inline accordion (mirroring
 * the desktop dropdown's grouping), booking as the clear final action.
 *
 * Traps scroll on the body while open and returns focus to the trigger on
 * close; Escape closes.
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
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
          className="inline-flex items-center justify-center rounded-sm border border-taupe/40 p-2xs"
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

      <nav className="flex flex-1 flex-col justify-between px-gutter pb-2xl">
        <ul className="flex flex-col gap-xs pt-lg font-display text-h3">
          <li>
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className="flex w-full items-center justify-between py-2xs text-left text-charcoal"
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
              <ul className="flex flex-col gap-3xs py-2xs pl-md font-sans text-body">
                {servicesNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className="block py-2xs text-taupe">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose} className="block py-2xs text-charcoal">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-sm pt-2xl">
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
