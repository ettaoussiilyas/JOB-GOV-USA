import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-teal-900 hover:text-teal-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-800 text-white font-black text-sm">
                FR
              </span>
              <span>{siteConfig.name}</span>
            </Link>
          </div>

          <nav aria-label="Main Navigation" className="flex items-center gap-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-600 hover:text-teal-900 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
