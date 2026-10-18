import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { syncJobs } from "@/lib/jobs/sync";
import { UsajobsSourceAdapter } from "@/lib/usajobs/adapter";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for ingestion runs

function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/i);

  if (!match) {
    logger.warn("[CronSync] Missing or malformed Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providedToken = match[1] ?? "";
  const expectedToken = env.CRON_SECRET ?? "";

  if (!providedToken || !constantTimeCompare(providedToken, expectedToken)) {
    logger.warn("[CronSync] Invalid cron secret provided");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adapter = new UsajobsSourceAdapter();
    const result = await syncJobs(adapter, {
      maxPages: 2, // Ingest up to 2 pages (200 jobs) per cron cycle by default
      resultsPerPage: 100,
    });

    if (result.status === "failed") {
      return NextResponse.json({ success: false, ...result }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("[CronSync] Unhandled error during sync execution", {}, err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
