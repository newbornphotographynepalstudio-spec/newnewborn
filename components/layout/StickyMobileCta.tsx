"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * A persistent mobile-only "Book a Session" bar, appearing once the
 * visitor scrolls past the hero — gives every mobile page a booking
 * affordance that doesn't require scrolling back to the header. Hidden
 * on `/book-a-session/` itself (the actual form is already right there)
 * and on `/admin/*` (a different, non-customer-facing layout entirely —
 * though admin pages never render this component's parent layout
 * anyway). Only shows "Book a Session", not WhatsApp too — the existing
 * WhatsAppButton already covers that, and stacking two CTAs here would
 * be exactly the "excessive CTAs" this redesign is meant to avoid.
 *
 * `padding-bottom: env(safe-area-inset-bottom)` keeps the bar clear of
 * the home-indicator area on notched iPhones. Right padding reserves
 * space for the floating WhatsAppButton's ~56px circle (right-5/bottom-5
 * below `sm`) so the two never visually collide.
 *
 * `z-20` — one below WhatsAppButton's `z-30` — is deliberate, not
 * arbitrary: both are `position: fixed` siblings, so equal z-index would
 * fall back to DOM order, and this bar's semi-opaque `backdrop-blur-sm`
 * background would then paint over (visually wash out/blur) the
 * WhatsApp button wherever their fixed boxes overlap the same screen
 * region — confirmed via a real rendered screenshot, not assumed. Sitting
 * one level below keeps WhatsApp crisp on top while this bar still sits
 * above ordinary page content.
 */
export function StickyMobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith(routes.bookASession) || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-taupe/15 bg-ivory/95 pr-20 pl-4 backdrop-blur-sm transition-transform duration-base ease-premium lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="py-3">
        <Button href={bookASessionCta.href} className="w-full justify-center">
          {bookASessionCta.label}
        </Button>
      </div>
    </div>
  );
}
