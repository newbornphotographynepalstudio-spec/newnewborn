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
    login/                      # outside (protected) — AdminLoginForm
    (protected)/                # route group — every real check lives here
      layout.tsx                 # calls requireAdminSession()
      page.tsx                   # dashboard
      bookings/ (+ [id]/)

  api/admin/session/route.ts    # mints/clears the __session cookie

proxy.ts                       # admin route gate (session-cookie presence only; Next.js's edge "proxy"/middleware convention)

components/
  layout/   Header.tsx, Footer.tsx
  ui/       Container.tsx, Logo.tsx, PagePlaceholder.tsx
  sections/admin/ AdminLoginForm.tsx, SignOutButton.tsx

lib/
  navigation/routes.ts          # single source of truth for route paths + nav
  auth/roles.ts                 # admin role model (planned, not yet wired to a claim)
  admin/modules.ts               # planned admin module list
  firebase/client.ts             # Firebase client SDK (browser-safe)
  firebase/admin.ts              # Firebase Admin SDK (server-only)
  firebase/session.ts            # real session verification — the actual auth boundary
  firebase/session-cookie.ts     # cookie name/lifetime shared by proxy.ts + session.ts
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

**Current state**: real Firebase Authentication is wired end to end.
`proxy.ts` still only checks *presence* of a `__session` cookie and
redirects to `/admin/login/` if absent — that's a UX redirect, not the
security boundary, since it runs on the Edge runtime where the Firebase
Admin SDK (which needs Node.js) cannot run. The actual boundary is
`requireAdminSession()` (`lib/firebase/session.ts`), called in
`app/admin/(protected)/layout.tsx` (every admin page except
`/admin/login/`, which sits outside that route group) and independently
inside `updateInquiryStatus` (`lib/inquiries/actions.ts`, since a Server
Action is its own callable endpoint and can't assume the page that
renders its form already checked). It cryptographically verifies the
`__session` cookie with `getAdminAuth().verifySessionCookie` and requires
the decoded token's `admin` custom claim to be `true` — a forged or
expired cookie, or a real signed-in Firebase user without that claim,
is rejected the same way (redirected / returned an error), never treated
as authorized.

Sign-in itself: `/admin/login/` (`AdminLoginForm`) signs in with the
Firebase **client** SDK (`signInWithEmailAndPassword`), gets an ID token,
and POSTs it to `POST /api/admin/session`, which verifies the ID token
with the Admin SDK, checks the `admin` claim, and — only then — mints the
session cookie via `getAdminAuth().createSessionCookie` (httpOnly,
`secure` in production, `sameSite: lax`). `DELETE /api/admin/session`
plus a client-side `signOut()` (`SignOutButton`) reverses this. There is
no self-serve admin signup — the `admin` claim is set once, out-of-band,
with the Admin SDK (see docs/SETUP.md, "Provisioning an admin user").

**What's real vs. still a placeholder**: the binary `admin` claim gates
all of `/admin/*` uniformly — it does not yet implement the granular
`lib/auth/roles.ts` rank model (`SUPER_ADMIN`/`ADMIN`/`EDITOR`/
`PHOTOGRAPHER_STAFF`) or `lib/admin/modules.ts`'s per-module minimum
role. That finer-grained model stays a documented plan, not wired to any
claim, because the only admin module with a real implementation today
(Leads/Inquiries — `/admin/bookings/`) doesn't need it; per-module role
checks are worth building once more modules have real data/actions behind
them, not before. **Not independently verified end-to-end in this
environment**: there is no `.env.local` here, so no real
`NEXT_PUBLIC_FIREBASE_*` / `FIREBASE_*` credentials and no Firebase user
with the `admin` claim exist to sign in with. What *is* verified: the
code typechecks/builds/lints; a request with no session cookie is
redirected to `/admin/login/`; a request with a syntactically-present but
cryptographically invalid (forged) cookie is also redirected — proving
`requireAdminSession()`, not cookie presence, is what actually gates
access; and `POST /api/admin/session` fails with a clear, intentional
error (not a crash) when Admin SDK credentials are absent. The
client-sign-in → ID-token → session-cookie round trip itself needs real
credentials to exercise and has not been run against a live Firebase
project.

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

### Firestore — collections

`firestore.rules` denies all reads/writes by default; each collection
below gets an explicit rule only once it's actually implemented — chosen
by real access pattern rather than mirroring every noun in the business
domain 1:1.

**`inquiries`, `packages`, `posts`, `settings`, `faqs`, `media`,
`auditLogs` and `pageSeo` are implemented** (Phases 4, 11, 12, 13 and 14)
— every other collection below is still planned, not yet created, mostly
deliberately (see each row). See "Booking / inquiry system" further down
for the `inquiries` data model, write path and security rules.

| Collection | Notes |
|---|---|
| `admins` | Admin user records (role, display name); auth identity itself lives in Firebase Auth. Not yet needed — there is exactly one admin account (superadmin), gated by the binary `admin` custom claim, not a Firestore-backed role table. The data model doesn't block adding one later: a second admin would just be a second Firebase Auth user with the same claim set via the same `setCustomUserClaims` call, no schema change required. |
| `inquiries` | **Implemented.** One document per booking/training enquiry from `/book-a-session/`. A single collection with a `status` field (new/contacted/booked/closed) models the lifecycle without needing to migrate a document between two collections. Phase 12 added optional `adminNotes` and `followUpDate` fields directly on the same document rather than separate `clients`/`notes`/`followUps` collections — this business's actual relationship is 1:1 (one enquiry, one family, one set of notes), so a separate collection would only add joins without adding capability. Phase 14 added `/admin/clients/`, a read-only view (`lib/inquiries/clients.ts`) that groups these same documents by email/phone in memory — still no separate `clients` collection, so there is nothing new to keep in sync. |
| `packages` | **Implemented** (Phase 11) — `lib/packages/data.ts` / `admin-data.ts` / `actions.ts`. Admin-editable via `/admin/packages/`; public `/packages/` and the homepage preview read from here, falling back to the original approved hardcoded pricing (`lib/data/packages.ts`) if the collection is empty or unreachable. Seeded with the exact original figures on first setup, never invented. |
| `posts` | **Implemented** (Phase 11) — `lib/blog/data.ts` / `admin-data.ts` / `actions.ts`. Admin-editable via `/admin/blog/`; `/blog/` and `/blog/[slug]/` read only `status == "published"` posts, sorted in memory (not a Firestore `orderBy`, to avoid requiring a composite index at this post volume). Draft posts are never shown publicly. |
| `settings` (single `site` document) | **Implemented** (Phase 11), partially — currently holds `socialLinks` only (`lib/settings/data.ts`). Admin-editable via `/admin/settings/`, which also surfaces live, read-only system status (Firestore/Storage/Google Places configuration) computed on each load, never stored. Deliberately the *only* settings document — General/Contact/Business Info were evaluated in Phase 12 and kept code-controlled (`lib/data/contact.ts`): stable business facts that change rarely enough that a code review on change is a feature, not friction, and splitting them into more Firestore documents would just be more places for the one real source of truth to drift. |
| `faqs` | **Implemented** (Phase 12) — `lib/faq/data.ts` / `admin-data.ts` / `actions.ts`. Admin-editable via `/admin/faqs/`; the homepage preview is always the first 5 (by `order`) of the same collection the full `/faq/` page reads, never a separately-maintained subset that can drift. Seeded with the original 11 approved questions. |
| `media` | **Implemented** (Phase 12, storage backend replaced Phase 13). Metadata lives in this Firestore collection (`lib/media/library-data.ts` / `library-actions.ts`); the actual files are **not** in Firebase Storage — this project is on the Spark/free plan, which doesn't include Storage — but in **Supabase Storage** (`lib/supabase/admin.ts`, bucket `media`), reached only through a server-only admin client. Admin-editable via `/admin/media/`; wired additively into `/portfolio/*` category pages and the homepage Featured Work section (Phase 13) alongside the existing approved static galleries (`lib/media/newborn-gallery.ts`, `lib/media/cake-smash-gallery.ts`), which remain the fallback/primary content — `media` is where *new* photography gets added without touching that approved set. |
| `auditLogs` | **Implemented** (Phase 12) — `lib/audit/log.ts` / `data.ts`. Every mutating admin Server Action (`updateInquiryStatus`, `saveInquiryNotes`, `savePackage`/`deletePackage`, `savePost`/`deletePost`, `saveSocialLinks`, `saveFaq`/`deleteFaq`, `uploadMedia`/`updateMediaMetadata`/`deleteMedia`) writes one entry: actor uid/email, action, entity type/id, a short non-secret detail string. Logging is best-effort (wrapped so a logging failure never blocks the real mutation) and read-only from `/admin/security/`. No secrets, tokens, or passwords are ever written to an entry. |
| `services` | Newborn / maternity / baby / cake smash / family — service page content. Still code-controlled (`lib/data/service-pages.ts`); not migrated, since the copy is tightly tied to hand-written, service-specific FAQ and editorial content. |
| `portfolioGalleries` (+ `portfolioImages` subcollection) | Still code-controlled (`lib/media/newborn-gallery.ts`, `lib/media/cake-smash-gallery.ts`). `media` (above) is the CMS-backed replacement path for *new* photography; these stay as the authoritative source for the existing, already-approved selection until they're deliberately merged. `/admin/portfolio/` shows this data read-only and links to `/admin/media/` for uploads. |
| `blogCategories`, `authors` | Not implemented — `posts` currently stores `author` as a plain string rather than a reference, since there is one author. Revisit if/when there's more than one contributor. |
| `testimonials` | Not implemented, deliberately. Google Reviews (`lib/reviews/google-places.ts`, `lib/data/reviews.ts`) is the only genuine testimonial source this project uses; a separate hand-entered testimonials collection would either duplicate that or risk becoming a place to put unverifiable quotes, which every phase of this project has refused to do. |
| `pages` | Editable copy for otherwise-static routes (About, Safety, Studio, etc.). Deliberately still code-controlled — see "What's deliberately deferred." |
| `pageSeo` | **Implemented** (Phase 13, extended to full coverage Phase 14) — `lib/seo/page-overrides.ts`, one document per route (`pathToDocId(path)`, e.g. `/about/` → `about`). Every field (title, meta description, canonical, OG/Twitter overrides, noindex/nofollow) falls back to that page's own hardcoded default when no override exists, via `buildPageMetadata()`. Admin-editable at `/admin/seo/pages/`. As of Phase 14, all 26 public routes call this — every service, portfolio, area, and static content page, plus the homepage — so an admin edit here reaches every page's real rendered `<title>`/`<meta>`/JSON-LD, not just `/about/`. `packages` and `posts` documents additionally carry their own `seoTitle`/`seoDescription` directly (per-item, not per-route), which is intentionally separate from this collection. |
| `redirects` | Admin-managed 301s beyond the ones hardcoded in `next.config.ts`. Not implemented — the one existing redirect (`/workshop/` → `/training/`) is low-churn enough that a code change (with its own review/deploy safety) is preferable to a runtime-editable redirect table that could silently break a URL. |
| `contactInformation` | Studio phone/email/WhatsApp — still code-controlled (`lib/data/contact.ts`); see the `settings` row above. |
| `training`, `trainingModules`, workshop registrations/participants | Training offering + its modules/curriculum: still code-controlled (`lib/data/training.ts`). Training enquiries already flow through `inquiries` (`session.type === "training"`) — a separate `registrations`/`participants` model was evaluated in Phase 12 and not built, since it would duplicate data `inquiries` already holds without adding a workflow this business currently uses (no dates/curriculum/pricing are published anywhere, on this site or the reference site it was modeled from — "every tier ends in a conversation," by design). |
| `areas` | Kathmandu / Lalitpur / Bhaktapur area-page content. Still code-controlled. |

### Realtime Database — deliberately not used

The Firebase project also has a Realtime Database instance (enabled by
the owner, console URL supplied in Phase 11). It is **not used by this
app** and Firestore remains the sole source of truth for `inquiries`,
`packages`, `posts` and `settings`.

Reasoning: RTDB's actual advantage over Firestore is push-based realtime
listeners at lower latency/cost for very high-frequency updates (live
chat, presence, live cursors). Nothing in this application has that
shape — bookings arrive at human speed (one enquiry every so often, not
a stream), and the admin panel already gets fresh data on every
navigation via server-side rendering plus `revalidatePath()` after every
write, which is simpler to reason about than keeping two databases in
sync. Maintaining the same booking data in both RTDB and Firestore would
mean either double-writing on every mutation (a real source of the two
going out of sync) or picking one as authoritative and the other as a
stale mirror, neither of which buys anything here. If a genuine
low-latency multi-viewer requirement emerges later (e.g. two admins
editing the same booking at once and needing to see each other's
cursor), Firestore's own `onSnapshot` real-time listeners are the more
appropriate tool before reaching for RTDB, since they'd let this app
gain realtime updates without introducing a second database at all.

Design rules for future collections: avoid oversized documents (large
repeating arrays → subcollection instead), avoid duplicating data that has
one owner (e.g. don't copy full author objects onto every post — reference
by ID and denormalize only the 1–2 display fields actually read on list
views), and default every new collection's rules to deny until a specific
access pattern justifies opening it.

### Booking / inquiry system (Phase 4)

The one full public-write / admin-read feature actually wired to
Firestore. Three moving pieces:

1. **Write path** — `/book-a-session/` renders `BookingForm`
   (`components/sections/booking/BookingForm.tsx`, a client component
   using React's `useActionState`), which posts to the `submitInquiry`
   Server Action (`lib/inquiries/actions.ts`). That action validates
   required fields server-side, verifies a Turnstile token when
   `TURNSTILE_SECRET_KEY` is configured (no-op otherwise — see
   `lib/security/turnstile.ts`), and writes the document directly via the
   **Firebase Admin SDK**. The public Firebase *client* SDK is never used
   to create an inquiry, by design.
2. **Read/update path** — `/admin/bookings/` (list) and
   `/admin/bookings/[id]/` (detail, with a status-update form calling the
   `updateInquiryStatus` Server Action) read exclusively through the
   Admin SDK too (`lib/inquiries/admin-data.ts`), gated by
   `requireAdminSession()` (real, cryptographic session verification —
   see "Admin & authorization" above) rather than the `/admin/*`
   cookie-presence check alone. Both Firebase-reliant pages degrade to an
   honest "not configured" message instead of crashing when Admin SDK
   credentials aren't set — exactly what happens in this repo's own
   dev/build environment right now.
3. **Firestore rules** (`firestore.rules`, `inquiries` match block) — a
   second, independent layer: public `create` is allowed only for
   documents matching the exact real schema (required fields present,
   `status` forced to `"new"`, `source` forced to `"website"`), and
   `read`/`update`/`delete` are unconditionally denied for every client.
   Because both the write and read paths already go through the Admin
   SDK (which bypasses rules entirely), these rules aren't the only thing
   enforcing "public creates, only admin reads" — but they mean that
   invariant holds even against a hypothetical future direct
   client-SDK code path, not just the one that exists today.

**Formerly a known limitation, now closed**: `/admin/*` used to be gated
only by `proxy.ts` checking *presence* of a `__session` cookie, not its
cryptographic validity. Real Firebase Authentication (sign-in on
`/admin/login/`, `getAdminAuth().verifySessionCookie` server-side
verification, an `admin` custom claim check) now gates every admin page
and the `updateInquiryStatus` action — see "Admin & authorization" above
for exactly what's wired, what's still a placeholder (the granular role
model), and what remains unverified without real Firebase credentials in
this environment.

Data model: see `lib/inquiries/types.ts` for the exact `Inquiry` shape
(customer, session, baby, message, contactPreference, status, source) —
it matches what's actually stored, not an aspirational schema.

### Storage

**Implemented on Supabase Storage, not Firebase Storage.** This
project stays on the Firebase **Spark (free) plan**, which does not
include Storage at all — confirmed live in Phase 12 (an actual write
attempt returned a clean `404 The specified bucket does not exist`,
i.e. Storage has never been initialized for this project, by design,
not by accident). Per explicit owner instruction (Phase 13), Firebase
Storage is not to be enabled or built around; Supabase Storage is the
permanent choice for this capability, not a temporary workaround.

- **Bucket**: `media`, public-read, created programmatically in Phase
  14.1 (`supabase.storage.createBucket("media", { public: true,
  allowedMimeTypes: [...], fileSizeLimit: "20MB" })`) once
  `SUPABASE_SERVICE_ROLE_KEY` became available. Restricted to
  JPEG/PNG/WebP.
- **Client**: `lib/supabase/admin.ts` — a server-only, service-role
  Supabase client, isolated to Storage operations only (this is not a
  second application database; Firestore/Auth remain entirely on
  Firebase). `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the
  browser or prefixed `NEXT_PUBLIC_`.
- **Write path**: `lib/media/library-actions.ts` uploads to
  `{category}/{timestamp}-{filename}` via this admin client; metadata
  (title, alt, category, featured, published, order, real width/height
  parsed by `lib/media/image-dimensions.ts`) lives in the `media`
  Firestore collection (above). All writes require
  `verifyAdminSession()` — authorization is enforced by this app's own
  session check, not by a Supabase Storage RLS policy, which is why the
  service-role key (not the public/publishable key) is required for
  every write.
- **Read path**: public, unauthenticated, via the bucket's public URL
  (`getPublicUrl()`) — no Supabase credential needed to view a photo,
  same as any other public image on the site.
- **Verified live end-to-end** (Phase 14.1): a real image uploaded
  through `/admin/media/` → appeared in Supabase Storage → correct
  Firestore metadata (including real parsed dimensions) → public URL
  returned 200 with the right content-type → appeared on
  `/portfolio/newborn/` → edited (alt text) → deleted through the real
  admin UI → confirmed gone from both Supabase Storage and Firestore.
  No residue left behind.
- **A separate, pre-existing bucket named `portfolio`** was found in
  the same Supabase project during this check — public, containing 43
  real-looking photos (`newborn-*.webp`, `maternity-*.webp`,
  `cakesmash-*.webp`) uploaded 2026-06-22. **Nothing in this codebase
  references it**, and it doesn't correspond to any `media` Firestore
  document. It was left completely untouched rather than repurposed or
  deleted — its origin is unconfirmed and it may be in active use
  elsewhere; the owner should verify what it is before anyone acts on
  it.

Originals stay in Storage as uploaded (never resized server-side —
`next/image`'s on-demand optimization, configured for
`*.supabase.co` in `next.config.ts`, means visitors never receive the
original file regardless of its size); `uploadMedia` still rejects
anything over 20MB so an admin doesn't accidentally upload a raw 40MB
camera file when a web-ready export was intended.

## Image / photography architecture

This is a photography-led site — image performance is a top priority, and
**no stock photography is used anywhere**; every image slot stays a
placeholder until Navin supplies real photography.

- Storage: newly-uploaded photography lives in Supabase Storage (see
  "Storage" above); the site's original, already-approved galleries stay
  as static files under `public/`.
- Delivery: pages never link to a Storage URL directly in markup — they go
  through `next/image`, configured (`next.config.ts` →
  `images.remotePatterns`) to allow `*.supabase.co`, which
  handles responsive `sizes`, lazy loading, and automatic WebP/AVIF
  negotiation.
- Metadata: the `media` Firestore collection carries, per
  image — alt text, title, caption, category, and real parsed
  width/height — so every uploaded image has real ALT text and SEO
  metadata instead of a generic placeholder string.
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
- Structured data already implemented (`lib/seo/jsonld.ts`): `Organization`,
  `WebSite`, `ProfessionalService` on the homepage; `BreadcrumbList` on
  every page two levels deep with a genuine hierarchy (all 5
  `/portfolio/{category}/` pages, all 3 `/areas/{city}/` pages) —
  `breadcrumbJsonLd()` is a reusable builder, not a one-off. Still
  planned, once real data exists to back them honestly: `Article` on
  published blog posts (no posts exist yet, so no invented
  datePublished/author), `ImageObject` on gallery images.
- Dynamic sitemap entries once `blogPosts` and `portfolioGalleries` exist
  as real Firestore collections (the sitemap already lists every current
  static route correctly).
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

- Every planned Firestore collection except `inquiries` (see "Booking /
  inquiry system" above) — no `admins`, `services`, `packages`,
  `portfolioGalleries`, `blogPosts`, etc. yet, and no Storage upload path.
- The granular per-module role model (`lib/auth/roles.ts`,
  `lib/admin/modules.ts`) — real Firebase Authentication itself is wired
  (see "Admin & authorization" above); only the finer-grained role ranks
  remain unimplemented, deferred until more admin modules exist.
- Real content exists on every route except `/blog/` (lists planned
  topics, no published articles yet) and
  `/portfolio/{maternity,baby,cake-smash,family}/` (honest gallery-empty
  state — no approved photography for those categories yet). No stock
  photography is used anywhere. Real photography now spans: `culture1.jpg`
  (homepage hero + Featured Work), 6 real newborn session photos and 5
  real cake smash session photos (`lib/media/newborn-gallery.ts`,
  `lib/media/cake-smash-gallery.ts`), used across the homepage,
  `/newborn-photography/`, `/cake-smash-photography/`,
  `/portfolio/newborn/` and `/portfolio/cake-smash/`.
- Newborn session packages are real, published pricing (Phase 4,
  `lib/data/packages.ts`) — maternity/baby/cake-smash/family packages
  still aren't published, so those pages keep the "pricing on request"
  treatment. Reviews render an honest empty state (no invented
  testimonials) — see `lib/data/reviews.ts`. The homepage *does* attempt
  a real fetch from the Google Places API (New) at request time
  (`lib/reviews/google-places.ts`) before falling back to that empty
  state; this environment has no `GOOGLE_PLACES_API_KEY`/
  `GOOGLE_PLACES_PLACE_ID` configured, so the fetch always short-circuits
  and the empty state is what actually renders today — see
  docs/SETUP.md, "Google Reviews", for exactly what's needed to change
  that, and why the Business Profile API (which requires OAuth + a
  separate Google approval process) isn't the path used here.
- `/contact/` and `/book-a-session/` lead with `tel:`/`wa.me`/`mailto:`
  links (work with no backend) *and* `/book-a-session/` now also has a
  real, Firestore-backed enquiry form (see "Booking / inquiry system").
- Resend email notifications on new inquiries (the Server Action writes
  to Firestore; nothing emails the studio yet when one arrives).
- Dynamic sitemap entries (blog posts, portfolio galleries) once those
  collections exist; breadcrumbs on interior pages.
- The real admin UI design (shared tokens only — see
  `docs/DESIGN-SYSTEM.md`, Admin UI section) and every admin module
  besides Bookings: no gallery manager, package editor, copy editor or
  analytics dashboard.
