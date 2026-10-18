import { getServiceClient } from "@/lib/db/server";
import type { JobSourceAdapter, NormalizedJob } from "@/lib/jobs/types";
import { logger } from "@/lib/logger";
import type { Database, Json } from "@/lib/db/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface SyncOptions {
  maxPages?: number;
  resultsPerPage?: number;
  keyword?: string;
  closeExpired?: boolean;
}

export interface SyncResult {
  runId: string;
  source: string;
  status: "success" | "failed";
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  closedCount: number;
  durationMs: number;
  error?: string;
}

export async function syncJobs(
  adapter: JobSourceAdapter,
  options: SyncOptions = {},
  clientOverride?: SupabaseClient<Database>,
): Promise<SyncResult> {
  const startTime = Date.now();
  const supabase = clientOverride || getServiceClient();
  const now = new Date().toISOString();

  // 1. Initialize sync_run record
  const { data: runRecord, error: runError } = await supabase
    .from("sync_runs")
    .insert({
      status: "running",
      started_at: now,
      fetched_count: 0,
      inserted_count: 0,
      updated_count: 0,
      closed_count: 0,
    })
    .select("id")
    .single();

  if (runError || !runRecord) {
    logger.error("[SyncEngine] Failed to create sync_run entry in database", {}, runError);
    throw new Error(`Failed to initialize sync run: ${runError?.message}`);
  }

  const runId = runRecord.id;
  logger.info("[SyncEngine] Started sync run", { runId, source: adapter.sourceName });

  try {
    // 2. Fetch jobs from the adapter
    const maxPages = options.maxPages || 1;
    const resultsPerPage = options.resultsPerPage || 100;
    const allFetchedJobs: NormalizedJob[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const pageJobs = await adapter.fetchJobs({
        page,
        resultsPerPage,
        keyword: options.keyword,
      });

      allFetchedJobs.push(...pageJobs);

      if (pageJobs.length < resultsPerPage) {
        // Last page reached
        break;
      }
    }

    const fetchedCount = allFetchedJobs.length;
    logger.info("[SyncEngine] Fetched jobs from source adapter", {
      runId,
      source: adapter.sourceName,
      fetchedCount,
    });

    if (fetchedCount === 0) {
      await supabase
        .from("sync_runs")
        .update({
          status: "success",
          finished_at: new Date().toISOString(),
          fetched_count: 0,
        })
        .eq("id", runId);

      return {
        runId,
        source: adapter.sourceName,
        status: "success",
        fetchedCount: 0,
        insertedCount: 0,
        updatedCount: 0,
        closedCount: 0,
        durationMs: Date.now() - startTime,
      };
    }

    // 3. Inspect existing jobs in DB to calculate delta
    const sourceIds = allFetchedJobs.map((j) => j.source_id);
    const { data: existingRows, error: fetchExistingError } = await supabase
      .from("jobs")
      .select("id, source_id, content_hash, status")
      .eq("source", adapter.sourceName)
      .in("source_id", sourceIds);

    if (fetchExistingError) {
      throw new Error(`Failed to query existing jobs: ${fetchExistingError.message}`);
    }

    const existingMap = new Map<string, { id: string; content_hash: string; status: string }>();
    for (const row of existingRows || []) {
      existingMap.set(row.source_id, row);
    }

    const toInsert: NormalizedJob[] = [];
    const toUpdate: NormalizedJob[] = [];
    const unchangedIds: string[] = [];

    for (const job of allFetchedJobs) {
      const existing = existingMap.get(job.source_id);
      if (!existing) {
        toInsert.push(job);
      } else if (existing.content_hash !== job.content_hash || existing.status !== "open") {
        toUpdate.push(job);
      } else {
        unchangedIds.push(job.source_id);
      }
    }

    // 4. Batch upsert insertions and updates
    const jobsToUpsert = [...toInsert, ...toUpdate];
    if (jobsToUpsert.length > 0) {
      const upsertRows = jobsToUpsert.map((j) => ({
        source: j.source,
        source_id: j.source_id,
        slug: j.slug,
        title: j.title,
        agency_name: j.agency_name,
        department_name: j.department_name,
        summary_plain: j.summary_plain,
        description_raw: j.description_raw as unknown as Json,
        locations: j.locations as unknown as Json,
        state_codes: j.state_codes,
        remote_or_telework: j.remote_or_telework,
        pay_min: j.pay_min,
        pay_max: j.pay_max,
        pay_interval: j.pay_interval,
        pay_plan: j.pay_plan,
        grade_low: j.grade_low,
        grade_high: j.grade_high,
        series_code: j.series_code,
        schedule: j.schedule,
        appointment_type: j.appointment_type,
        hiring_paths: j.hiring_paths,
        security_clearance: j.security_clearance,
        opens_at: j.opens_at,
        closes_at: j.closes_at,
        apply_url: j.apply_url,
        source_url: j.source_url,
        status: "open",
        content_hash: j.content_hash,
        last_seen_at: now,
      }));

      // Chunk in batches of 100 for network safety
      const chunkSize = 100;
      for (let i = 0; i < upsertRows.length; i += chunkSize) {
        const chunk = upsertRows.slice(i, i + chunkSize);
        const { error: upsertError } = await supabase
          .from("jobs")
          .upsert(chunk, { onConflict: "source,source_id" });

        if (upsertError) {
          throw new Error(`Failed to upsert jobs batch: ${upsertError.message}`);
        }
      }
    }

    // Touch last_seen_at for unchanged jobs in batches
    if (unchangedIds.length > 0) {
      await supabase
        .from("jobs")
        .update({ last_seen_at: now })
        .eq("source", adapter.sourceName)
        .in("source_id", unchangedIds);
    }

    // 5. Mark expired jobs as closed if closes_at has passed
    let closedCount = 0;
    if (options.closeExpired !== false) {
      const { data: closedRows, error: closeError } = await supabase
        .from("jobs")
        .update({
          status: "closed",
          closed_at: now,
        })
        .eq("source", adapter.sourceName)
        .eq("status", "open")
        .lt("closes_at", now)
        .select("id");

      if (!closeError && closedRows) {
        closedCount = closedRows.length;
      }
    }

    // 6. Complete sync run successfully
    const finishedAt = new Date().toISOString();
    await supabase
      .from("sync_runs")
      .update({
        status: "success",
        finished_at: finishedAt,
        fetched_count: fetchedCount,
        inserted_count: toInsert.length,
        updated_count: toUpdate.length,
        closed_count: closedCount,
      })
      .eq("id", runId);

    const durationMs = Date.now() - startTime;
    logger.info("[SyncEngine] Sync run finished successfully", {
      runId,
      source: adapter.sourceName,
      fetchedCount,
      insertedCount: toInsert.length,
      updatedCount: toUpdate.length,
      closedCount,
      durationMs,
    });

    return {
      runId,
      source: adapter.sourceName,
      status: "success",
      fetchedCount,
      insertedCount: toInsert.length,
      updatedCount: toUpdate.length,
      closedCount,
      durationMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("[SyncEngine] Sync run failed", { runId, source: adapter.sourceName }, err);

    await supabase
      .from("sync_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error: errorMsg,
      })
      .eq("id", runId);

    return {
      runId,
      source: adapter.sourceName,
      status: "failed",
      fetchedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      closedCount: 0,
      durationMs: Date.now() - startTime,
      error: errorMsg,
    };
  }
}
