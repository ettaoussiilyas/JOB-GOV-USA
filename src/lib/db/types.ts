export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      app_meta: {
        Row: {
          key: string;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          agency_name: string | null;
          apply_url: string;
          appointment_type: string | null;
          closed_at: string | null;
          closes_at: string | null;
          content_hash: string;
          created_at: string;
          department_name: string | null;
          description_raw: Json;
          first_seen_at: string;
          grade_high: number | null;
          grade_low: number | null;
          hiring_paths: string[];
          id: string;
          last_seen_at: string;
          locations: Json;
          opens_at: string | null;
          pay_interval: string | null;
          pay_max: number | null;
          pay_min: number | null;
          pay_plan: string | null;
          remote_or_telework: boolean;
          schedule: string | null;
          search: unknown;
          security_clearance: string | null;
          series_code: string | null;
          slug: string;
          source: string;
          source_id: string;
          source_url: string | null;
          state_codes: string[];
          status: string;
          summary_plain: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          agency_name?: string | null;
          apply_url: string;
          appointment_type?: string | null;
          closed_at?: string | null;
          closes_at?: string | null;
          content_hash: string;
          created_at?: string;
          department_name?: string | null;
          description_raw?: Json;
          first_seen_at?: string;
          grade_high?: number | null;
          grade_low?: number | null;
          hiring_paths?: string[];
          id?: string;
          last_seen_at?: string;
          locations?: Json;
          opens_at?: string | null;
          pay_interval?: string | null;
          pay_max?: number | null;
          pay_min?: number | null;
          pay_plan?: string | null;
          remote_or_telework?: boolean;
          schedule?: string | null;
          search?: unknown;
          security_clearance?: string | null;
          series_code?: string | null;
          slug: string;
          source?: string;
          source_id: string;
          source_url?: string | null;
          state_codes?: string[];
          status?: string;
          summary_plain?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          agency_name?: string | null;
          apply_url?: string;
          appointment_type?: string | null;
          closed_at?: string | null;
          closes_at?: string | null;
          content_hash?: string;
          created_at?: string;
          department_name?: string | null;
          description_raw?: Json;
          first_seen_at?: string;
          grade_high?: number | null;
          grade_low?: number | null;
          hiring_paths?: string[];
          id?: string;
          last_seen_at?: string;
          locations?: Json;
          opens_at?: string | null;
          pay_interval?: string | null;
          pay_max?: number | null;
          pay_min?: number | null;
          pay_plan?: string | null;
          remote_or_telework?: boolean;
          schedule?: string | null;
          search?: unknown;
          security_clearance?: string | null;
          series_code?: string | null;
          slug?: string;
          source?: string;
          source_id?: string;
          source_url?: string | null;
          state_codes?: string[];
          status?: string;
          summary_plain?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sync_runs: {
        Row: {
          closed_count: number;
          error: string | null;
          fetched_count: number;
          finished_at: string | null;
          id: string;
          inserted_count: number;
          started_at: string;
          status: string;
          updated_count: number;
        };
        Insert: {
          closed_count?: number;
          error?: string | null;
          fetched_count?: number;
          finished_at?: string | null;
          id?: string;
          inserted_count?: number;
          started_at?: string;
          status?: string;
          updated_count?: number;
        };
        Update: {
          closed_count?: number;
          error?: string | null;
          fetched_count?: number;
          finished_at?: string | null;
          id?: string;
          inserted_count?: number;
          started_at?: string;
          status?: string;
          updated_count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
