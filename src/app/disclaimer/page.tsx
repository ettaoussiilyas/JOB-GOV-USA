import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Disclaimer & Legal Notices",
  description:
    "Official legal disclaimer, non-affiliation notice, and data source information for FedJobs Radar.",
};

export default function DisclaimerPage() {
  return (
    <div className="py-12 sm:py-16">
      {/* draft — legal review pending */}
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {t("disclaimer.category")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("disclaimer.title")}
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            {/* Primary Required Disclaimer Block */}
            <Card className="border-l-4 border-l-teal-800 bg-neutral-50">
              <h2 className="text-lg font-bold text-neutral-900">
                {t("disclaimer.affiliationHeading")}
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-800">
                {siteConfig.disclaimer}
              </p>
            </Card>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-neutral-900">
              {t("disclaimer.dataSourceHeading")}
            </h2>
            <p>{t("disclaimer.dataSourceBody")}</p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              {t("disclaimer.applicationsHeading")}
            </h2>
            <p>{t("disclaimer.applicationsBody", { siteName: siteConfig.name })}</p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              {t("disclaimer.guaranteesHeading")}
            </h2>
            <p>{t("disclaimer.guaranteesBody")}</p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              {t("disclaimer.brandingHeading")}
            </h2>
            <p>{t("disclaimer.brandingBody")}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
