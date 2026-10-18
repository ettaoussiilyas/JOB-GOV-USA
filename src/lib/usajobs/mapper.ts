import crypto from "crypto";
import type { NormalizedJob, JobLocation } from "@/lib/jobs/types";
import type { UsajobsSearchResultItem } from "@/lib/usajobs/schema";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function computeContentHash(data: unknown): string {
  const json = JSON.stringify(data);
  return crypto.createHash("sha256").update(json).digest("hex");
}

export function normalizeHiringPaths(paths?: string[]): string[] {
  if (!paths || paths.length === 0) return ["public"];

  const pathMap: Record<string, string> = {
    public: "public",
    vet: "veterans",
    student: "students",
    grad: "recent_graduates",
    disability: "individuals_with_disabilities",
    mspouse: "military_spouses",
    native: "native_americans",
    peace: "peace_corps",
    "fed-excepted": "federal_excepted",
    "fed-competitive": "federal_competitive",
    "senior-exec": "senior_executives",
  };

  const normalized = new Set<string>();
  for (const p of paths) {
    const key = p.toLowerCase().trim();
    if (pathMap[key]) {
      normalized.add(pathMap[key]!);
    } else {
      normalized.add(key.replace(/[^a-z0-9_]/g, "_"));
    }
  }

  return Array.from(normalized);
}

export function normalizePayInterval(code?: string): string | null {
  if (!code) return null;
  const lower = code.toLowerCase().trim();
  if (lower.includes("year") || lower === "pa") return "per_year";
  if (lower.includes("hour") || lower === "ph") return "per_hour";
  if (lower.includes("biweek") || lower === "bw") return "per_biweekly";
  if (lower.includes("month") || lower === "pm") return "per_month";
  return lower.replace(/[^a-z0-9_]/g, "_");
}

export function mapUsajobsToNormalized(item: UsajobsSearchResultItem): NormalizedJob {
  const d = item.MatchedObjectDescriptor;
  const sourceId = d.PositionID || item.MatchedObjectId;
  const rawTitle = d.PositionTitle || "Untitled Position";

  // Stable slug: slugify(title) + '-' + short source_id (first 8 chars)
  const shortId = sourceId.slice(-8);
  const baseSlug = slugify(rawTitle);
  const slug = `${baseSlug}-${shortId}`;

  // Locations & State extraction
  const locations: JobLocation[] = (d.PositionLocation || []).map((loc) => ({
    city: loc.LocationName,
    country: loc.CountryCode,
    countrySubdivisionCode: loc.CountrySubdivisionCode,
    longitude: loc.Longitude,
    latitude: loc.Latitude,
  }));

  const stateCodes = Array.from(
    new Set(
      locations
        .map((l) => l.countrySubdivisionCode?.toUpperCase().trim())
        .filter((code): code is string => !!code && code.length === 2),
    ),
  );

  // Pay mapping
  const remuneration = d.PositionRemuneration?.[0];
  const payMin =
    remuneration?.MinimumRange !== undefined ? Number(remuneration.MinimumRange) : null;
  const payMax =
    remuneration?.MaximumRange !== undefined ? Number(remuneration.MaximumRange) : null;
  const payInterval = normalizePayInterval(remuneration?.RateIntervalCode);

  // UserArea details
  const details = d.UserArea?.Details;
  const telework = details?.TeleworkEligible === true || details?.TeleworkEligible === "true";
  const gradeLow = details?.LowGrade !== undefined ? Number(details.LowGrade) : null;
  const gradeHigh = details?.HighGrade !== undefined ? Number(details.HighGrade) : null;

  // Hiring paths
  const hiringPaths = normalizeHiringPaths(details?.HiringPath);

  // Clean URLs
  const applyUrl = d.ApplyURI?.[0] || d.PositionURI;
  const sourceUrl = d.PositionURI;

  // Plain summary template
  const summaryPlain = details?.JobSummary?.trim() || null;

  const rawHashObject = {
    title: rawTitle,
    agency_name: d.OrganizationName,
    department_name: d.DepartmentName,
    payMin,
    payMax,
    payInterval,
    gradeLow,
    gradeHigh,
    telework,
    locations: d.PositionLocation,
    closesAt: d.PositionEndDate,
  };

  const contentHash = computeContentHash(rawHashObject);

  return {
    source: "usajobs",
    source_id: sourceId,
    slug,
    title: rawTitle,
    agency_name: d.OrganizationName || null,
    department_name: d.DepartmentName || null,
    summary_plain: summaryPlain,
    description_raw: item as unknown as Record<string, unknown>,
    locations,
    state_codes: stateCodes,
    remote_or_telework: telework,
    pay_min: Number.isNaN(payMin) ? null : payMin,
    pay_max: Number.isNaN(payMax) ? null : payMax,
    pay_interval: payInterval,
    pay_plan: d.JobGrade?.[0]?.Code || null,
    grade_low: Number.isNaN(gradeLow) ? null : gradeLow,
    grade_high: Number.isNaN(gradeHigh) ? null : gradeHigh,
    series_code: d.JobCategory?.[0]?.Code || null,
    schedule: d.PositionSchedule?.[0]?.Name || null,
    appointment_type: d.PositionOfferingType?.[0]?.Name || null,
    hiring_paths: hiringPaths,
    security_clearance: details?.SecurityClearance || null,
    opens_at: d.PositionStartDate ? new Date(d.PositionStartDate).toISOString() : null,
    closes_at: d.PositionEndDate ? new Date(d.PositionEndDate).toISOString() : null,
    apply_url: applyUrl,
    source_url: sourceUrl,
    status: "open",
    content_hash: contentHash,
  };
}
