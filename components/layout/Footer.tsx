import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { Stack } from "@/components/primitives/Stack";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks, type SocialLink } from "@/components/layout/SocialLinks";
import {
  footerAreaLinks,
  footerConnectLinks,
  footerServiceLinks,
  footerStudioLinks,
  routes,
} from "@/lib/navigation/routes";

/** Populated once real handles exist (Website Settings, a later phase) — no
 * social URL is invented here. */
const socialLinks: SocialLink[] = [];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-taupe/15 bg-ivory">
      <Container size="wide" className="grid gap-2xl py-3xl sm:grid-cols-2 lg:grid-cols-4">
        <Stack gap="sm" className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-small leading-relaxed text-taupe">
            Newborn, maternity, baby, cake smash and family photography by
            Navin, serving Kathmandu Valley, Nepal.
          </p>
          <SocialLinks links={socialLinks} className="pt-2xs" />
        </Stack>

        <FooterColumn title="Services" links={footerServiceLinks} />
        <FooterColumn title="Studio" links={footerStudioLinks} />
        <FooterColumn title="Connect" links={footerConnectLinks} />
      </Container>

      <div className="border-t border-taupe/15">
        <Container
          size="wide"
          className="flex flex-col gap-xs py-lg text-caption text-taupe sm:flex-row sm:items-center sm:justify-between"
        >
          <p>&copy; {year} Newborn Photography Nepal by Navin. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-xs">
            <span>Serving</span>
            {footerAreaLinks.map((item, index) => (
              <span key={item.href} className="flex items-center gap-xs">
                <Link href={item.href} className="hover:text-plum">
                  {item.label}
                </Link>
                {index < footerAreaLinks.length - 1 ? <span>&middot;</span> : null}
              </span>
            ))}
            <span>&mdash;</span>
            <Link href={routes.areas} className="hover:text-plum">
              All areas
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-caption tracking-eyebrow text-taupe uppercase">{title}</p>
      <ul className="mt-sm space-y-2xs">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-small text-charcoal transition-colors duration-base hover:text-plum"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
