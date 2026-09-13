/**
 * Real, client-provided contact facts. Single source of truth — the
 * Footer, WhatsApp button and /contact/ page all read from here rather
 * than repeating these values.
 */
export const contactInfo = {
  phoneDisplay: "+977 985-127-8641",
  phoneE164: "+9779851278641",
  whatsappUrl: "https://wa.me/9779851278641",
  email: "newbornphotographynepal.studio@gmail.com",
  // The Gmail address above is unrelated to the website domain — its
  // local part just happens to be this name. This must match
  // siteConfig.url (lib/seo/site.ts) exactly — the www subdomain is the
  // official canonical host, not the bare domain.
  domain: "www.newbornphotographynpl.com",
} as const;
