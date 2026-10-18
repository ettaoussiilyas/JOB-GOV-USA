import { describe, it, expect, vi } from "vitest";
import { syncJobs } from "@/lib/jobs/sync";
import type { JobSourceAdapter, NormalizedJob } from "@/lib/jobs/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";

function createMockJob(overrides: Partial<NormalizedJob> = {}): NormalizedJob {
  return {
    source: "usajobs",
    source_id: "JOB-001",
    slug: "it-specialist-001",
    title: "IT Specialist",
    agency_name: "Dept of Commerce",
    department_name: null,
    summary_plain: "Summary",
    description_raw: {},
    locations: [{ city: "Washington", countrySubdivisionCode: "DC" }],
    state_codes: ["DC"],
    remote_or_telework: false,
    pay_min: 75000,
    pay_max: 95000,
    pay_interval: "per_year",
    pay_plan: "GS",
    grade_low: 11,
    grade_high: 12,
    series_code: "2210",
    schedule: "Full-Time",
    appointment_type: "Permanent",
    hiring_paths: ["public"],
    security_clearance: null,
    opens_at: "2026-10-01T00:00:00Z",
    closes_at: "2026-12-01T00:00:00Z",
    apply_url: "https://example.com/apply",
    source_url: "https://example.com/job",
    status: "open",
    content_hash: "initial-hash-1111",
    ...overrides,
  };
}

describe("SyncEngine", () => {
  it("should record success when adapter returns 0 jobs", async () => {
    const mockAdapter: JobSourceAdapter = {
      sourceName: "usajobs",
      fetchJobs: vi.fn().mockResolvedValue([]),
    };

    const mockRunId = "sync-run-uuid-123";
    const updateSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "sync_runs") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: mockRunId },
                  error: null,
                }),
              }),
            }),
            update: updateSpy,
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient<Database>;

    const result = await syncJobs(mockAdapter, {}, mockSupabase);

    expect(result.status).toBe("success");
    expect(result.fetchedCount).toBe(0);
    expect(result.insertedCount).toBe(0);
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        fetched_count: 0,
      }),
    );
  });

  it("should distinguish inserted, updated, and unchanged jobs based on content_hash", async () => {
    const job1New = createMockJob({ source_id: "JOB-NEW", content_hash: "hash-new" });
    const job2Updated = createMockJob({
      source_id: "JOB-EXISTING-DIFF",
      content_hash: "hash-changed",
    });
    const job3Unchanged = createMockJob({ source_id: "JOB-UNCHANGED", content_hash: "hash-same" });

    const mockAdapter: JobSourceAdapter = {
      sourceName: "usajobs",
      fetchJobs: vi.fn().mockResolvedValue([job1New, job2Updated, job3Unchanged]),
    };

    const upsertSpy = vi.fn().mockResolvedValue({ error: null });

    const createChainableUpdate = () => {
      const q: Record<string, unknown> = {};
      q.eq = vi.fn(() => q);
      q.in = vi.fn(() => Promise.resolve({ error: null }));
      q.lt = vi.fn(() => q);
      q.select = vi.fn(() => Promise.resolve({ data: [], error: null }));
      return q;
    };

    const updateJobsSpy = vi.fn(createChainableUpdate);

    const updateSyncRunSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "sync_runs") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "run-uuid-456" },
                  error: null,
                }),
              }),
            }),
            update: updateSyncRunSpy,
          };
        }
        if (table === "jobs") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({
                  data: [
                    {
                      id: "uuid-2",
                      source_id: "JOB-EXISTING-DIFF",
                      content_hash: "hash-old",
                      status: "open",
                    },
                    {
                      id: "uuid-3",
                      source_id: "JOB-UNCHANGED",
                      content_hash: "hash-same",
                      status: "open",
                    },
                  ],
                  error: null,
                }),
              }),
            }),
            upsert: upsertSpy,
            update: updateJobsSpy,
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient<Database>;

    const result = await syncJobs(mockAdapter, {}, mockSupabase);

    expect(result.status).toBe("success");
    expect(result.fetchedCount).toBe(3);
    expect(result.insertedCount).toBe(1); // JOB-NEW
    expect(result.updatedCount).toBe(1); // JOB-EXISTING-DIFF
    expect(upsertSpy).toHaveBeenCalled();
  });

  it("should record failure in sync_runs when adapter fails", async () => {
    const mockAdapter: JobSourceAdapter = {
      sourceName: "usajobs",
      fetchJobs: vi.fn().mockRejectedValue(new Error("USAJOBS API Connection Timeout")),
    };

    const updateSyncRunSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "sync_runs") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "run-fail-789" },
                  error: null,
                }),
              }),
            }),
            update: updateSyncRunSpy,
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient<Database>;

    const result = await syncJobs(mockAdapter, {}, mockSupabase);

    expect(result.status).toBe("failed");
    expect(result.error).toContain("USAJOBS API Connection Timeout");
    expect(updateSyncRunSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "failed",
        error: "USAJOBS API Connection Timeout",
      }),
    );
  });
});
