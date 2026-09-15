import Link from "next/link";

import { Container } from "@/components/primitives/Container";
import { Stack } from "@/components/primitives/Stack";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks, type SocialLink } from "@/components/layout/SocialLinks";
import { socialIcons } from "@/components/layout/social-icons";
import { contactInfo } from "@/lib/data/contact";
import { getSiteSettings } from "@/lib/settings/data";
import {
  footerAreaLinks,
  footerConnectLinks,
  footerServiceLinks,
  footerStudioLinks,
  routes,
} from "@/lib/navigation/routes";

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();
  const socialLinks: SocialLink[] = settings.socialLinks.map((link) => ({
    platform: link.platform,
    href: link.href,
    icon: socialIcons[link.platform],
  }));

  return (
    <footer className="border-t border-taupe/15 bg-ivory">
      <Container size="wide" className="grid gap-16 py-24 sm:grid-cols-2 lg:grid-cols-4">
        <Stack gap="sm" className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-small leading-relaxed text-taupe">
            Newborn photography in Kathmandu, Nepal, with maternity, baby,
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
            {/* The sm:mr-* offset only clears the fixed WhatsAppButton for
                this row's own single-line layout at 640px+ — it no longer
                needs to reserve bottom clearance itself since the credit
                strip below is now the page's last content and carries
                that instead. */}
            <span>Serving</span>
            {footerAreaLinks.map((item, index) => (
              <span key={item.href} className="flex items-center gap-3">
                <Link href={item.href} className="hover:text-plum">
                  {item.label}
                </Link>
                {index < footerAreaLinks.length - 1 ? <span>&middot;</span> : null}
              </span>
            ))}
            <span>&middot;</span>
            <Link href={routes.areas} className="hover:text-plum">
              All areas
            </Link>
          </div>
        </Container>
      </div>

      <div className="border-t border-taupe/10">
        <Container
          size="wide"
          className="pt-4 pb-32 text-center text-caption text-taupe/70 lg:pb-4"
        >
          {/* This is the last content on every page, so it carries the
              clearance for TWO fixed elements below `lg` (where both
              WhatsAppButton and StickyMobileCta are visible — the CTA
              bar is `lg:hidden`, matching this breakpoint exactly):
              WhatsAppButton's ~76px footprint (h-14 + bottom-5, reserved
              horizontally via the row above's sm:mr-*) and
              StickyMobileCta's own ~76-110px full-width bar (taller on
              notched devices, via safe-area-inset-bottom). pb-32 (128px)
              covers both with margin; lg:pb-4 once neither fixed element
              is visible. Verified against both elements at
              320/375/390/430/1440px. */}
          Designed &amp; crafted by{" "}
          <a
            href="https://www.aayushmainali.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-plum hover:underline underline-offset-4"
          >
            Aayush Mainali
          </a>
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
