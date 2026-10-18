import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  CRON_SECRET: z.string().min(16, "CRON_SECRET must be at least 16 characters"),
  // Email Provider Configuration (Brevo SMTP, Resend, Mock)
  EMAIL_PROVIDER: z.enum(["brevo", "resend", "mock"]).default("brevo"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required").optional(),
  BREVO_SMTP_HOST: z.string().default("smtp-relay.brevo.com"),
  BREVO_SMTP_PORT: z.coerce.number().default(587),
  BREVO_SMTP_USER: z.string().optional(),
  BREVO_SMTP_KEY: z.string().optional(),
  // USAJOBS API Configuration
  USAJOBS_API_KEY: z.string().optional(),
  USAJOBS_USER_AGENT_EMAIL: z.string().optional(),
  USAJOBS_BASE_URL: z.string().url().default("https://data.usajobs.gov"),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
  NEXT_PUBLIC_SITE_NAME: z.string().optional(),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type AppEnv = ServerEnv & PublicEnv;

export function validateEnv(runtimeEnv: Record<string, unknown> = process.env): AppEnv {
  const isServer = typeof window === "undefined";

  const publicResult = publicEnvSchema.safeParse(runtimeEnv);
  if (!publicResult.success) {
    const issues = publicResult.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `[Env Validation Error] Invalid public environment variables:\n${issues}\n` +
        `Check your .env.local file or refer to .env.example.`,
    );
  }

  if (isServer && runtimeEnv.NODE_ENV !== "test") {
    const serverResult = serverEnvSchema.safeParse(runtimeEnv);
    if (!serverResult.success) {
      const issues = serverResult.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n");
      throw new Error(
        `[Env Validation Error] Invalid server environment variables:\n${issues}\n` +
          `Check your .env.local file or refer to .env.example.`,
      );
    }
    return { ...publicResult.data, ...serverResult.data };
  }

  // In test environment or browser, provide defaults for server keys if not explicitly validated
  return {
    NODE_ENV: (runtimeEnv.NODE_ENV as "development" | "test" | "production") || "test",
    SUPABASE_SERVICE_ROLE_KEY:
      (runtimeEnv.SUPABASE_SERVICE_ROLE_KEY as string) || "mock-service-role-key",
    CRON_SECRET: (runtimeEnv.CRON_SECRET as string) || "mock-cron-secret-32-chars-long",
    EMAIL_PROVIDER: (runtimeEnv.EMAIL_PROVIDER as "brevo" | "resend" | "mock") || "mock",
    EMAIL_FROM: (runtimeEnv.EMAIL_FROM as string) || "System Alerts <alerts@example.com>",
    BREVO_SMTP_HOST: (runtimeEnv.BREVO_SMTP_HOST as string) || "smtp-relay.brevo.com",
    BREVO_SMTP_PORT: Number(runtimeEnv.BREVO_SMTP_PORT || 587),
    BREVO_SMTP_USER: (runtimeEnv.BREVO_SMTP_USER as string) || "mock-smtp-user",
    BREVO_SMTP_KEY: (runtimeEnv.BREVO_SMTP_KEY as string) || "mock-smtp-key",
    USAJOBS_API_KEY: (runtimeEnv.USAJOBS_API_KEY as string) || "mock-api-key",
    USAJOBS_USER_AGENT_EMAIL: (runtimeEnv.USAJOBS_USER_AGENT_EMAIL as string) || "test@example.com",
    USAJOBS_BASE_URL: (runtimeEnv.USAJOBS_BASE_URL as string) || "https://data.usajobs.gov",
    ...publicResult.data,
  };
}

export const env: AppEnv = validateEnv(process.env);
