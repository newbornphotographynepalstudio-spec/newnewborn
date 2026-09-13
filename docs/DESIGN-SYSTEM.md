# Design System — Newborn Photography Nepal

The visual source of truth for all future implementation. If a future
change needs a value or pattern not documented here, add it here first —
don't invent a one-off in a component.

## Brand positioning

**Luxury editorial newborn and family photography**, Kathmandu Valley,
Nepal. Core design philosophy: **"Photography is the design. UI supports
the photography."** Every UI decision in this document exists to get out
of the way of the photography, not to compete with it.

The site must read as premium, warm, emotional, artistic, editorial,
sophisticated, trustworthy, calm, culturally rooted, modern,
photography-first. It must **not** read as: a generic baby photography
template, a children's nursery site, a SaaS product, a WordPress
photography theme, an AI-generated template, or an overly pink baby site.

## Colors

Seven approved colors — no others are introduced. Defined once in
`app/globals.css` and consumed everywhere via the Tailwind utilities they
generate (`bg-plum`, `text-taupe`, etc.), never as a hardcoded hex in a
component.

| Token | Hex | Role |
|---|---|---|
| `plum` | `#35104A` | Deep Plum — the one **strong accent** (~5%): CTAs, key emphasis, active states |
| `ivory` | `#FBF7F5` | Warm Ivory — primary page background (neutral, ~80% bucket) |
| `blush` | `#F4E6E8` | Soft Blush — supporting tone (~15%): soft section backgrounds, hover fills |
| `taupe` | `#746564` | Warm Taupe — supporting tone: muted text, borders, secondary UI |
| `charcoal` | `#292529` | Deep Charcoal — primary body text (neutral, ~80% bucket) |
| `rose` | `#9C7A81` | Dusty Rose — supporting tone: sparing highlight/accent |
| `white` | `#FFFFFF` | Soft White — CTA text on plum, elevated surfaces (cards, inputs) |

**Visual balance**: ~80% neutral backgrounds/photography (ivory, white,
charcoal text), ~15% supporting tones (blush, taupe, rose), ~5% strong plum
accent. Plum is reserved — if a section feels like it needs more color,
that's what the photography is for, not a bigger plum fill. No bright
pink, no rainbow palette, no colors outside this set.

**Semantic aliases** (also in `globals.css`) — use these in components
rather than the raw palette names, so intent stays legible: `bg`,
`bg-elevated`, `bg-soft`, `bg-inverse`, `text`, `text-muted`,
`text-inverse`, `accent`, `accent-hover`, `accent-soft`, `border`,
`border-strong`, `focus-ring`.

**Interactive-state tints are computed, never invented**: hover/active
shades use CSS `color-mix()` to blend the approved colors (e.g.
`color-mix(in srgb, var(--color-plum) 85%, white)` for a button hover) —
this is still "the approved palette," not a new color.

## Typography

- **Display/headings** — Cormorant Garamond (`font-display`), weights
  400/500/600. Used for: Display, H1–H4, editorial titles, large
  statements.
- **Body/UI** — Manrope (`font-sans`), weights 400/500/600/700. Used for:
  body copy, navigation, buttons, labels, metadata, forms, admin UI,
  utility text.
- No script font anywhere in the UI — the logo already carries the
  handwritten personality; typography stays editorial, not decorative.

Both are self-hosted via `next/font/google` (no external font requests, no
layout shift), configured in `app/layout.tsx`.

### Type scale

Fluid (`clamp()`-based) so it scales smoothly between mobile and desktop
instead of jumping at breakpoints. Defined in `globals.css`, used via the
generated `text-*` utilities.

| Utility | Fluid range | Use |
|---|---|---|
| `text-display` | 2.75rem → 5.25rem | Hero/homepage-scale statements |
| `text-h1` | 2.25rem → 3.5rem | Page titles |
| `text-h2` | 1.75rem → 2.5rem | Major section headings |
| `text-h3` | 1.375rem → 1.75rem | Sub-section headings |
| `text-h4` | 1.125rem → 1.25rem | Minor headings, card titles |
| `text-body-lg` | 1.0625rem → 1.25rem | Intro paragraphs, lead text |
| `text-body` | 1rem (stable) | Default body copy |
| `text-small` | 0.875rem | Nav, buttons, secondary UI text |
| `text-caption` | 0.75rem | Fine print, metadata |
| `text-eyebrow` | 0.75rem | Section labels — same size as caption, distinguished by `uppercase` + `tracking-eyebrow` + medium weight, not size |

Line-height: `leading-tight` (1.1, headings), `leading-snug` (1.3),
`leading-normal` (1.6, body default), `leading-relaxed` (1.75, long-form).
Letter-spacing: `tracking-tight` (-0.01em, headings), `tracking-normal`,
`tracking-wide` (0.04em), `tracking-eyebrow` (0.16em, uppercase labels
only).

Long-form reading (blog posts, FAQ answers) should sit in a `Container
size="prose"` (Tailwind's `max-w-prose`, ~65ch) — never let body text run
full container width.

## Spacing

A t-shirt scale (`--spacing-3xs` through `--spacing-3xl`, 0.25rem→6rem),
added alongside (not replacing) Tailwind's numeric scale — `p-4` etc. still
work; `gap-md`, `p-lg`, `py-xl` etc. are the named additions, used by
`Stack`, `Cluster`, `Section` and anywhere else spacing needs a name
instead of a magic number.

Two fluid rhythm tokens carry the "generous whitespace, never compressed"
rule structurally rather than by convention:

- `py-section-y` (4rem → 8rem) — default vertical padding for a `Section`.
- `py-section-y-sm` (2.5rem → 4.5rem) — `Section compact` for lighter
  sections (e.g. `PagePlaceholder`).
- `px-gutter` (1.25rem → 3rem) — horizontal padding used by `Container`;
  keeps a safe mobile inset and gives large screens real breathing room.

**Rule**: sections are never compressed to fit more content above the
fold. If a page feels cramped, the fix is more `Section`s with real
content, not smaller `--spacing-section-y`.

## Layout philosophy & primitives

Editorial, not a grid of uniform cards. Avoid `[card][card][card]` as the
default section shape — prefer asymmetry, full-bleed photography, split
image/text, generous negative space, and strong typographic statements.

All primitives live in `components/primitives/`:

| Primitive | Purpose |
|---|---|
| `Container` | Horizontal max-width + gutter. `size`: `prose` (65ch) / `default` (80rem) / `wide` (96rem) / `full`. |
| `Section` | Vertical rhythm wrapper (`py-section-y`), optional `tone` background (`ivory`/`blush`/`plum`/`none`), wraps a `Container`. |
| `FullBleed` | Breaks children out to full viewport width from inside a constrained layout — for photography that should ignore the container. |
| `Stack` | Vertical flex, `gap` from the spacing scale. |
| `Cluster` | Horizontal, wrapping flex (button groups, tag lists), `gap`/`align`/`justify`. |
| `EditorialGrid` | Unopinionated 12-column grid — children position themselves with `col-span-*`/`col-start-*` for asymmetric compositions. |
| `ImageText` | Image + text pairing, configurable side (`imageSide`) and ratio (`even` / `wide-image` / `wide-text`). |
| `SplitSection` | `Section` + `ImageText` combined — the common "full section, image one side, text the other" pattern. |

Photography is explicitly allowed to break outside `Container` via
`FullBleed` when the composition calls for it — that's a deliberate
exception, not an inconsistency.

## Buttons

One component, `components/ui/Button.tsx`, three variants:

- **`primary`** — plum background, soft-white text. The main CTA (Book a
  Session, etc.).
- **`secondary`** — transparent background, subtle taupe border, plum
  text/border on hover. Secondary actions (Explore Portfolio).
- **`text`** — minimal text + a small directional arrow that nudges right
  on hover. In-content links (Learn More).

Renders a real `<Link>` when given `href` (correct semantics, works
without JS), a native `<button>` otherwise. Corners stay `rounded-sm`
(2px) — no pill buttons, no gradients, no cartoon styling. `SubmitButton`
(`components/ui/form/SubmitButton.tsx`) is a thin `Button
variant="primary" type="submit"` wrapper for forms.

## Logo

`components/ui/Logo.tsx` renders `public/brand/logo.jpg` via `next/image`
at its native aspect ratio — never stretched, distorted, recolored,
filtered, or replaced with a text rendering of the name. `size="default"`
(responsive `h-9`→`h-12`) for the header; `size="compact"` is available for
tighter contexts. The source file currently bakes in a solid blush
background rather than transparency — swap in a transparent PNG/SVG here
the moment one exists; no other code changes needed.

## Header

Desktop: Logo (left) → **Services** dropdown (groups Newborn / Maternity /
Baby / Cake Smash / Family — keeps 5 service pages from crowding the top
level) → Portfolio, Packages, Studio, Training, Blog (flat) → Contact
(quiet text link) → **Book a Session** (primary button, the header's one
strong visual priority). Sticky, `bg-ivory/95` + backdrop blur, a hairline
`border-taupe/15` bottom border — deliberately lightweight, no
scroll-triggered resize or shadow choreography.

`NavDropdown` (`components/layout/NavDropdown.tsx`) is keyboard-accessible
(`aria-haspopup`, `aria-expanded`, Escape closes, click-outside closes) and
opens on hover or click.

Mobile: Logo + menu trigger only. Opens `MobileNav`
(`components/layout/MobileNav.tsx`) — a dedicated full-screen overlay with
large `font-display` links, Services as an inline accordion, and Book a
Session as the clear final action at the bottom. Traps body scroll while
open, focuses the first link on open, Escape closes and returns focus.

## Footer

`components/layout/Footer.tsx`: Brand block (logo, one-line description,
`SocialLinks`) + two link clusters (**Explore**: Portfolio/Packages/
Studio/Training/Blog; **Connect**: About/Contact/Book a Session/FAQ) — not
a four-column corporate footer. A bottom bar carries copyright + the three
served areas (Kathmandu/Lalitpur/Bhaktapur) + a link to `/areas/`.
`SocialLinks` renders nothing until real handles exist (no invented social
URLs) — see `components/layout/SocialLinks.tsx`.

## Image system

One primitive, `components/ui/EditorialImage.tsx`, used for every image
pattern (hero, thumbnail, gallery item, full-bleed, contained) via props
rather than separate components:

- `aspect`: `portrait` (4:5), `landscape` (3:2), `wide` (16:9), `square`,
  or `auto` (intrinsic size — only meaningful for a local static import,
  e.g. the logo).
- `mobileAspect` / `mobilePosition`: **art direction** — render a
  different aspect ratio and/or focal point below the `lg` breakpoint than
  above it, from the *same* unaltered source image. When given,
  `aspect`/`position` become the desktop (`lg:`) values. This is how a
  photo gets an intentional portrait-biased crop on mobile and a wide
  crop on desktop without ever touching the source file — never guess one
  crop that has to work at every width.
- `fit`: `cover` (default) or `contain`.
- `position`: object-position keyword (`center` default).
- `priority`: set `true` only for the actual LCP image on a page (e.g. a
  homepage hero) — never on below-the-fold images.
- `sizes`: responsive `sizes` attribute, with a sensible default.
- `blurDataURL`: pass this for a remote (Firebase Storage) image to enable
  a blur placeholder; local static imports (like the logo) get one
  automatically.

Rules: never a hardcoded/arbitrary image dimension, never a stretched
image (aspect-locked box + `object-cover`/`object-contain`, always), no
aggressive overlays, no filters on brand or approved photography assets.
Full-resolution originals are never referenced directly in page markup —
`src` is always expected to already be an optimized/derivative URL (see
`docs/ARCHITECTURE.md`, Image / photography architecture).

**`culture1.jpg`** is the approved **primary homepage hero image**
(newborn in traditional Nepali styling — heritage/cultural storytelling).
The client-supplied original stays untouched at the project root; a copy
used by the app lives at `public/photography/culture1.jpg`, referenced via
the typed `cultureHeritageImage` export in `lib/media/approved-assets.ts`.
It's wired into `HomeHero` (`components/sections/home/HomeHero.tsx`) with
`priority` (it's the page's LCP element) and `aspect="wide"` /
`mobileAspect="portrait"` art direction — a 16:9 crop on desktop, 4:5 on
mobile, from the same unaltered file, both using `position="center"`
(the image's own empty space at the top means a center crop keeps the
baby and the flanking brass/textile styling in frame at both ratios). It
appears a second time, smaller, in the homepage's Featured Work section —
deliberately not repeated a third time elsewhere on the *same page* (see
`HeritageSection`'s comment) to avoid that page reading as thin on
content. It appears once more, site-wide, on `/portfolio/newborn/`
(`components/sections/portfolio/PortfolioCategoryLayout.tsx`) — the one
place a repeat is the point, since that page's whole purpose is showing
newborn photography.
Don't crop the baby or culturally significant objects out of frame at any
breakpoint, don't filter it.

**`favicon.png`** is the approved favicon (1024×1024 PNG), implemented via
Next.js's App Router file convention: the untouched original stays at the
project root, and an identical copy lives at `app/icon.png` — the only
location Next.js recognizes for this convention — which Next
auto-generates the `<link rel="icon">` tag from with no manual metadata
needed. The generic Next.js scaffold `app/favicon.ico` placeholder was
removed so only the approved icon is served.

## Gallery system

`lib/gallery/types.ts` defines `GalleryImage` and `Gallery` — the typed
contract every gallery component renders against. No gallery data is
hard-coded anywhere; `portfolioGalleries`/`portfolioImages` (Firestore,
planned per `docs/ARCHITECTURE.md`) will satisfy these types in a later
phase.

`components/gallery/GalleryGrid.tsx` is a masonry-inspired grid (CSS
multi-column — no JS layout pass, degrades to one column gracefully).
Renders whatever `images` array it's given; an empty array renders an
honest empty message, never placeholder/stock photography. Accepts an
optional `onImageClick` — a seam for a future lightbox, not a lightbox
implementation itself.

## Motion

Subtle and purposeful: gentle fade, soft reveal, small hover scale
(`group-hover:scale-[1.03]` on gallery images), smooth
`transition-colors`/`transition-transform` on interactive elements. No
bouncing, spinning, parallax, or scroll-jacking.

- `--duration-fast` (150ms) / `--duration-base` (250ms) / `--duration-slow`
  (500ms) and `--ease-premium` (`cubic-bezier(0.4, 0, 0.2, 1)`) are the only
  timing values used — via the `duration-*`/`ease-premium` Tailwind
  utilities they generate.
- `components/ui/Reveal.tsx` — a one-time fade + rise when an element
  enters the viewport (IntersectionObserver, not scroll-linked). Renders
  fully visible immediately if `prefers-reduced-motion` is set.
- `app/globals.css` also enforces `prefers-reduced-motion: reduce` at the
  global CSS level (collapses all animation/transition durations to
  ~0), so reduced motion is respected even for interactions that don't go
  through `Reveal`.

## Responsive design

Mobile-first; Tailwind v4's default breakpoints (`sm` 640px, `md` 768px,
`lg` 1024px, `xl` 1280px, `2xl` 1536px) are used as-is rather than
redefined, since they already cover the required test matrix (320–1920px).
`lib/design/tokens.ts` mirrors these numbers for the rare case a component
needs a breakpoint in JS, so CSS and JS never disagree.

No component may introduce a fixed width or `min-width` wider than the
viewport — `Container`/`Section` are the only source of horizontal
constraint, and mobile nav, header, and every primitive here were built
and are expected to be checked at 320–414px (phones), 768–1024px
(tablet), and 1280–1920px (desktop) with no horizontal scrolling.

## Accessibility

Built into the foundation, not bolted on:

- Semantic HTML throughout (`<header>`, `<nav>`, `<footer>`, `<button>` vs.
  `<a>` chosen correctly by `Button`, proper heading order starting at one
  `h1` per page).
- Visible focus states everywhere via a global `:focus-visible` rule
  (2px `plum` outline, 2px offset) — never suppressed on an individual
  component.
- `NavDropdown` and `MobileNav` are keyboard-operable (Tab/Enter/Escape)
  with focus genuinely trapped/returned correctly, not just the right
  ARIA attributes present — verified via real keyboard testing (Tab
  order, Escape behavior), which caught two bugs a code read alone
  didn't: `NavDropdown` dropped focus to `document.body` on Escape
  instead of returning it to the trigger, and `MobileNav` claimed
  `aria-modal="true"` without actually trapping Tab inside the panel.
  Both fixed (Phase 5.1). `NavDropdown` uses `aria-expanded`/
  `aria-controls` on the trigger, not `role="menu"`/`"menuitem"` on the
  links — that role pair implies arrow-key navigation between items,
  which a plain list of navigation links doesn't need or implement, so
  using it would be incorrect ARIA rather than helpful ARIA.
- Form fields (`components/ui/form/*`) pair with `Label`/`FieldError`/
  `HelpText` via standard `htmlFor`/`id`/`aria-describedby` wiring, which
  the calling page is responsible for connecting per-field.
- `EditorialImage`/`GalleryGrid` require real `alt` text as a prop — there
  is no default/empty fallback baked in.
- Color contrast: every text/background pairing in actual use meets its
  applicable WCAG AA threshold, verified by computing real contrast
  ratios (not assumed) — `charcoal` (#292529) on `ivory`/`white`/`blush`
  and white CTA text on `plum` (#35104A) all exceed 12:1; `taupe`
  (#746564, used at caption/small sizes down to 12px) clears 4.5:1
  against ivory/white/blush; `rose` (#9C7A81, used only for large text-h2
  step-number digits) clears the large-text 3:1 minimum. Both taupe and
  rose were deepened from their original values during a Phase 5.1 audit
  after measuring the originals (#8C7A78, #B88F98) failed these
  thresholds — same hue, same role, just enough darker to pass.
- `prefers-reduced-motion` is respected globally (see Motion).

## Border radius & shadows

Corners stay subtle or square — `radius-sm` (2px) and `radius-md` (4px)
override Tailwind's (larger) defaults globally, and nothing in the system
uses a large or pill radius. Shadows are minimal and overridden the same
way: `shadow-sm` and `shadow-md` are subtle, charcoal-tinted (never pure
black) and used only where they add real hierarchy — currently just the
`NavDropdown` panel. This is an editorial site, not a dashboard; avoid
adding shadow/radius combinations that read as "card UI."

## Admin UI

Not designed in this phase. `app/admin/*` uses the same design tokens
(colors, type scale, spacing) so it isn't visually foreign, but is
intentionally left plain/utilitarian — it is explicitly allowed to not
look identical to the public site. A later phase designs the real admin
UI on top of this same token system.

## Form foundation

`components/ui/form/`: `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`,
`Label`, `FieldError`, `HelpText`, `SubmitButton`. Purely presentational —
no validation logic, no Firebase wiring, no booking logic. All text-entry
fields share one `fieldClass` (from `Input.tsx`) so they stay visually
consistent; `Checkbox`/`Radio` use native inputs styled via `accent-plum`
rather than reimplementing checkbox/radio behavior, which keeps native
keyboard/screen-reader behavior intact for free.

## Design tokens — where things live

| What | Where |
|---|---|
| Colors, type scale, spacing, radii, shadows, motion durations, container widths | `app/globals.css` (`:root` + `@theme inline`) |
| Motion constants needed in JS, breakpoint numbers, `prefersReducedMotion()` | `lib/design/tokens.ts` |
| Route map, nav groupings | `lib/navigation/routes.ts` |
| Gallery data contract | `lib/gallery/types.ts` |

If a new value is needed, it's added to `globals.css` (or `tokens.ts` for
JS-only needs) first, then used — never hardcoded inline in a component.

## Code quality notes for this phase

No UI component library was installed — every component here is
hand-written and lightweight, on the reasoning that a luxury editorial
site's visual identity is exactly the thing a generic component library
would fight against. No new state-management dependency was introduced;
component state (dropdown open/closed, mobile nav open/closed, reveal
visibility) is local `useState`/`useRef`. Server/client boundaries: every
new component is a Server Component by default; `"use client"` is used
only where interactivity genuinely requires it (`Header`, `NavDropdown`,
`MobileNav`, `Reveal`, `GalleryGrid`).

## Phase 3A — three bugs only real browser testing caught

Phase 2/3 passed lint, typecheck and build the whole time these existed.
None of the three is the kind of thing a type checker or a build can
catch — they only showed up when the rendered pages were actually looked
at and interacted with, which is why this phase's process was: rebuild,
screenshot, look, fix, re-screenshot. Recorded here so the same class of
mistake isn't repeated:

1. **Spacing-token collision.** The original t-shirt-named spacing scale
   (`--spacing-sm`, `--spacing-md`, ... `--spacing-3xl`) reused Tailwind
   v4's own reserved size-scale words. Since `max-w-*`, `w-*`, `h-*`,
   `gap-*`, `p-*` and `m-*` all read from the same `--spacing-*`
   namespace, this silently overrode Tailwind's built-in `max-w-sm`
   through `max-w-3xl` (e.g. `max-w-2xl` became 4rem instead of 42rem)
   everywhere on the site simultaneously — the "one word per line" text
   columns this produced were the original visual bug report. Fixed by
   removing the named aliases entirely and using Tailwind's numeric scale
   directly (`gap-6` instead of `gap-md`); see the comment above the
   spacing block in `globals.css` for the full mapping.
2. **Unlayered base styles beating utility classes.** `h1`–`h4` color was
   set as plain CSS after `@import "tailwindcss"`, outside any `@layer`.
   Unlayered CSS unconditionally wins over layered CSS (which is what
   Tailwind's generated utilities are) regardless of selector specificity
   — so `text-white` on a heading inside a dark/plum section could never
   win against that rule, and every such heading rendered in the default
   dark text color instead of white. Fixed by wrapping the base
   element-reset rules in `@layer base { ... }` in `globals.css`, which
   is the documented Tailwind v4 pattern for exactly this situation.
3. **`position: fixed` collapsing inside a `backdrop-filter` ancestor.**
   `MobileNav`'s full-screen overlay (`fixed inset-0`) was rendered as a
   child of `<header>`, which has `backdrop-blur-sm`. A `backdrop-filter`
   (like `filter` or `transform`) on an ancestor creates a new containing
   block for `position: fixed` descendants — so the "full screen" overlay
   was actually sized to `<header>`'s own ~64px height, not the viewport.
   The bug was invisible in code and even in a static screenshot of the
   *closed* menu; it only showed up when the menu was actually opened in
   a real browser. Fixed by rendering `<MobileNav>` as a sibling of
   `<header>` (`components/layout/Header.tsx`) rather than nesting it
   inside. If a future fixed-position element needs to live near the
   header, check this first.

## Phase 3A — additions

- **Contact facts** (`lib/data/contact.ts`): phone, WhatsApp link, email,
  domain — single source read by `Footer`, `WhatsAppButton`, `/contact/`
  and `/book-a-session/`.
- **`WhatsAppButton`** (`components/ui/WhatsAppButton.tsx`): fixed
  bottom-right, `z-30` (below the mobile menu's `z-50`, above page
  content), a short fade-in on mount, and — since it's a plain `<a>` to a
  `wa.me` link — works immediately with no backend.
- **`PageHero`, `FaqAccordion`, `ContactRow`** (`components/ui/`): the
  shared pieces every interior page (service pages, area pages, FAQ,
  contact, booking) is built from, so those pages share one visual
  vocabulary instead of each inventing its own hero/FAQ/contact-row
  treatment.
- **No booking/contact form.** `/contact/` and `/book-a-session/`
  deliberately lead with `tel:`/`wa.me`/`mailto:` links instead of a web
  form — those work today with zero backend, where a form that "submits"
  nowhere would be a worse, dishonest experience than not having one.
  Building the real, server-backed inquiry form is later-phase work (see
  `docs/ARCHITECTURE.md`).
