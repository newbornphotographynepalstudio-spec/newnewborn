"use client";

import Image, { type ImageProps } from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type LightboxItem = { src: ImageProps["src"]; alt: string };

const LightboxContext = createContext<{ open: (src: ImageProps["src"]) => void } | null>(null);

/** Consumed by LightboxImage — throws if used outside a LightboxRoot so a
 * missing provider fails loudly during development rather than silently
 * doing nothing on click. */
export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within a LightboxRoot");
  }
  return ctx;
}

/**
 * Full-screen, keyboard-accessible image viewer for a portfolio gallery.
 * Wrap a page/section's gallery in `<LightboxRoot images={[...]}>`, in the
 * same visual order the photos appear, then render each photo with
 * `<LightboxImage>` instead of `<EditorialImage>` — clicking one opens
 * this overlay at that photo, with Previous/Next cycling through the
 * full `images` list.
 *
 * - Escape closes; focus returns to whichever thumbnail opened it.
 * - Clicking the dark backdrop closes; clicking the image itself does not.
 * - Arrow Left/Right move between images when there's more than one.
 * - `sizes="100vw"` + `priority` only on the currently-open image (not
 *   every thumbnail) keeps this from adding a real performance cost —
 *   the full-resolution image is only ever fetched for the one photo
 *   actually being viewed.
 */
export function LightboxRoot({
  images,
  children,
}: {
  images: LightboxItem[];
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(
    (src: ImageProps["src"]) => {
      triggerRef.current = document.activeElement as HTMLElement | null;
      const found = images.findIndex((img) => img.src === src);
      if (found >= 0) setIndex(found);
    },
    [images]
  );

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
  }, []);

  const next = useCallback(() => {
    setIndex((current) => (current === null ? null : (current + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        prev();
      } else if (event.key === "Tab") {
        // Minimal focus containment: the overlay only ever has 2-3
        // buttons, so cycling between them (rather than a full DOM
        // focus-trap query like MobileNav's) is enough to keep Tab from
        // escaping into the page underneath.
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [index, close, next, prev]);

  const current = index !== null ? images[index] : null;

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/95 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white transition-colors duration-base hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-base hover:bg-white/20 sm:left-6"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12.5 4.5L6.5 10l6 5.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors duration-base hover:bg-white/20 sm:right-6"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M7.5 4.5l6 5.5-6 5.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              priority
              className="object-contain"
            />
          </div>

          {images.length > 1 ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-caption text-white/70 sm:bottom-6">
              {index !== null ? index + 1 : 0} / {images.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
