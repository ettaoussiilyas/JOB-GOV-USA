import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the server-only DB client before importing route
vi.mock("@/lib/db/server", () => ({
  getServiceClient: vi.fn(),
}));

import { getServiceClient } from "@/lib/db/server";
import { GET, checkDatabaseHealth } from "@/app/api/health/route";

describe("Health Route & DB Check Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports healthy when the database query succeeds", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({ data: [{ key: "phase" }], error: null }),
    });
    vi.mocked(getServiceClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as ReturnType<typeof getServiceClient>);

    const isHealthy = await checkDatabaseHealth(1000);
    expect(isHealthy).toBe(true);

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.db).toBe("ok");
    expect(body.lastSync).toBeNull();
    expect(body.time).toBeDefined();
  });

  it("reports 503 error when database returns an error object without leaking internals", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        data: null,
        error: {
          message:
            "connection to server at postgres.internal failed: password authentication failed",
        },
      }),
    });
    vi.mocked(getServiceClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as ReturnType<typeof getServiceClient>);

    const isHealthy = await checkDatabaseHealth(1000);
    expect(isHealthy).toBe(false);

    const response = await GET();
    expect(response.status).toBe(503);

    const body = await response.json();
    expect(body.status).toBe("error");
    expect(body.db).toBe("error");
    // Ensure no internal DB error message was leaked to JSON response
    expect(JSON.stringify(body)).not.toContain("password authentication failed");
  });

  it("reports 503 error when database check times out", async () => {
    const hangingPromise = new Promise(() => {}); // never resolves
    const mockSelect = vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnValue(hangingPromise),
    });
    vi.mocked(getServiceClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: mockSelect }),
    } as unknown as ReturnType<typeof getServiceClient>);

    const isHealthy = await checkDatabaseHealth(50); // fast timeout for test
    expect(isHealthy).toBe(false);
  });
});
