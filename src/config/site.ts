export const siteConfig = {
  name: "FedJobs Radar",
  shortName: "FedJobs",
  description:
    "A clean, fast radar of US federal jobs for newcomers and students, with plain-English eligibility explanations and daily alerts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  disclaimer:
    "Not affiliated with or endorsed by USAJOBS or any US government agency. Information may be incomplete or outdated. Always verify details and apply on the official USAJOBS posting.",
  attribution: "Data from official USAJOBS API.",
  nav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Disclaimer", href: "/disclaimer" },
  ],
  footerLinks: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Disclaimer", href: "/disclaimer" },
  ],
};
