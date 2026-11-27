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
      abstract_decisions: {
        Row: {
          abstract_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          decided_at: string
          decided_by: string | null
          decision: string
          emailed_at: string | null
          note: string | null
          revision_due_at: string | null
        }
        Insert: {
          abstract_id: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          decided_at?: string
          decided_by?: string | null
          decision: string
          emailed_at?: string | null
          note?: string | null
          revision_due_at?: string | null
        }
        Update: {
          abstract_id?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          decided_at?: string
          decided_by?: string | null
          decision?: string
          emailed_at?: string | null
          note?: string | null
          revision_due_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abstract_decisions_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abstract_decisions_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      abstract_disclosures: {
        Row: {
          abstract_id: string
          ai_use: string
          funding_coi: string | null
          prior_status: string | null
          prior_submission: boolean
          prior_venue: string | null
          updated_at: string
        }
        Insert: {
          abstract_id: string
          ai_use?: string
          funding_coi?: string | null
          prior_status?: string | null
          prior_submission?: boolean
          prior_venue?: string | null
          updated_at?: string
        }
        Update: {
          abstract_id?: string
          ai_use?: string
          funding_coi?: string | null
          prior_status?: string | null
          prior_submission?: boolean
          prior_venue?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abstract_disclosures_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abstract_disclosures_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      abstracts: {
        Row: {
          abstract_number: number | null
          background: string | null
          conclusion: string | null
          figure_paths: string[] | null
          file_path: string | null
          id: string
          methods: string | null
          original_topic_id: string | null
          pdf_anon_checked_at: string | null
          results: string | null
          reviewers_confirmed_at: string | null
          reviewers_confirmed_by: string | null
          second_topic_id: string | null
          status: Database["public"]["Enums"]["abstract_status"]
          submitted_at: string
          submitted_by: string
          title: string
          topic_id: string | null
          updated_at: string
          word_count: number | null
        }
        Insert: {
          abstract_number?: number | null
          background?: string | null
          conclusion?: string | null
          figure_paths?: string[] | null
          file_path?: string | null
          id?: string
          methods?: string | null
          original_topic_id?: string | null
          pdf_anon_checked_at?: string | null
          results?: string | null
          reviewers_confirmed_at?: string | null
          reviewers_confirmed_by?: string | null
          second_topic_id?: string | null
          status?: Database["public"]["Enums"]["abstract_status"]
          submitted_at?: string
          submitted_by: string
          title: string
          topic_id?: string | null
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          abstract_number?: number | null
          background?: string | null
          conclusion?: string | null
          figure_paths?: string[] | null
          file_path?: string | null
          id?: string
          methods?: string | null
          original_topic_id?: string | null
          pdf_anon_checked_at?: string | null
          results?: string | null
          reviewers_confirmed_at?: string | null
          reviewers_confirmed_by?: string | null
          second_topic_id?: string | null
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
            foreignKeyName: "abstracts_original_topic_id_fkey"
            columns: ["original_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abstracts_second_topic_id_fkey"
            columns: ["second_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abstracts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      app_config: {
        Row: {
          debug_mode: boolean
          id: boolean
          review_closes_at: string | null
          schedule_published_at: string | null
          submission_closes_at: string | null
          submission_opens_at: string | null
          updated_at: string
        }
        Insert: {
          debug_mode?: boolean
          id?: boolean
          review_closes_at?: string | null
          schedule_published_at?: string | null
          submission_closes_at?: string | null
          submission_opens_at?: string | null
          updated_at?: string
        }
        Update: {
          debug_mode?: boolean
          id?: boolean
          review_closes_at?: string | null
          schedule_published_at?: string | null
          submission_closes_at?: string | null
          submission_opens_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          abstract_id: string | null
          error: string | null
          id: string
          kind: string
          recipient_email: string
          sent_at: string
          sent_by: string | null
          status: string
          subject: string
        }
        Insert: {
          abstract_id?: string | null
          error?: string | null
          id?: string
          kind?: string
          recipient_email: string
          sent_at?: string
          sent_by?: string | null
          status: string
          subject: string
        }
        Update: {
          abstract_id?: string | null
          error?: string | null
          id?: string
          kind?: string
          recipient_email?: string
          sent_at?: string
          sent_by?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_log_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: false
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          consent_at: string
          created_at: string
          email: string
          id: string
          name: string | null
          resend_contact_id: string | null
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          consent_at?: string
          created_at?: string
          email: string
          id?: string
          name?: string | null
          resend_contact_id?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          consent_at?: string
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          resend_contact_id?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliation: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          must_change_password: boolean
          updated_at: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          must_change_password?: boolean
          updated_at?: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          must_change_password?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      review_assignments: {
        Row: {
          abstract_id: string
          assigned_at: string
          decline_reason: string | null
          id: string
          reviewer_id: string
          status: Database["public"]["Enums"]["assignment_status"]
        }
        Insert: {
          abstract_id: string
          assigned_at?: string
          decline_reason?: string | null
          id?: string
          reviewer_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
        }
        Update: {
          abstract_id?: string
          assigned_at?: string
          decline_reason?: string | null
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
      reviewer_expertise: {
        Row: {
          created_at: string
          id: string
          reviewer_id: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reviewer_id: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reviewer_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_expertise_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      reviewer_notes: {
        Row: {
          assignment_id: string
          notes: string | null
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          assignment_id: string
          notes?: string | null
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          notes?: string | null
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_notes_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "review_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          assignment_id: string
          comments_for_authors: string | null
          comments_for_soc: string | null
          feedback_improve: string | null
          feedback_tips: string | null
          feedback_value: string | null
          id: string
          recommendation:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_fit_session: number | null
          score_methods: number | null
          score_novelty: number | null
          score_relevance: number | null
          score_reproducibility: number | null
          score_technical: number | null
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          comments_for_authors?: string | null
          comments_for_soc?: string | null
          feedback_improve?: string | null
          feedback_tips?: string | null
          feedback_value?: string | null
          id?: string
          recommendation?:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_fit_session?: number | null
          score_methods?: number | null
          score_novelty?: number | null
          score_relevance?: number | null
          score_reproducibility?: number | null
          score_technical?: number | null
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          comments_for_authors?: string | null
          comments_for_soc?: string | null
          feedback_improve?: string | null
          feedback_tips?: string | null
          feedback_value?: string | null
          id?: string
          recommendation?:
            | Database["public"]["Enums"]["review_recommendation"]
            | null
          score_fit_session?: number | null
          score_methods?: number | null
          score_novelty?: number | null
          score_relevance?: number | null
          score_reproducibility?: number | null
          score_technical?: number | null
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
      schedule_slots: {
        Row: {
          abstract_id: string
          end_time: string | null
          kind: string
          position: number
          session_id: string
          start_time: string | null
          updated_at: string
        }
        Insert: {
          abstract_id: string
          end_time?: string | null
          kind: string
          position?: number
          session_id: string
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          abstract_id?: string
          end_time?: string | null
          kind?: string
          position?: number
          session_id?: string
          start_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_slots_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "abstracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_slots_abstract_id_fkey"
            columns: ["abstract_id"]
            isOneToOne: true
            referencedRelation: "reviewer_abstract_view"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_errors: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          id: string
          message: string | null
          step: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          message?: string | null
          step: string
          user_agent?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          message?: string | null
          step?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
      admin_declined_reviews: {
        Args: never
        Returns: {
          abstract_id: string
          abstract_number: number
          active_reviewers: number
          assignment_id: string
          decline_reason: string
          reviewer_email: string
          reviewer_name: string
          title: string
        }[]
      }
      admin_reviewer_status: {
        Args: never
        Returns: {
          assigned: number
          email: string
          full_name: string
          last_sign_in_at: string
          must_change_password: boolean
          reviewed: number
          reviewer_id: string
        }[]
      }
      complete_password_change: { Args: never; Returns: undefined }
      decline_review: {
        Args: { _assignment_id: string; _reason?: string }
        Returns: undefined
      }
      get_my_review_feedback: {
        Args: { _abstract_id: string }
        Returns: {
          feedback_improve: string
          feedback_tips: string
          feedback_value: string
        }[]
      }
      get_public_schedule: {
        Args: never
        Returns: {
          authors: string
          end_time: string
          kind: string
          presenter: string
          session_id: string
          slot_position: number
          start_time: string
          title: string
        }[]
      }
      mailbox_confirm: {
        Args: { _email: string; _token_hash: string; _user_id: string }
        Returns: boolean
      }
      mailbox_store_token: {
        Args: { _email: string; _token_hash: string; _user_id: string }
        Returns: boolean
      }
      my_coauthor_count: { Args: never; Returns: number }
      my_mailbox_verified: { Args: never; Returns: boolean }
      reassign_review: {
        Args: { _assignment_id: string; _reviewer_id?: string }
        Returns: string
      }
      replace_abstract_authors: {
        Args: { _abstract_id: string; _authors: Json }
        Returns: undefined
      }
      withdraw_abstract: {
        Args: { _abstract_id: string; _restore?: boolean }
        Returns: string
      }
    }
    Enums: {
      abstract_status:
        | "submitted"
        | "accepted_oral"
        | "accepted_poster"
        | "rejected"
        | "withdrawn"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
        "withdrawn",
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
