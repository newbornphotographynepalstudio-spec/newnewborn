# Architecture — Newborn Photography Nepal

Source of truth for the production build. This document reflects what is
actually implemented as of Phase 1, plus the target architecture for later
phases (marked accordingly). If code and this document ever disagree, that
is a bug in one of them — fix the drift, don't let it stand.

## Business context

- **Studio**: Newborn Photography Nepal, by Navin — Kathmandu Valley, Nepal.
- **Core service**: newborn & baby photography.
- **Additional services**: maternity, cake smash, family photography.
- **Revenue**: session packages + premium albums, frames, prints (upsell).
- **Delivery**: primarily studio sessions; home sessions where offered.
- **Secondary business**: newborn photography training for photographers.
- **Funnel**: attract → inquiry → qualify lead → book session → sell
  package → upsell albums/prints → return for maternity/milestones/family.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS v4 |
| Hosting | GitHub → Vercel |
| Backend | Firebase (Auth, Firestore, Storage) |
| Server-side | Next.js Server Actions / Route Handlers + Firebase Admin SDK |
| Email (planned) | Resend or equivalent |
| Spam protection (planned) | Cloudflare Turnstile |

No third-party service is added unless a feature genuinely can't be done
cleanly with Next.js + Firebase.

## Folder structure

```
app/
  layout.tsx                 # root shell: <html>/<body>, fonts, global <Metadata>
  globals.css                # Tailwind v4 import + brand design tokens
  sitemap.ts / robots.ts      # technical SEO
  not-found.tsx / error.tsx   # global error boundaries

  (site)/                     # route group — public site, gets Header/Footer
    layout.tsx
    page.tsx                  # /
    about/  newborn-photography/  maternity-photography/
    baby-photography/  cake-smash-photography/  family-photography/
    portfolio/ (+ newborn/ maternity/ baby/ cake-smash/ family/)
    packages/  studio/  safety/  blog/ (+ [slug]/)  training/
    contact/  book-a-session/  faq/
    areas/ (+ kathmandu/ lalitpur/ bhaktapur/)

  admin/                       # separate shell — no public Header/Footer
    layout.tsx
    page.tsx                   # dashboard
    login/

proxy.ts                       # admin route gate (session-cookie presence; Next.js's edge "proxy"/middleware convention)

components/
  layout/   Header.tsx, Footer.tsx
  ui/       Container.tsx, Logo.tsx, PagePlaceholder.tsx

lib/
  navigation/routes.ts          # single source of truth for route paths + nav
  auth/roles.ts                 # admin role model
  admin/modules.ts               # planned admin module list
  firebase/client.ts             # Firebase client SDK (browser-safe)
  firebase/admin.ts              # Firebase Admin SDK (server-only)
  seo/site.ts                    # global site constants

public/
  brand/logo.jpg                 # supplied brand mark, used as-is

docs/
  ARCHITECTURE.md (this file), SETUP.md
```

**Why a `(site)` route group**: Next.js App Router layouts always nest
inside their parents — the root layout can't be "opted out of" by a child.
Putting every public route inside `(site)/` (a route group; it doesn't
appear in the URL) lets `(site)/layout.tsx` own the public Header/Footer
while `app/admin/layout.tsx` gets its own, separate shell. The root
`app/layout.tsx` only owns `<html>/<body>`, fonts and global metadata —
shared by both.

## Routing

Canonical URLs use a **trailing slash** (`trailingSlash: true` in
`next.config.ts`), matching the route map below exactly.

| Route | Status |
|---|---|
| `/` | placeholder home hero |
| `/about/` | placeholder |
| `/newborn-photography/` `/maternity-photography/` `/baby-photography/` `/cake-smash-photography/` `/family-photography/` | placeholder service pages |
| `/portfolio/` + `/portfolio/{newborn,maternity,baby,cake-smash,family}/` | placeholder |
| `/packages/` `/studio/` `/safety/` `/faq/` | placeholder |
| `/blog/` + `/blog/[slug]/` | placeholder; `[slug]` is a real dynamic route with no data source yet |
| `/training/` | placeholder — **canonical** route for photographer training |
| `/contact/` `/book-a-session/` | placeholder |
| `/areas/` + `/areas/{kathmandu,lalitpur,bhaktapur}/` | placeholder |
| `/admin/`, `/admin/login/` | foundation — see Admin & authorization |

**`/workshop/` and `/workshops/` → `/training/`** — permanent (301)
redirects are configured in `next.config.ts`. `/training/` is the only
canonical route for the training/workshop offering; never link to
`/workshop/` internally.

All static routes are listed once, in `lib/navigation/routes.ts`, and
consumed by the header/footer nav, `app/sitemap.ts`, and (implicitly) the
redirect config — so the route list, the nav, and the sitemap cannot drift
independently.

## Admin & authorization

**Roles** (`lib/auth/roles.ts`): `SUPER_ADMIN`, `ADMIN`, `EDITOR`,
`PHOTOGRAPHER_STAFF`, ranked in that order. Designed to expand safely (add
a role, adjust `ROLE_RANK`) without restructuring the model.

**Trust boundary — client-supplied roles are never trusted.** The plan:

1. A role is assigned server-side only, as a Firebase custom claim on the
   user's ID token (via the Admin SDK — e.g. from an already-authenticated
   `SUPER_ADMIN` action, never from a client-writable Firestore field).
2. Every privileged Server Action / Route Handler independently verifies
   the caller's session and decodes the role from the verified token
   before doing anything — it does not trust a role passed in the request
   body or read from client state.
3. Firestore Security Rules re-check `request.auth.token.role` as defense
   in depth, so direct client-SDK reads/writes are also constrained even if
   an application-layer check were ever missed.

**Current Phase 1 state**: `proxy.ts` (Next.js 16's file convention for
what was previously `middleware.ts`) gates `/admin/*` (except
`/admin/login/`) on the mere *presence* of a `__session` cookie and
redirects to `/admin/login/` if absent. This is a UX redirect, not the
security boundary — it runs on the Edge runtime, where the Firebase Admin
SDK (which needs Node.js) cannot run. **Phase 2** adds: real Firebase
Authentication sign-in on `/admin/login/`, a Route Handler that verifies
the ID token server-side and mints a proper session cookie
(`getAdminAuth().createSessionCookie`), and per-module role checks (see
`lib/admin/modules.ts` for the planned minimum role per module) enforced in
Node.js Server Actions/Route Handlers plus matching Firestore rules — never
in the Edge proxy alone.

**Admin modules** (`lib/admin/modules.ts`): Dashboard, Leads/Inquiries,
Bookings, Portfolio/Galleries, Services, Packages & Pricing, Blog/Articles,
Testimonials, FAQs, Media Library, Pages, SEO Settings, Website Settings,
Social Links, Contact Information, Analytics Integrations, Training, Areas,
Redirect Manager, Admin Users, Audit Logs, Backup/Data Export. The Phase 1
dashboard (`app/admin/page.tsx`) lists these as a static reference with
their planned minimum role; none has real data or a route yet.

## Firebase

**Project**: `newborn-9a2be` (`.firebaserc`).

**Client SDK** (`lib/firebase/client.ts`) uses only `NEXT_PUBLIC_*` env
vars — safe to ship to the browser. **Admin SDK**
(`lib/firebase/admin.ts`) is guarded with the `server-only` package (build
fails if it's ever imported into a client bundle) and reads
`FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` —
none of which are prefixed `NEXT_PUBLIC_`, so none reach the browser. No
service account file is created or committed by this scaffold.

### Firestore — planned collections (not yet created)

No collections exist yet; `firestore.rules` denies all reads/writes by
default until they're designed and implemented deliberately. Planned,
chosen by actual access pattern rather than mirroring every noun in the
business domain 1:1:

| Collection | Notes |
|---|---|
| `admins` | Admin user records (role, display name); auth identity itself lives in Firebase Auth. |
| `leads` | Public, create-only inquiry submissions (contact form, book-a-session form). |
| `bookings` | Confirmed sessions; created/edited by staff only, referencing a `leads` doc when converted from an inquiry. |
| `services` | Newborn / maternity / baby / cake smash / family — service page content. |
| `packages`, `packageAddons`, `products` | Pricing structure; add-ons and products (albums/frames/prints) kept separate from base packages to avoid duplicating pricing logic. |
| `portfolioGalleries` (+ `portfolioImages` subcollection) | One gallery doc per shoot/category; images as a subcollection so a gallery document never grows unbounded. |
| `blogPosts`, `blogCategories`, `authors` | Normalized so category/author edits don't require rewriting every post. |
| `testimonials`, `faqs` | Simple flat collections. |
| `pages` | Editable copy for otherwise-static routes (About, Safety, Studio, etc.). |
| `seoSettings` | Per-page SEO overrides, keyed by route. |
| `mediaAssets` | Media Library metadata (alt/title/caption/description/filename) — see Image architecture. |
| `redirects` | Admin-managed 301s beyond the ones hardcoded in `next.config.ts`. |
| `websiteSettings`, `socialLinks`, `contactInformation` | Global site settings, split by concern so unrelated settings don't share one oversized document. |
| `training`, `trainingModules` | Training offering + its modules/curriculum as a subcollection or normalized reference, avoiding one large document. |
| `areas` | Kathmandu / Lalitpur / Bhaktapur area-page content. |
| `auditLogs` | Append-only record of privileged admin actions (who, what, when). |

Design rules for Phase 2 implementation: avoid oversized documents (large
repeating arrays → subcollection instead), avoid duplicating data that has
one owner (e.g. don't copy full author objects onto every post — reference
by ID and denormalize only the 1–2 display fields actually read on list
views), and default every new collection's rules to deny until a specific
access pattern justifies opening it.

### Storage

Deny-all by default (`storage.rules`) until the Media Library upload path
is implemented. Planned layout: originals in an admin-only-write path,
with derived/optimized sizes served through `next/image` rather than the
originals (see Image architecture).

## Image / photography architecture

This is a photography-led site — image performance is a top priority, and
**no stock photography is used anywhere**; every image slot stays a
placeholder until Navin supplies real photography.

- Storage: Firebase Storage holds the source of truth for uploaded images.
- Delivery: pages never link to a Storage URL directly in markup — they go
  through `next/image`, configured (`next.config.ts` →
  `images.remotePatterns`) to allow `firebasestorage.googleapis.com`, which
  handles responsive `sizes`, lazy loading, and automatic WebP/AVIF
  negotiation.
- Metadata: the planned `mediaAssets` Firestore collection carries, per
  image — alt text, title, caption, description, and original filename —
  so every image has real ALT text and SEO metadata instead of a generic
  placeholder string.
- Full-resolution originals are never rendered in normal page views; only
  optimized/responsive derivatives are.
- Blur placeholders are used where practical (Next's built-in
  `placeholder="blur"`, or a stored blurDataURL for Storage-sourced
  images).
- The current logo (`public/brand/logo.jpg`) is treated as the working
  brand mark: rendered via `next/image` at a fixed, non-distorted aspect
  ratio (`components/ui/Logo.tsx`). Its source file has a solid blush
  background baked in rather than transparency — swap in a transparent
  PNG/SVG there the moment one exists; no other code changes needed.

## SEO architecture

**Implemented in Phase 1:**
- `app/sitemap.ts` — every static route in `lib/navigation/routes.ts`.
- `app/robots.ts` — allows everything except `/admin/`, points at the
  sitemap.
- Global `<Metadata>` in `app/layout.tsx` (title template, description, OG,
  Twitter card) sourced from `lib/seo/site.ts`.
- Per-route `<Metadata>` (title + description) on every placeholder page.
- Trailing-slash canonical URLs, enforced site-wide.
- 301 redirects for `/workshop/` and `/workshops/` → `/training/`.
- Custom `not-found.tsx` / `error.tsx`.

**Planned (Phase 2+), matching the required feature set:**
- Global SEO defaults (site name, default title/description, default OG
  image, favicon, site URL, Google/Bing verification, GA4/GTM/Meta Pixel
  IDs) editable from the admin **Website Settings** / **SEO Settings**
  screens, backed by the `seoSettings`/`websiteSettings` collections —
  `lib/seo/site.ts` is the seam this will plug into.
- Per-page SEO fields (title, description, slug, canonical, index/noindex,
  follow/nofollow, OG title/description/image, Twitter title/description/
  image), editable per document in `pages`, `blogPosts`,
  `portfolioGalleries`, etc.
- Structured data (JSON-LD): `Organization`, `LocalBusiness`/
  `ProfessionalService`/`Photographer` (genuinely applicable — a real
  studio with a real service area), `WebSite`, `BreadcrumbList` on
  interior pages, `Article` on blog posts, `ImageObject` on gallery images.
  No unrelated or spammy schema types.
- Breadcrumbs and dynamic sitemap entries once `blogPosts` and
  `portfolioGalleries` exist.
- Admin-managed redirects (`redirects` collection) layered on top of the
  static redirects already in `next.config.ts`.

## Brand & design direction

Superseded by **[`docs/DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)**, written in
Phase 2 once an approved color palette (7 fixed brand colors), type
pairing (Cormorant Garamond + Manrope), and full layout/component system
were specified. That document is now the source of truth for brand
positioning, colors, typography, spacing, layout primitives, buttons,
image/gallery rules, motion, responsive rules, and accessibility rules —
this section is left here only as a pointer, not duplicated content that
could drift out of sync.

## What's deliberately deferred

- Any real Firestore collection, security rule beyond deny-all, or Storage
  upload path.
- Working Firebase Authentication (the `/admin/login/` form is a static,
  disabled placeholder built on the real form primitives).
- Real content, pricing, testimonials, or photography anywhere on the
  site — every page is an honest "content in progress" placeholder; no
  stock photography is used anywhere.
- JSON-LD structured data, breadcrumbs, dynamic sitemap entries.
- Resend email and Cloudflare Turnstile integration (booking/contact forms
  aren't functional yet — there's nothing to protect or notify on).
- The real admin UI design (Phase 2 established shared tokens only — see
  `docs/DESIGN-SYSTEM.md`, Admin UI section).
