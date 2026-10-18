import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { siteConfig } from "@/config/site";

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
            Legal & Compliance
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Disclaimer & Terms Notice
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            {/* Primary Required Disclaimer Block */}
            <Card className="border-l-4 border-l-teal-800 bg-neutral-50">
              <h2 className="text-lg font-bold text-neutral-900">Non-Affiliation Notice</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-neutral-800">
                {siteConfig.disclaimer}
              </p>
            </Card>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-neutral-900">
              Data Source & Ingestion
            </h2>
            <p>
              Information displayed on this website is obtained through the official, public USAJOBS
              Search API provided by the United States Office of Personnel Management (OPM). While
              we endeavor to keep all postings synchronized and accurate, job announcements,
              qualification criteria, closing dates, and vacancies are subject to change by hiring
              agencies at any moment without prior notice.
            </p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              Application Submission
            </h2>
            <p>
              {siteConfig.name} does not accept, process, or forward job applications. All job
              applications must be submitted directly through USAJOBS.gov or the official designated
              hiring portal of the respective agency.
            </p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              No Guarantees or Endorsements
            </h2>
            <p>
              We do not guarantee employment, interview selection, or eligibility determination. Any
              plain-English summaries, salary estimates, or eligibility guidelines provided on this
              site are for informational and educational purposes only. Candidates are solely
              responsible for reviewing the official vacancy announcement before submitting an
              application.
            </p>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              No Government Branding
            </h2>
            <p>
              This website does not display the Great Seal of the United States, official agency
              crests, or governmental insignia. Any mention of government departments, agencies, or
              pay scales is purely for identification and descriptive purposes.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
