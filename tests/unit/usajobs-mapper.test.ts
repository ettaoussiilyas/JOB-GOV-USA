import { describe, it, expect } from "vitest";
import {
  mapUsajobsToNormalized,
  slugify,
  computeContentHash,
  normalizeHiringPaths,
  normalizePayInterval,
} from "@/lib/usajobs/mapper";
import { UsajobsSearchResultItemSchema } from "@/lib/usajobs/schema";

const mockItem = {
  MatchedObjectId: "789123400",
  MatchedObjectDescriptor: {
    PositionID: "DHA-24-1234",
    PositionTitle: "IT Specialist (Security / INFOSEC)",
    PositionURI: "https://www.usajobs.gov/job/789123400",
    ApplyURI: ["https://www.usajobs.gov/job/789123400?apply=true"],
    PositionLocation: [
      {
        LocationName: "Washington, District of Columbia",
        CountryCode: "United States",
        CountrySubdivisionCode: "DC",
        Longitude: -77.0369,
        Latitude: 38.9072,
      },
      {
        LocationName: "Baltimore, Maryland",
        CountryCode: "United States",
        CountrySubdivisionCode: "MD",
        Longitude: -76.6122,
        Latitude: 39.2904,
      },
    ],
    OrganizationName: "Department of the Navy",
    DepartmentName: "Department of Defense",
    JobCategory: [{ Code: "2210", Name: "Information Technology Management" }],
    JobGrade: [{ Code: "GS" }],
    PositionSchedule: [{ Code: "1", Name: "Full-Time" }],
    PositionOfferingType: [{ Code: "15317", Name: "Permanent" }],
    PositionRemuneration: [
      {
        MinimumRange: 82830,
        MaximumRange: 128043,
        RateIntervalCode: "Per Year",
      },
    ],
    PositionStartDate: "2026-10-01T00:00:00Z",
    PositionEndDate: "2026-11-15T23:59:59Z",
    UserArea: {
      Details: {
        JobSummary:
          "Serve as an Information Security Specialist advising leadership on cybersecurity architectures and zero-trust controls.",
        WhoMayApply: { Name: "Open to the public, U.S. citizens" },
        HiringPath: ["public", "vet", "student"],
        TeleworkEligible: true,
        SecurityClearance: "Top Secret / SCI",
        LowGrade: "11",
        HighGrade: "13",
      },
    },
  },
};

describe("USAJOBS Ingestion & Mapper", () => {
  it("validates raw API response against Zod schema", () => {
    const parsed = UsajobsSearchResultItemSchema.safeParse(mockItem);
    expect(parsed.success).toBe(true);
  });

  it("slugifies titles cleanly", () => {
    expect(slugify("IT Specialist (Security / INFOSEC) - GS-12")).toBe(
      "it-specialist-security-infosec-gs-12",
    );
  });

  it("normalizes hiring paths into clean enums", () => {
    const paths = normalizeHiringPaths(["public", "vet", "student", "grad"]);
    expect(paths).toContain("public");
    expect(paths).toContain("veterans");
    expect(paths).toContain("students");
    expect(paths).toContain("recent_graduates");
  });

  it("normalizes pay intervals correctly", () => {
    expect(normalizePayInterval("Per Year")).toBe("per_year");
    expect(normalizePayInterval("PA")).toBe("per_year");
    expect(normalizePayInterval("Per Hour")).toBe("per_hour");
    expect(normalizePayInterval("PH")).toBe("per_hour");
  });

  it("maps USAJOBS item to NormalizedJob schema", () => {
    const normalized = mapUsajobsToNormalized(mockItem);

    expect(normalized.source).toBe("usajobs");
    expect(normalized.source_id).toBe("DHA-24-1234");
    expect(normalized.slug).toContain("it-specialist-security-infosec");
    expect(normalized.title).toBe("IT Specialist (Security / INFOSEC)");
    expect(normalized.agency_name).toBe("Department of the Navy");
    expect(normalized.department_name).toBe("Department of Defense");
    expect(normalized.pay_min).toBe(82830);
    expect(normalized.pay_max).toBe(128043);
    expect(normalized.pay_interval).toBe("per_year");
    expect(normalized.pay_plan).toBe("GS");
    expect(normalized.grade_low).toBe(11);
    expect(normalized.grade_high).toBe(13);
    expect(normalized.series_code).toBe("2210");
    expect(normalized.remote_or_telework).toBe(true);
    expect(normalized.state_codes).toEqual(["DC", "MD"]);
    expect(normalized.status).toBe("open");
    expect(normalized.content_hash).toBeDefined();
    expect(normalized.content_hash.length).toBe(64); // SHA-256 hex
  });

  it("produces deterministic content_hash for unchanged data", () => {
    const hash1 = computeContentHash({ title: "Test Job", pay: 100000 });
    const hash2 = computeContentHash({ title: "Test Job", pay: 100000 });
    const hash3 = computeContentHash({ title: "Test Job", pay: 105000 });

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });
});
