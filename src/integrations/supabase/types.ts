export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abstract_authors: {
        Row: {
          abstract_id: string
          affiliation: string | null
          author_order: number
          email: string | null
          id: string
          is_presenting: boolean
          name: string
        }
        Insert: {
          abstract_id: string
          affiliation?: string | null
          author_order?: number
          email?: string | null
          id?: string
          is_presenting?: boolean
          name: string
        }
        Update: {
          abstract_id?: string
          affiliation?: string | null
          author_order?: number
          email?: string | null
          id?: string
          is_presenting?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "abstract_authors_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abstract_authors_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      abstracts: {
        Row: {
          background: string | null
          conclusion: string | null
          file_path: string | null
          id: string
          methods: string | null
          results: string | null
          status: Database["public"]["Enums"]["abstract_status"]
          submitted_at: string
          submitted_by: string
          title: string
          topic_id: string | null
          updated_at: string
          word_count: number | null
        }
        Insert: {
          background?: string | null
          conclusion?: string | null
          file_path?: string | null
          id?: string
          methods?: string | null
          results?: string | null
          status?: Database["public"]["Enums"]["abstract_status"]
          submitted_at?: string
          submitted_by: string
          title: string
          topic_id?: string | null
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          background?: string | null
          conclusion?: string | null
          file_path?: string | null
          id?: string
          methods?: string | null
          results?: string | null
          status?: Database["public"]["Enums"]["abstract_status"]
          submitted_at?: string
          submitted_by?: string
          title?: string
          topic_id?: string | null
          updated_at?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abstracts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          affiliation: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_assignments: {
        Row: {
          abstract_id: string
          assigned_at: string
          id: string
          reviewer_id: string
          status: Database["public"]["Enums"]["assignment_status"]
        }
        Insert: {
          abstract_id: string
          assigned_at?: string
          id?: string
          reviewer_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
        }
        Update: {
          abstract_id?: string
          assigned_at?: string
          id?: string
          reviewer_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "review_assignments_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_assignments_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          assignment_id: string
          comments_for_authors: string | null
          comments_for_soc: string | null
          id: string
          recommendation:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_methods: number | null
          score_novelty: number | null
          score_relevance: number | null
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          comments_for_authors?: string | null
          comments_for_soc?: string | null
          id?: string
          recommendation?:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_methods?: number | null
          score_novelty?: number | null
          score_relevance?: number | null
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          comments_for_authors?: string | null
          comments_for_soc?: string | null
          id?: string
          recommendation?:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_methods?: number | null
          score_novelty?: number | null
          score_relevance?: number | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "review_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      reviewer_abstract_view: {
        Row: {
          background: string | null
          conclusion: string | null
          file_path: string | null
          id: string | null
          methods: string | null
          results: string | null
          status: Database["public"]["Enums"]["abstract_status"] | null
          submitted_at: string | null
          title: string | null
          topic_id: string | null
          topic_name: string | null
          word_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abstracts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      abstract_status:
        | "submitted"
        | "accepted_oral"
        | "accepted_poster"
        | "rejected"
      app_role: "author" | "reviewer" | "soc" | "admin"
      assignment_status: "pending" | "done" | "declined_coi"
      review_recommendation:
        | "accept_oral"
        | "accept_poster"
        | "reject"
        | "revise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      abstract_status: [
        "submitted",
        "accepted_oral",
        "accepted_poster",
        "rejected",
      ],
      app_role: ["author", "reviewer", "soc", "admin"],
      assignment_status: ["pending", "done", "declined_coi"],
      review_recommendation: [
        "accept_oral",
        "accept_poster",
        "reject",
        "revise",
      ],
    },
  },
} as const
