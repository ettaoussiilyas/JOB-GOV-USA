# USAJOBS Search API — Verified Field Map (Phase 1)

This document records the verified endpoint structure, authentication headers, pagination rules, and data mapping from the official USAJOBS Search API to the internal `jobs` database schema.

---

## 1. Verified API Endpoints

- **Base URL**: `https://data.usajobs.gov`
- **Search Jobs**: `GET /api/Search`
- **Historic JOAs**: `GET /api/HistoricJoa`
- **Announcement Text**: `GET /api/HistoricJoa/AnnouncementText`

---

## 2. Required Authentication Headers

Every request to `https://data.usajobs.gov/api/Search` must include:

```http
Host: data.usajobs.gov
User-Agent: <registered-account-email>
Authorization-Key: <registered-api-key>
Accept: application/json
```

---

## 3. Query & Pagination Parameters

| Parameter                   | Type    | Default | Maximum | Description                                       |
| --------------------------- | ------- | ------- | ------- | ------------------------------------------------- |
| `Page`                      | Integer | `1`     | None    | The 1-indexed page of results to retrieve         |
| `ResultsPerPage`            | Integer | `250`   | `500`   | Number of items per page                          |
| `Keyword`                   | String  | None    | None    | General search terms (title, description, agency) |
| `PositionTitle`             | String  | None    | None    | Exact position title query                        |
| `RemunerationMinimumAmount` | Number  | None    | None    | Minimum salary filter                             |

---

## 4. Field Mapping to `jobs` Database Schema

| USAJOBS API Field Path                                   | Database Column      | Type            | Transformation / Normalization Rule                               |
| -------------------------------------------------------- | -------------------- | --------------- | ----------------------------------------------------------------- |
| `MatchedObjectId` / `MatchedObjectDescriptor.PositionID` | `source_id`          | `text`          | Trimmed, stable vacancy announcement ID                           |
| `MatchedObjectDescriptor.PositionTitle`                  | `title`              | `text`          | Cleaned title string                                              |
| Generated                                                | `slug`               | `text`          | `slugify(title) + '-' + short source_id` (deterministic)          |
| `MatchedObjectDescriptor.OrganizationName`               | `agency_name`        | `text`          | Direct string                                                     |
| `MatchedObjectDescriptor.DepartmentName`                 | `department_name`    | `text`          | Direct string                                                     |
| `MatchedObjectDescriptor.UserArea.Details.JobSummary`    | `summary_plain`      | `text`          | Trimmed plain-text summary                                        |
| Full item payload                                        | `description_raw`    | `jsonb`         | Complete raw JSON preserved for compliance audit                  |
| `MatchedObjectDescriptor.PositionLocation`               | `locations`          | `jsonb`         | Array of `{ city, country, countrySubdivisionCode, coordinates }` |
| `PositionLocation[].CountrySubdivisionCode`              | `state_codes`        | `text[]`        | Unique 2-letter uppercase state codes                             |
| `UserArea.Details.TeleworkEligible`                      | `remote_or_telework` | `boolean`       | Cast to boolean                                                   |
| `PositionRemuneration[0].MinimumRange`                   | `pay_min`            | `numeric(12,2)` | Parsed numeric                                                    |
| `PositionRemuneration[0].MaximumRange`                   | `pay_max`            | `numeric(12,2)` | Parsed numeric                                                    |
| `PositionRemuneration[0].RateIntervalCode`               | `pay_interval`       | `text`          | Normalized to `per_year`, `per_hour`, `per_biweekly`, `per_month` |
| `MatchedObjectDescriptor.JobGrade[0].Code`               | `pay_plan`           | `text`          | e.g. `GS`                                                         |
| `UserArea.Details.LowGrade`                              | `grade_low`          | `smallint`      | Parsed integer (e.g. 7)                                           |
| `UserArea.Details.HighGrade`                             | `grade_high`         | `smallint`      | Parsed integer (e.g. 9)                                           |
| `MatchedObjectDescriptor.JobCategory[0].Code`            | `series_code`        | `text`          | Occupational series (e.g. `2210` for IT)                          |
| `MatchedObjectDescriptor.PositionSchedule[0].Name`       | `schedule`           | `text`          | e.g. `Full-time`                                                  |
| `MatchedObjectDescriptor.PositionOfferingType[0].Name`   | `appointment_type`   | `text`          | e.g. `Permanent`                                                  |
| `UserArea.Details.HiringPath`                            | `hiring_paths`       | `text[]`        | Normalized to `['public', 'students', 'veterans', ...]`           |
| `UserArea.Details.SecurityClearance`                     | `security_clearance` | `text`          | e.g. `Secret`, `Top Secret`, `Not Required`                       |
| `MatchedObjectDescriptor.PositionStartDate`              | `opens_at`           | `timestamptz`   | ISO 8601 UTC timestamp                                            |
| `MatchedObjectDescriptor.PositionEndDate`                | `closes_at`          | `timestamptz`   | ISO 8601 UTC timestamp                                            |
| `MatchedObjectDescriptor.ApplyURI[0]`                    | `apply_url`          | `text`          | Direct official application link                                  |
| `MatchedObjectDescriptor.PositionURI`                    | `source_url`         | `text`          | Official USAJOBS posting link                                     |
| Computed hash of core fields                             | `content_hash`       | `text`          | SHA-256 hex digest                                                |
