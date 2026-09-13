import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { Stack } from "@/components/primitives/Stack";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks, type SocialLink } from "@/components/layout/SocialLinks";
import { contactInfo } from "@/lib/data/contact";
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
      <Container size="wide" className="grid gap-16 py-24 sm:grid-cols-2 lg:grid-cols-4">
        <Stack gap="sm" className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-small leading-relaxed text-taupe">
            Newborn photography in Kathmandu, Nepal — with maternity, baby,
            cake smash and family sessions.
          </p>
          <div className="text-small text-charcoal">
            <a href={`tel:${contactInfo.phoneE164}`} className="block hover:text-plum">
              {contactInfo.phoneDisplay}
            </a>
            <a
              href={contactInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block hover:text-plum"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="mt-1 block break-words hover:text-plum"
            >
              {contactInfo.email}
            </a>
          </div>
          <SocialLinks links={socialLinks} className="pt-2" />
        </Stack>

        <FooterColumn title="Services" links={footerServiceLinks} />
        <FooterColumn title="Studio" links={footerStudioLinks} />
        <FooterColumn title="Connect" links={footerConnectLinks} />
      </Container>

      <div className="border-t border-taupe/15">
        <Container
          size="wide"
          className="flex flex-col gap-3 py-8 text-caption text-taupe sm:flex-row sm:items-center sm:justify-between"
        >
          <p>&copy; {year} Newborn Photography Nepal by Navin. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 sm:mr-24 lg:mr-28">
            {/* Right margin at sm+ keeps this row clear of the fixed
                WhatsAppButton (bottom-right, ~80-96px footprint from the
                viewport edge) — without it, "All areas" sits directly
                under the button at the bottom of the page. */}
            <span>Serving</span>
            {footerAreaLinks.map((item, index) => (
              <span key={item.href} className="flex items-center gap-3">
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
      <ul className="mt-4 space-y-2">
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
