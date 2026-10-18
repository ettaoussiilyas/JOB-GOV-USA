import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Get in touch with the FedJobs Radar team for support, general inquiries, feedback, or data correction requests.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {t("contact.category")}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{t("contact.subtitle")}</p>

          <div className="mt-8 space-y-6">
            <Card className="border-teal-200 bg-white">
              <h2 className="text-lg font-bold text-neutral-900">
                {t("contact.directEmailTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("contact.directEmailBody")}
              </p>
              <div className="mt-4 inline-block rounded-md bg-teal-50 px-4 py-2 font-mono text-sm font-semibold text-teal-900 border border-teal-200">
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline">
                  {siteConfig.contactEmail}
                </a>
              </div>
              <p className="mt-4 text-xs text-neutral-500">{t("contact.responseTimeline")}</p>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200">
              <h2 className="text-lg font-bold text-neutral-900">
                {t("contact.correctionsTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {t("contact.correctionsBody")}
              </p>
            </Card>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
              <p className="font-semibold text-amber-950">{t("contact.affiliationReminder")}</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
