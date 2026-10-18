import { getDictionary } from "@/lib/i18n";

const dict = getDictionary();

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || dict.site.name,
  shortName: dict.site.shortName,
  description: dict.site.description,
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@fedjobsradar.com",
  disclaimer: dict.site.disclaimer,
  attribution: dict.site.attribution,
  nav: [
    { title: dict.nav.home, href: "/" },
    { title: dict.nav.about, href: "/about" },
    { title: dict.nav.contact, href: "/contact" },
    { title: dict.nav.disclaimer, href: "/disclaimer" },
  ],
  footerLinks: [
    { title: dict.nav.home, href: "/" },
    { title: dict.nav.about, href: "/about" },
    { title: dict.nav.contact, href: "/contact" },
    { title: dict.nav.privacy, href: "/privacy" },
    { title: dict.nav.terms, href: "/terms" },
    { title: dict.nav.disclaimer, href: "/disclaimer" },
  ],
};
