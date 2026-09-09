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
      enquiries: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          experience: string
          handle: string | null
          id: string
          ip_hash: string | null
          locale: string
          message: string | null
          name: string
          place: string
          preferred_contact: string
          purpose: string
          status: Database["public"]["Enums"]["enquiry_status"]
          timing: string
          updated_at: string
          user_agent: string | null
          why_norwich: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          experience: string
          handle?: string | null
          id?: string
          ip_hash?: string | null
          locale?: string
          message?: string | null
          name: string
          place: string
          preferred_contact: string
          purpose: string
          status?: Database["public"]["Enums"]["enquiry_status"]
          timing: string
          updated_at?: string
          user_agent?: string | null
          why_norwich: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          experience?: string
          handle?: string | null
          id?: string
          ip_hash?: string | null
          locale?: string
          message?: string | null
          name?: string
          place?: string
          preferred_contact?: string
          purpose?: string
          status?: Database["public"]["Enums"]["enquiry_status"]
          timing?: string
          updated_at?: string
          user_agent?: string | null
          why_norwich?: string
        }
        Relationships: []
      }
      enquiry_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          enquiry_id: string
          id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          enquiry_id: string
          id?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          enquiry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          description: string | null
          direction: Database["public"]["Enums"]["finance_direction"]
          entry_date: string
          id: string
          litter_id: string | null
          show_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          direction: Database["public"]["Enums"]["finance_direction"]
          entry_date?: string
          id?: string
          litter_id?: string | null
          show_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          direction?: Database["public"]["Enums"]["finance_direction"]
          entry_date?: string
          id?: string
          litter_id?: string | null
          show_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_entries_litter_id_fkey"
            columns: ["litter_id"]
            isOneToOne: false
            referencedRelation: "litters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_entries_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      litters: {
        Row: {
          body_en: string | null
          body_ru: string | null
          created_at: string
          headline_en: string | null
          headline_ru: string | null
          id: string
          is_published: boolean
          name: string
          notes: string | null
          planned_date: string | null
          status: string
          timing_label_en: string | null
          timing_label_ru: string | null
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_ru?: string | null
          created_at?: string
          headline_en?: string | null
          headline_ru?: string | null
          id?: string
          is_published?: boolean
          name: string
          notes?: string | null
          planned_date?: string | null
          status?: string
          timing_label_en?: string | null
          timing_label_ru?: string | null
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_ru?: string | null
          created_at?: string
          headline_en?: string | null
          headline_ru?: string | null
          id?: string
          is_published?: boolean
          name?: string
          notes?: string | null
          planned_date?: string | null
          status?: string
          timing_label_en?: string | null
          timing_label_ru?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          device: string | null
          id: number
          locale: string | null
          path: string
          referrer: string | null
          visitor_hash: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          id?: number
          locale?: string | null
          path: string
          referrer?: string | null
          visitor_hash?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          id?: number
          locale?: string | null
          path?: string
          referrer?: string | null
          visitor_hash?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      shows: {
        Row: {
          awarded_title: string | null
          city: string | null
          country: string | null
          created_at: string
          dog_class: string | null
          id: string
          notes: string | null
          result: string | null
          show_date: string
          title: string
        }
        Insert: {
          awarded_title?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          dog_class?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          show_date: string
          title: string
        }
        Update: {
          awarded_title?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          dog_class?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          show_date?: string
          title?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          locale: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          locale: string
          updated_at?: string
          value?: string
        }
        Update: {
          id?: string
          key?: string
          locale?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      site_photos: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          id: string
          slot: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          slot: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          slot?: string
          sort_order?: number
          url?: string
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
      [_ in never]: never
    }
    Functions: {
      can_submit_enquiry: { Args: { _ip_hash: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "accountant"
      enquiry_status: "new" | "in_progress" | "approved" | "declined"
      finance_direction: "income" | "expense"
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
      app_role: ["admin", "accountant"],
      enquiry_status: ["new", "in_progress", "approved", "declined"],
      finance_direction: ["income", "expense"],
    },
  },
} as const
