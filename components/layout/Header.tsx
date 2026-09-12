"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { bookASessionCta, primaryNav } from "@/lib/navigation/routes";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone bg-cream/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={bookASessionCta.href}
          className="hidden rounded-sm bg-ink px-5 py-2.5 text-sm text-cream transition-colors hover:bg-ink-soft lg:inline-block"
        >
          {bookASessionCta.label}
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-stone p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5h15M2.5 10h15M2.5 15h15" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      {open ? (
        <div className="border-t border-stone bg-cream lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 text-sm text-charcoal/80 hover:bg-stone-soft hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={bookASessionCta.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-ink px-4 py-2.5 text-center text-sm text-cream"
            >
              {bookASessionCta.label}
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
