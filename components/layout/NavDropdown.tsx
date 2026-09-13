"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { NavItem } from "@/lib/navigation/routes";

/**
 * Desktop dropdown grouping the five service pages under one "Services"
 * trigger, so the header stays to a handful of top-level items instead of
 * listing every service flat. Opens on hover (desktop convenience) and on
 * click/Enter/Space (keyboard + touch), closes on Escape, outside click,
 * or losing focus.
 *
 * This is a disclosure exposing plain navigation links, not an
 * application menu of commands — so it deliberately does NOT use
 * `role="menu"`/`"menuitem"` (a common ARIA misuse for exactly this
 * pattern per the WAI-ARIA APG: that role implies arrow-key navigation
 * between items, which this doesn't implement, so claiming it would be
 * incorrect ARIA, not helpful ARIA). `aria-expanded` + `aria-controls` on
 * the trigger is the correct, minimal pattern here.
 *
 * Escape returns focus to the trigger button rather than dropping it to
 * the document body — found via real keyboard testing (Tab to Services,
 * Enter to open, Tab into the menu, Escape) that the original version
 * left focus nowhere, forcing a keyboard user to Tab from the very top of
 * the page again.
 */
export function NavDropdown({ label, items }: { label: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function openNow() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-small text-charcoal transition-colors duration-base hover:text-plum"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
          className={`transition-transform duration-base ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute top-full left-1/2 z-10 mt-4 w-56 -translate-x-1/2 rounded-sm border border-taupe/20 bg-white py-2 shadow-md"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-small text-charcoal transition-colors duration-base hover:bg-blush hover:text-plum"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
