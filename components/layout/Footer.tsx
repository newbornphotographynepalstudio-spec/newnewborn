import Link from "next/link";

import { Container } from "@/components/ui/Container";
import {
  footerAreaLinks,
  footerServiceLinks,
  footerStudioLinks,
  routes,
} from "@/lib/navigation/routes";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone bg-cream">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl text-ink">
            Newborn Photography Nepal
          </p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
            Newborn, maternity, baby, cake smash and family photography by
            Navin, serving Kathmandu Valley, Nepal.
          </p>
        </div>

        <FooterColumn title="Services" links={footerServiceLinks} />
        <FooterColumn title="Studio" links={footerStudioLinks} />

        <div>
          <p className="text-sm font-medium text-ink">Areas Served</p>
          <ul className="mt-4 space-y-2">
            {footerAreaLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-charcoal/70 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={routes.areas}
                className="text-sm text-charcoal/70 hover:text-ink"
              >
                All Areas
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-stone">
        <Container className="flex flex-col gap-2 py-6 text-xs text-charcoal/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} Newborn Photography Nepal by Navin. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href={routes.contact} className="hover:text-ink">
              Contact
            </Link>
            <Link href={routes.faq} className="hover:text-ink">
              FAQ
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
      <p className="text-sm font-medium text-ink">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-charcoal/70 hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
