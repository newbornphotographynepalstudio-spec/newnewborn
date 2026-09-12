export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Intentionally separate from the public (site) layout — no public Header
 * or Footer, and deliberately not fully designed yet (see
 * docs/DESIGN-SYSTEM.md, Admin UI section — this phase is public-site
 * design system + foundation only). It shares the same color/type/spacing
 * tokens as the public site, but is not required to look identical to it —
 * a later phase designs the real admin UI.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blush text-charcoal">
      <header className="border-b border-taupe/20 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-gutter">
          <p className="font-display text-h4 text-plum">
            Newborn Photography Nepal — Admin
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
