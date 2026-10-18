export type JobStatus = "open" | "closed" | "withdrawn";

export interface JobLocation {
  city?: string;
  state?: string;
  country?: string;
  countrySubdivisionCode?: string;
  longitude?: number;
  latitude?: number;
}

export interface NormalizedJob {
  source: string;
  source_id: string;
  slug: string;
  title: string;
  agency_name: string | null;
  department_name: string | null;
  summary_plain: string | null;
  description_raw: Record<string, unknown>;
  locations: JobLocation[];
  state_codes: string[];
  remote_or_telework: boolean;
  pay_min: number | null;
  pay_max: number | null;
  pay_interval: string | null;
  pay_plan: string | null;
  grade_low: number | null;
  grade_high: number | null;
  series_code: string | null;
  schedule: string | null;
  appointment_type: string | null;
  hiring_paths: string[];
  security_clearance: string | null;
  opens_at: string | null;
  closes_at: string | null;
  apply_url: string;
  source_url: string | null;
  status: JobStatus;
  content_hash: string;
}

export interface FetchJobsParams {
  page?: number;
  resultsPerPage?: number;
  keyword?: string;
}

export interface JobSourceAdapter {
  readonly sourceName: string;
  fetchJobs(params?: FetchJobsParams): Promise<NormalizedJob[]>;
}
