import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/db/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HealthResponse {
  status: "ok" | "error";
  time: string;
  db: "ok" | "error";
  lastSync: null;
}

export async function checkDatabaseHealth(timeoutMs = 3000): Promise<boolean> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Database health check timed out")), timeoutMs),
  );

  try {
    const supabase = getServiceClient();
    // Query the app_meta table initialized in Phase 0
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

export async function GET() {
  const isDbHealthy = await checkDatabaseHealth();
  const time = new Date().toISOString();

  const responseBody: HealthResponse = {
    status: isDbHealthy ? "ok" : "error",
    time,
    db: isDbHealthy ? "ok" : "error",
    lastSync: null,
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
