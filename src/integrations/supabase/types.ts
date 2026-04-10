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
      leads: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          interest: string | null
          message: string | null
          name: string
          phone: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          interest?: string | null
          message?: string | null
          name: string
          phone?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          interest?: string | null
          message?: string | null
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          badge_en: string
          badge_es: string
          baths_en: string
          baths_es: string
          created_at: string
          delivery_en: string
          delivery_es: string
          filter_location_en: string
          filter_location_es: string
          filter_strategy_en: string
          filter_strategy_es: string
          filter_type_en: string
          filter_type_es: string
          hook_en: string
          hook_es: string
          id: string
          ideal_for_en: string
          ideal_for_es: string
          image_path: string | null
          image_url: string
          is_featured: boolean
          is_published: boolean
          location_en: string
          location_es: string
          parking_en: string | null
          parking_es: string | null
          price_from: number | null
          residences_en: string
          residences_es: string
          sort_order: number
          title: string
          type_en: string
          type_es: string
          updated_at: string
        }
        Insert: {
          badge_en: string
          badge_es: string
          baths_en: string
          baths_es: string
          created_at?: string
          delivery_en: string
          delivery_es: string
          filter_location_en: string
          filter_location_es: string
          filter_strategy_en: string
          filter_strategy_es: string
          filter_type_en: string
          filter_type_es: string
          hook_en: string
          hook_es: string
          id?: string
          ideal_for_en: string
          ideal_for_es: string
          image_path?: string | null
          image_url: string
          is_featured?: boolean
          is_published?: boolean
          location_en: string
          location_es: string
          parking_en?: string | null
          parking_es?: string | null
          price_from?: number | null
          residences_en: string
          residences_es: string
          sort_order?: number
          title: string
          type_en: string
          type_es: string
          updated_at?: string
        }
        Update: {
          badge_en?: string
          badge_es?: string
          baths_en?: string
          baths_es?: string
          created_at?: string
          delivery_en?: string
          delivery_es?: string
          filter_location_en?: string
          filter_location_es?: string
          filter_strategy_en?: string
          filter_strategy_es?: string
          filter_type_en?: string
          filter_type_es?: string
          hook_en?: string
          hook_es?: string
          id?: string
          ideal_for_en?: string
          ideal_for_es?: string
          image_path?: string | null
          image_url?: string
          is_featured?: boolean
          is_published?: boolean
          location_en?: string
          location_es?: string
          parking_en?: string | null
          parking_es?: string | null
          price_from?: number | null
          residences_en?: string
          residences_es?: string
          sort_order?: number
          title?: string
          type_en?: string
          type_es?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
