export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Intentionally separate from the public (site) layout — no public
 * Header or Footer. Deliberately thin: it only resets the font to sans
 * (the base layer in app/globals.css applies the public site's serif
 * display font to every h1-h4 by element selector, including here — see
 * that file's `@layer base` block) and sets the admin's neutral
 * background; everything else (sidebar, header, page chrome) is owned
 * by AdminShell (rendered from the protected layout) or, for
 * /admin/login specifically, by that page itself.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-50 font-sans text-slate-900 [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans">{children}</div>;
}
