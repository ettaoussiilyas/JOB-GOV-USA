import type { JobSourceAdapter, NormalizedJob, FetchJobsParams } from "@/lib/jobs/types";
import { UsajobsClient } from "./client";
import { mapUsajobsToNormalized } from "./mapper";

export class UsajobsSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "usajobs";
  private client: UsajobsClient;

  constructor(client?: UsajobsClient) {
    this.client = client || new UsajobsClient();
  }

  async fetchJobs(params?: FetchJobsParams): Promise<NormalizedJob[]> {
    const response = await this.client.searchJobs({
      page: params?.page || 1,
      resultsPerPage: params?.resultsPerPage || 100,
      keyword: params?.keyword,
    });

    return response.SearchResult.SearchResultItems.map(mapUsajobsToNormalized);
  }
}
