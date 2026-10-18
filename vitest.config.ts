import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["node_modules", ".next"],
    env: {
      NODE_ENV: "test",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://rujjqtgvqgmbcpoujflj.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "mock-anon-key-for-unit-tests",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key-for-unit-tests",
      CRON_SECRET: "mock-cron-secret-32-chars-long-unit-tests",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
