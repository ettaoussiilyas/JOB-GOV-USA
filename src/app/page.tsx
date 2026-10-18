import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="border-b border-neutral-200 bg-white py-16 sm:py-24"
        aria-labelledby="hero-heading"
      >
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4">
              <Badge variant="accent">{t("home.hero.phaseBadge")}</Badge>
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            >
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 sm:text-xl">
              {t("home.hero.subtitle")}
            </p>

            {/* Honest Status Notice */}
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-sm">{t("home.hero.statusTitle")}</p>
                  <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {t("home.hero.statusBody")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                {t("home.hero.ctaAbout")}
              </Link>
              <Link
                href="/disclaimer"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
              >
                {t("home.hero.ctaDisclaimer")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* How It Will Work Section */}
      <section className="py-16 sm:py-20" aria-labelledby="how-it-works-heading">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2
              id="how-it-works-heading"
              className="text-3xl font-bold tracking-tight text-neutral-900"
            >
              {t("home.howItWorks.heading")}
            </h2>
            <p className="mt-3 text-neutral-600">{t("home.howItWorks.subtitle")}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                {t("home.howItWorks.step1Title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("home.howItWorks.step1Desc")}
              </p>
            </Card>

            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                {t("home.howItWorks.step2Title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("home.howItWorks.step2Desc")}
              </p>
            </Card>

            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                {t("home.howItWorks.step3Title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("home.howItWorks.step3Desc")}
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* What You'll Get Section */}
      <section
        className="border-t border-neutral-200 bg-white py-16 sm:py-20"
        aria-labelledby="features-heading"
      >
        <Container>
          <div className="max-w-2xl">
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-tight text-neutral-900"
            >
              {t("home.features.heading")}
            </h2>
            <p className="mt-3 text-neutral-600">{t("home.features.subtitle")}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">
                {t("home.features.freshJobsTitle")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {t("home.features.freshJobsDesc")}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">
                {t("home.features.eligibilityTitle")}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {t("home.features.eligibilityDesc")}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">{t("home.features.guidesTitle")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {t("home.features.guidesDesc")}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">{t("home.features.salaryTitle")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                {t("home.features.salaryDesc")}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
