import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HealthResponse {
  status: "ok" | "error";
  time: string;
  db: "ok" | "error";
  lastSync: string | null;
}

export async function checkDatabaseHealth(timeoutMs = 3000): Promise<boolean> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Database health check timed out")), timeoutMs),
  );

  try {
    const supabase = getServiceClient();
    const queryPromise = supabase
      .from("app_meta")
      .select("key")
      .limit(1)
      .then(({ error }) => {
        if (error) {
          throw new Error(error.message);
        }
        return true;
      });

    await Promise.race([queryPromise, timeoutPromise]);
    return true;
  } catch (err) {
    logger.warn("Database health check failed", undefined, err);
    return false;
  }
}

export async function getLastSyncTime(): Promise<string | null> {
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("sync_runs")
      .select("finished_at")
      .eq("status", "success")
      .order("finished_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.finished_at || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const isDbHealthy = await checkDatabaseHealth();
  const lastSync = isDbHealthy ? await getLastSyncTime() : null;
  const time = new Date().toISOString();

  const responseBody: HealthResponse = {
    status: isDbHealthy ? "ok" : "error",
    time,
    db: isDbHealthy ? "ok" : "error",
    lastSync,
  };

  const status = isDbHealthy ? 200 : 503;

  return NextResponse.json(responseBody, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
