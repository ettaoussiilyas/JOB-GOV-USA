import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";
import { siteConfig } from "@/config/site";

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
            About FedJobs Radar
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Demystifying US federal employment.
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-600">
            <p>
              The United States federal government is one of the largest and most stable employers
              in the world, offering thousands of career opportunities across hundreds of agencies.
              However, for college students, recent graduates, and first-time applicants, the
              official hiring process can feel overwhelming.
            </p>

            <p>
              Navigating General Schedule (GS) grades, occupational series codes, specialized
              experience criteria, and restrictive hiring paths often discourages talented
              candidates from applying.
            </p>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-neutral-900">
              Our Core Mission
            </h2>
            <p>
              {siteConfig.name} was created to bridge this information gap. Our goal is not to
              replace USAJOBS, but to act as a clear, high-speed radar that translates complex
              government announcements into plain English before you apply.
            </p>

            <div className="my-8">
              <Card>
                <h3 className="font-semibold text-neutral-900">Our Commitments to Job Seekers</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-neutral-600 list-disc list-inside">
                  <li>
                    <strong className="text-neutral-800">100% Free Access:</strong> We never charge
                    job seekers for access to public government listings.
                  </li>
                  <li>
                    <strong className="text-neutral-800">Deterministic Clarity:</strong> Eligibility
                    and pay information are derived strictly from official structured data fields.
                  </li>
                  <li>
                    <strong className="text-neutral-800">Privacy-First Alerts:</strong> No accounts
                    or passwords required. Double opt-in email digests with one-click unsubscribe
                    links.
                  </li>
                  <li>
                    <strong className="text-neutral-800">Official Attribution:</strong> Every job
                    listing links directly to USAJOBS.gov for official applications.
                  </li>
                </ul>
              </Card>
            </div>

            <h2 className="pt-2 text-2xl font-bold tracking-tight text-neutral-900">
              Independent Platform
            </h2>
            <p>
              We are an independent technology project. We do not represent, partner with, or
              receive funding from the United States government or any federal agency.
            </p>

            <div className="pt-6">
              <Link
                href="/disclaimer"
                className="text-sm font-semibold text-teal-800 hover:text-teal-700 underline"
              >
                Read our full legal disclaimer and data source notices →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
