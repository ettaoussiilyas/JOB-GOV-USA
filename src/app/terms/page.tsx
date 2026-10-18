import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service, user agreements, intellectual property disclosures, and acceptable use policies for FedJobs Radar.",
};

export default function TermsPage() {
  const params = {
    siteName: siteConfig.name,
    siteUrl: siteConfig.url,
  };

  return (
    <div className="py-12 sm:py-16">
      {/* draft — legal review pending */}
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {t("terms.category")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("terms.title")}
          </h1>
          <p className="mt-2 text-xs font-medium text-neutral-500">{t("terms.lastUpdated")}</p>

          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            {t("terms.intro", params)}
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("terms.section1Title")}
            </h2>
            <p>{t("terms.section1Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("terms.section2Title")}
            </h2>
            <p>{t("terms.section2Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("terms.section3Title")}
            </h2>
            <p>{t("terms.section3Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("terms.section4Title")}
            </h2>
            <p>{t("terms.section4Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("terms.section5Title")}
            </h2>
            <p>{t("terms.section5Body", params)}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
