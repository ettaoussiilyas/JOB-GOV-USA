import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About Our Project",
  description:
    "Learn about the mission behind FedJobs Radar and why we are making federal hiring accessible.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {t("about.category")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("about.title")}
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            <p>{t("about.intro1")}</p>
            <p>{t("about.intro2")}</p>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-neutral-900">
              {t("about.missionHeading")}
            </h2>
            <p>{t("about.missionBody", { siteName: siteConfig.name })}</p>

            <div className="my-8">
              <Card>
                <h3 className="font-semibold text-neutral-900">{t("about.commitmentsHeading")}</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-neutral-600 list-disc list-inside">
                  <li>
                    <strong className="text-neutral-800">{t("about.commitment1Title")}:</strong>{" "}
                    {t("about.commitment1Desc")}
                  </li>
                  <li>
                    <strong className="text-neutral-800">{t("about.commitment2Title")}:</strong>{" "}
                    {t("about.commitment2Desc")}
                  </li>
                  <li>
                    <strong className="text-neutral-800">{t("about.commitment3Title")}:</strong>{" "}
                    {t("about.commitment3Desc")}
                  </li>
                  <li>
                    <strong className="text-neutral-800">{t("about.commitment4Title")}:</strong>{" "}
                    {t("about.commitment4Desc")}
                  </li>
                </ul>
              </Card>
            </div>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              {t("about.independentHeading")}
            </h2>
            <p>{t("about.independentBody")}</p>

            <div className="pt-6">
              <Link
                href="/disclaimer"
                className="text-sm font-semibold text-teal-800 hover:text-teal-700 underline"
              >
                {t("about.disclaimerLink")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
