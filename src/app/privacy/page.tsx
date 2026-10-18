import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy, cookie disclosures, data protection practices, and advertising disclosures for FedJobs Radar.",
};

export default function PrivacyPage() {
  const params = {
    siteName: siteConfig.name,
    siteUrl: siteConfig.url,
    contactEmail: siteConfig.contactEmail,
  };

  return (
    <div className="py-12 sm:py-16">
      {/* draft — legal review pending */}
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {t("privacy.category")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("privacy.title")}
          </h1>
          <p className="mt-2 text-xs font-medium text-neutral-500">{t("privacy.lastUpdated")}</p>

          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            {t("privacy.intro", params)}
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("privacy.section1Title")}
            </h2>
            <p>{t("privacy.section1Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("privacy.section2Title")}
            </h2>
            <p>{t("privacy.section2Body", params)}</p>

            {/* AdSense Mandatory Cookie & Third Party Disclosure Card */}
            <Card className="border-l-4 border-l-teal-800 bg-neutral-50">
              <h2 className="text-lg font-bold text-neutral-900">{t("privacy.section3Title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                {t("privacy.section3Body", params)}
              </p>
            </Card>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("privacy.section4Title")}
            </h2>
            <p>{t("privacy.section4Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("privacy.section5Title")}
            </h2>
            <p>{t("privacy.section5Body", params)}</p>

            <h2 className="pt-2 text-xl font-bold tracking-tight text-neutral-900">
              {t("privacy.section6Title")}
            </h2>
            <p>{t("privacy.section6Body", params)}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
