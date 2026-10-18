import { z } from "zod";

export const UsajobsLocationSchema = z.object({
  LocationName: z.string().optional(),
  CountryCode: z.string().optional(),
  CountrySubdivisionCode: z.string().optional(),
  Longitude: z.number().optional(),
  Latitude: z.number().optional(),
});

export const UsajobsRemunerationSchema = z.object({
  MinimumRange: z.string().or(z.number()).optional(),
  MaximumRange: z.string().or(z.number()).optional(),
  RateIntervalCode: z.string().optional(),
  Description: z.string().optional(),
});

export const UsajobsCodeNameSchema = z.object({
  Code: z.string().optional(),
  Name: z.string().optional(),
});

export const UsajobsMatchedObjectDescriptorSchema = z.object({
  PositionID: z.string().optional(),
  PositionTitle: z.string(),
  PositionURI: z.string(),
  ApplyURI: z.array(z.string()).optional(),
  PositionLocation: z.array(UsajobsLocationSchema).optional(),
  OrganizationName: z.string().optional(),
  DepartmentName: z.string().optional(),
  JobCategory: z.array(UsajobsCodeNameSchema).optional(),
  JobGrade: z.array(z.object({ Code: z.string().optional() })).optional(),
  PositionSchedule: z.array(UsajobsCodeNameSchema).optional(),
  PositionOfferingType: z.array(UsajobsCodeNameSchema).optional(),
  PositionRemuneration: z.array(UsajobsRemunerationSchema).optional(),
  PositionStartDate: z.string().optional(),
  PositionEndDate: z.string().optional(),
  UserArea: z
    .object({
      Details: z
        .object({
          JobSummary: z.string().optional(),
          WhoMayApply: z.object({ Name: z.string().optional() }).optional(),
          HiringPath: z.array(z.string()).optional(),
          TeleworkEligible: z.boolean().or(z.string()).optional(),
          SecurityClearance: z.string().optional(),
          LowGrade: z.string().or(z.number()).optional(),
          HighGrade: z.string().or(z.number()).optional(),
          PromotionPotential: z.string().optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .optional(),
});

export const UsajobsSearchResultItemSchema = z.object({
  MatchedObjectId: z.string(),
  MatchedObjectDescriptor: UsajobsMatchedObjectDescriptorSchema,
});

export const UsajobsSearchResponseSchema = z.object({
  SearchResult: z.object({
    SearchResultCount: z.number(),
    SearchResultCountAll: z.number(),
    SearchResultItems: z.array(UsajobsSearchResultItemSchema),
  }),
});

export type UsajobsSearchResponse = z.infer<typeof UsajobsSearchResponseSchema>;
export type UsajobsSearchResultItem = z.infer<typeof UsajobsSearchResultItemSchema>;
