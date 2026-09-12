export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Intentionally separate from the public (site) layout — no public Header
 * or Footer. This is its own minimal shell; Phase 2 replaces it with the
 * full admin chrome (auth-aware nav, current user, sign-out).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-soft text-charcoal">
      <header className="border-b border-stone bg-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="font-display text-lg text-ink">
            Newborn Photography Nepal — Admin
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
