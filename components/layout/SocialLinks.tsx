import type { ReactNode } from "react";

export type SocialLink = {
  platform: string;
  href: string;
  icon: ReactNode;
};

/**
 * Renders whatever social links it's given — no handle/URL is invented
 * here. Real links will come from the `socialLinks` Firestore collection
 * (see docs/ARCHITECTURE.md) and an admin settings screen in a later
 * phase; until then callers pass an empty array and this renders nothing.
 */
export function SocialLinks({
  links,
  className = "",
}: {
  links: SocialLink[];
  className?: string;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={`flex items-center gap-sm ${className}`}>
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            className="text-taupe transition-colors duration-base hover:text-plum"
          >
            {link.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
