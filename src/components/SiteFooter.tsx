import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./Container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 py-12 text-sm text-neutral-600">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-bold text-neutral-900">{siteConfig.name}</p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              A clean radar of US federal employment opportunities, built to clarify federal hiring,
              salary scales, and eligibility requirements in plain English.
            </p>
            <p className="mt-4 text-xs font-semibold text-neutral-700">{siteConfig.attribution}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Navigation
            </p>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-teal-900 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Disclaimer
            </p>
            <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-3.5 text-xs leading-relaxed text-neutral-600">
              <p>{siteConfig.disclaimer}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
