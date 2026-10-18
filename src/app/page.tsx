import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import Link from "next/link";

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
              <Badge variant="accent">Phase 0 — Platform Foundation</Badge>
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            >
              Federal jobs, explained in plain English.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600 sm:text-xl">
              A clean, fast radar designed for students and newcomers navigating US federal hiring.
              We cut through government acronyms to show who is eligible, what the job pays, and how
              to apply.
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
                  <p className="font-semibold text-sm">Under Construction</p>
                  <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                    The platform core and staging database are currently active. Live job listings,
                    ingestion from the official USAJOBS API, and email digest alerts will launch in
                    upcoming phases.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                Learn About Our Mission
              </Link>
              <Link
                href="/disclaimer"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
              >
                Read Official Disclaimer
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
              How It Will Work
            </h2>
            <p className="mt-3 text-neutral-600">
              Federal hiring does not have to be intimidating. Here is how our radar will simplify
              your search.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                1. Spot New Postings Fast
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Daily synchronized radar tracking newly published positions across all federal
                agencies, highlighting early deadlines before postings close.
              </p>
            </Card>

            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                2. Understand Eligibility
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Deterministic plain-English explanations of hiring paths (Students, Recent Grads,
                Public) paired with transparent pay scale ranges and locality factors.
              </p>
            </Card>

            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800 font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                3. Get Targeted Alerts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Set up saved searches tailored to your grade level, series code, and location.
                Receive clean email digests without spam or passwords.
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
              What You Will Get
            </h2>
            <p className="mt-3 text-neutral-600">
              Built on official public data from USAJOBS, enhanced with original context and
              guidance.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">Fresh Jobs & Alerts</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Synchronized every day via official APIs with clear countdowns for closing
                deadlines.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">Plain-English Eligibility</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Instant answers to "Can I apply?" derived from structured data and official
                criteria.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">Step-by-Step Guides</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Sourced guides on building federal resumes, understanding GS pay, and Pathways
                programs.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-5">
              <h3 className="font-semibold text-neutral-900">Transparent Salary Context</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Clear pay scales, grade bands, and locality adjustments without guesswork.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
