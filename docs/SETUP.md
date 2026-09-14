# Setup — Newborn Photography Nepal

## Requirements

- Node.js 20.19+ or 22.13+ (matches the `engines` expectations of this
  project's dependencies; Node 22 LTS recommended).
- npm (the project uses `package-lock.json`).
- A Firebase project — this project targets **`newborn-9a2be`**
  (see `.firebaserc`).

## Local development

```bash
npm install
cp .env.example .env.local
# fill in .env.local with real values — see "Environment variables" below
npm run dev
```

The app runs at http://localhost:3000.

`.env.local` is git-ignored (see `.gitignore`) and must never be committed.

## Environment variables

All variables are documented with placeholders in `.env.example`. Summary:

| Variable | Where it's used | Secret? |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client SDK (`lib/firebase/client.ts`) | No — public by design, but still only set what's needed |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase client SDK | No |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase client SDK | No |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase client SDK | No |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase client SDK | No |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase client SDK | No |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase client SDK (Analytics) | No |
| `FIREBASE_PROJECT_ID` | Firebase **Admin** SDK (`lib/firebase/admin.ts`) | No (matches the public project id) |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK | **Yes** |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | `app/sitemap.ts`, `app/robots.ts`, `lib/seo/site.ts` | No |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | search console verification (wired up when needed) | No |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | analytics (wired up when needed) | No |
| `GOOGLE_PLACES_API_KEY` | live Google Reviews (`lib/reviews/google-places.ts`) | **Yes** |
| `GOOGLE_PLACES_PLACE_ID` | live Google Reviews | No (identifies the business, not secret, but still kept server-only since it's paired with the key) |
| `RESEND_API_KEY` | transactional email — not yet wired up | **Yes** |
| `TURNSTILE_SECRET_KEY` | form spam protection — not yet wired up | **Yes** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | form spam protection — not yet wired up | No |

Anything **not** prefixed `NEXT_PUBLIC_` stays server-only and is never
sent to the browser. Never put a secret value behind a `NEXT_PUBLIC_` name.

## Firebase setup

1. In the [Firebase Console](https://console.firebase.google.com/), open
   (or create) the project with ID **`newborn-9a2be`**.
2. **Web app config**: Project settings → General → "Your apps" → add (or
   open) a Web app. Copy the config values into the `NEXT_PUBLIC_FIREBASE_*`
   variables in `.env.local`.
3. **Admin SDK service account**: Project settings → Service accounts →
   "Generate new private key". This downloads a JSON file — **do not commit
   it**. From it, set:
   - `FIREBASE_PROJECT_ID` — the `project_id` field
   - `FIREBASE_CLIENT_EMAIL` — the `client_email` field
   - `FIREBASE_PRIVATE_KEY` — the `private_key` field, kept as one string;
     `lib/firebase/admin.ts` converts literal `\n` sequences back into real
     newlines, so when pasting into a `.env` file or a Vercel env var box
     (which typically can't hold literal newlines), keep the `\n`
     characters as-is rather than inserting real line breaks.
4. **Authentication**: enable the Email/Password sign-in provider.
   Admin sign-in (`/admin/login`) is fully wired to Firebase Auth — see
   "Provisioning an admin user" below for the one step still required
   before anyone can actually sign in.
5. **Firestore** and **Storage**: enable both in the console. Security
   rules are already defined in this repo (`firestore.rules`,
   `storage.rules`) as deny-all foundations — deploy them with the Firebase
   CLI once you have it installed and are logged in:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage:rules
   ```
   (`.firebaserc` already points the CLI at `newborn-9a2be`.)

No collections need to be created manually — Firestore creates a
collection the first time a document is written to it, and none of that
happens until Phase 2 builds the corresponding feature.

### Provisioning an admin user

`/admin/*` requires a Firebase user that carries the **`admin` custom
claim** — see `lib/firebase/session.ts`. There is deliberately no
self-serve admin signup (a real Firebase account alone is not enough to
reach `/admin/bookings`); the claim is set once, out-of-band, with the
Admin SDK:

1. In the Firebase Console → Authentication → Users, add the admin's user
   (email/password), or let them sign up via a script if you build one.
   Note their **UID**.
2. Run a one-off script with the Admin SDK credentials already in
   `.env.local`:
   ```js
   // scripts/set-admin-claim.mjs — run with: node scripts/set-admin-claim.mjs <uid>
   import { getAdminAuth } from "../lib/firebase/admin.ts";
   const uid = process.argv[2];
   await getAdminAuth().setCustomUserClaims(uid, { admin: true });
   console.log(`admin claim set for ${uid}`);
   ```
   (This repo doesn't ship that script pre-written — write it when you
   have a real UID to run it against, rather than leaving an unused
   privileged script sitting in the repo.)
3. The user must sign out and back in (or wait for their existing ID
   token to refresh, up to an hour) for the new claim to appear in a
   freshly issued ID token — `/api/admin/session` reads the claim from
   the ID token at sign-in time.

## Google Reviews

The homepage's reviews section (`components/sections/home/ReviewsSection.tsx`)
is wired to fetch real reviews from the **Google Places API (New)** at
request time (`lib/reviews/google-places.ts`), but is fully functional
without it — with no credentials configured, it shows an honest empty
state pointing at the real Google review link
(`https://g.page/r/CQVMlzKA1Cv7EAE/review`, `lib/data/reviews.ts`) instead
of any reviews. No review text, name, rating, or count is ever invented
by this codebase; only genuinely-fetched data is displayed.

**Why not the Business Profile API (formerly Google My Business API)?**
That API can also return reviews, but requires the business owner to
complete Google's separate API-access application/approval process and
authenticate via OAuth as the verified profile owner — it's not something
that can be enabled by just turning on an API in a Cloud project, and
isn't something this environment (or a typical `.env.local` setup) can
complete. The **Places API (New)** Place Details endpoint is the
practical path: it needs only an API key, no OAuth, no approval process,
and this repo is already built to use it the moment credentials exist.
Its tradeoff: it returns **at most 5 reviews**, chosen by Google (not
sortable or filterable by this code).

To connect it:

1. In the [Google Cloud Console](https://console.cloud.google.com/), create
   or select a project (can be the same one Firebase uses, or a separate
   one — either works).
2. **Enable billing** on that project (Settings → Billing). This is
   required by Google even though real-world usage here should stay
   inside the free monthly allowance — the fetch is cached for 24 hours
   (`next: { revalidate: 86400 }`), so it calls the API at most ~30
   times/month, not once per page view.
3. **APIs & Services → Library** → enable **"Places API (New)"**.
4. **APIs & Services → Credentials** → Create Credentials → API key.
   Restrict it immediately:
   - **API restrictions** → restrict the key to "Places API (New)" only.
   - This key is used server-only (`lib/reviews/google-places.ts` is
     guarded by the `server-only` package) and must never be prefixed
     `NEXT_PUBLIC_` or otherwise sent to the browser.
5. **Find the Place ID** for "Newborn Photography Nepal" using Google's
   [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
   (search the business by name, copy the Place ID shown).
6. Set both in `.env.local` (and in Vercel's Production/Preview env vars
   when deploying):
   ```
   GOOGLE_PLACES_API_KEY=<the restricted API key>
   GOOGLE_PLACES_PLACE_ID=<the Place ID from step 5>
   ```
7. Restart the dev server (or redeploy). No code changes are needed —
   `fetchGoogleReviews()` picks up both variables automatically, and the
   homepage's `aggregateRating` structured data (`lib/seo/jsonld.ts`)
   starts reflecting the real rating/review count returned by Google.

**Cost note**: the `reviews` field falls under Google's "Enterprise +
Atmosphere" Place Details pricing tier (currently ~$40 per 1,000
requests beyond the free monthly allowance) — confirm current pricing at
[Places API usage and billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)
before enabling in a cost-sensitive environment. At the cached ~30
requests/month this integration makes, it should not exceed the free tier
in practice, but Google still requires a valid billing method on file.

## Build, lint, type checking

```bash
npm run build       # production build (next build)
npm run lint         # ESLint (eslint-config-next)
npm run typecheck    # tsc --noEmit
```

Run all three before pushing — a change that fails any of these is not
done.

## Deployment (Vercel)

1. Import the GitHub repository
   (`newbornphotographynepalstudio-spec/newnewborn`) into Vercel.
2. Framework preset: Next.js (auto-detected).
3. Add every variable from `.env.example` to Vercel's Project Settings →
   Environment Variables, with real values, for the **Production** and
   **Preview** environments. Keep `FIREBASE_CLIENT_EMAIL` and
   `FIREBASE_PRIVATE_KEY` (and any Resend/Turnstile secret) out of anything
   client-exposed — Vercel env vars are server-only unless prefixed
   `NEXT_PUBLIC_`, which is exactly the split already used in this project.
4. Set `NEXT_PUBLIC_SITE_URL` to the real production domain once one is
   assigned.
5. Deploy. Vercel builds with `npm run build` automatically.

This scaffold has not yet been connected to a live Vercel project as part
of Phase 1 — do that connection explicitly, don't assume it exists.
