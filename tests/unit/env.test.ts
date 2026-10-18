import { describe, it, expect } from "vitest";
import { validateEnv } from "@/lib/env";

describe("Environment Variable Validation", () => {
  const validBaseEnv = {
    NODE_ENV: "test",
    NEXT_PUBLIC_SITE_URL: "https://fedjobsradar.com",
    NEXT_PUBLIC_SUPABASE_URL: "https://xyz.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "valid-anon-key-string",
    SUPABASE_SERVICE_ROLE_KEY: "valid-service-role-key-string",
    CRON_SECRET: "valid-cron-secret-that-is-long-enough-1234",
  };

  it("successfully parses valid environment variables", () => {
    const parsed = validateEnv(validBaseEnv);
    expect(parsed.NEXT_PUBLIC_SITE_URL).toBe("https://fedjobsradar.com");
    expect(parsed.NEXT_PUBLIC_SUPABASE_URL).toBe("https://xyz.supabase.co");
    expect(parsed.SUPABASE_SERVICE_ROLE_KEY).toBe("valid-service-role-key-string");
  });

  it("throws actionable error when public URL is invalid", () => {
    const invalid = { ...validBaseEnv, NEXT_PUBLIC_SITE_URL: "not-a-valid-url" };
    expect(() => validateEnv(invalid)).toThrowError(/NEXT_PUBLIC_SITE_URL/);
  });

  it("throws actionable error when Supabase URL is missing", () => {
    const invalid = { ...validBaseEnv, NEXT_PUBLIC_SUPABASE_URL: undefined };
    expect(() => validateEnv(invalid)).toThrowError(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("throws actionable error when anon key is missing", () => {
    const invalid = { ...validBaseEnv, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" };
    expect(() => validateEnv(invalid)).toThrowError(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });

  it("enforces minimum length on CRON_SECRET for production/dev", () => {
    const shortSecret = {
      ...validBaseEnv,
      NODE_ENV: "development",
      CRON_SECRET: "short",
    };
    expect(() => validateEnv(shortSecret)).toThrowError(
      /CRON_SECRET must be at least 16 characters/,
    );
  });
});
