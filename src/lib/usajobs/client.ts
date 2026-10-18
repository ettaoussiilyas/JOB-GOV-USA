import { UsajobsSearchResponseSchema, type UsajobsSearchResponse } from "./schema";
import { logger } from "@/lib/logger";

export interface UsajobsClientConfig {
  apiKey?: string;
  userAgentEmail?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export class UsajobsClient {
  private readonly apiKey: string;
  private readonly userAgentEmail: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config?: UsajobsClientConfig) {
    this.apiKey = config?.apiKey || process.env.USAJOBS_API_KEY || "";
    this.userAgentEmail = config?.userAgentEmail || process.env.USAJOBS_USER_AGENT_EMAIL || "";
    this.baseUrl = config?.baseUrl || "https://data.usajobs.gov";
    this.timeoutMs = config?.timeoutMs || 10000;
  }

  async searchJobs(
    params: { page?: number; resultsPerPage?: number; keyword?: string } = {},
  ): Promise<UsajobsSearchResponse> {
    if (!this.apiKey || !this.userAgentEmail) {
      throw new Error(
        "[UsajobsClient] Missing required credentials. Please configure USAJOBS_API_KEY and USAJOBS_USER_AGENT_EMAIL in environment.",
      );
    }

    const page = params.page || 1;
    const resultsPerPage = Math.min(params.resultsPerPage || 100, 500);

    const url = new URL("/api/Search", this.baseUrl);
    url.searchParams.set("Page", String(page));
    url.searchParams.set("ResultsPerPage", String(resultsPerPage));
    if (params.keyword) {
      url.searchParams.set("Keyword", params.keyword);
    }

    const headers = {
      Host: "data.usajobs.gov",
      "User-Agent": this.userAgentEmail,
      "Authorization-Key": this.apiKey,
      Accept: "application/json",
    };

    return this.fetchWithRetry(url.toString(), headers);
  }

  private async fetchWithRetry(
    url: string,
    headers: Record<string, string>,
    retries = 3,
    backoffMs = 1000,
  ): Promise<UsajobsSearchResponse> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (response.status === 429) {
          logger.warn(`[UsajobsClient] Rate limited (429) on attempt ${attempt}`);
          if (attempt === retries) {
            throw new Error("[UsajobsClient] Rate limit exceeded after retries.");
          }
          const jitter = Math.floor(Math.random() * 500);
          await new Promise((r) => setTimeout(r, backoffMs * attempt + jitter));
          continue;
        }

        if (!response.ok) {
          throw new Error(
            `[UsajobsClient] HTTP error status: ${response.status} ${response.statusText}`,
          );
        }

        const rawJson = await response.json();
        const parsed = UsajobsSearchResponseSchema.safeParse(rawJson);

        if (!parsed.success) {
          logger.error("[UsajobsClient] Schema validation failed for API response", {
            issues: parsed.error.issues,
          });
          throw new Error(`[UsajobsClient] Response shape invalid: ${parsed.error.message}`);
        }

        return parsed.data;
      } catch (err: unknown) {
        clearTimeout(timer);
        const isLastAttempt = attempt === retries;

        if (isLastAttempt) {
          logger.error(`[UsajobsClient] Request failed on final attempt ${attempt}`, {}, err);
          throw err;
        }

        const jitter = Math.floor(Math.random() * 300);
        const delay = backoffMs * Math.pow(2, attempt - 1) + jitter;
        logger.warn(
          `[UsajobsClient] Request failed on attempt ${attempt}, retrying in ${delay}ms...`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    throw new Error("[UsajobsClient] Max retries exhausted");
  }
}
