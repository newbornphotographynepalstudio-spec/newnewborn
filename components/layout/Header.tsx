"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavDropdown } from "@/components/layout/NavDropdown";
import {
  bookASessionCta,
  contactLink,
  primaryNav,
  servicesNav,
} from "@/lib/navigation/routes";

/**
 * Desktop: Logo — Services (dropdown) + 5 flat items — Contact + Book a
 * Session (stronger visual priority). Mobile: Logo + menu trigger only,
 * opening the dedicated MobileNav overlay (not this nav squeezed down).
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-taupe/15 bg-ivory/95 backdrop-blur-sm">
      <Container size="wide" className="flex h-16 items-center justify-between lg:h-20">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-lg lg:flex">
          <NavDropdown label="Services" items={servicesNav} />
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-small text-charcoal transition-colors duration-base hover:text-plum"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-md lg:flex">
          <Link
            href={contactLink.href}
            className="text-small text-taupe transition-colors duration-base hover:text-plum"
          >
            {contactLink.label}
          </Link>
          <Button href={bookASessionCta.href} size="sm">
            {bookASessionCta.label}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-sm border border-taupe/40 p-2xs lg:hidden"
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
            <path d="M2.5 5h15M2.5 10h15M2.5 15h15" strokeLinecap="round" />
          </svg>
        </button>
      </Container>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
