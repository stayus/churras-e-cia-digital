export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customer_addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          neighborhood: string
          number: string
          state?: string
          street: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          addresses: Json
          created_at: string
          email: string
          id: string
          name: string
          password: string
        }
        Insert: {
          addresses?: Json
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
        }
        Update: {
          addresses?: Json
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string
          id: string
          name: string
          password: string
          permissions: Json
          phone: string | null
          pix_key: string | null
          registration_number: string
          role: string
          username: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          name: string
          password: string
          permissions: Json
          phone?: string | null
          pix_key?: string | null
          registration_number: string
          role: string
          username: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          name?: string
          password?: string
          permissions?: Json
          phone?: string | null
          pix_key?: string | null
          registration_number?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: Json
          created_at: string
          customer_id: string
          id: string
          items: Json
          observations: string | null
          payment_method: string
          status: string
          total: number
        }
        Insert: {
          address: Json
          created_at?: string
          customer_id: string
          id?: string
          items: Json
          observations?: string | null
          payment_method: string
          status: string
          total: number
        }
        Update: {
          address?: Json
          created_at?: string
          customer_id?: string
          id?: string
          items?: Json
          observations?: string | null
          payment_method?: string
          status?: string
          total?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          extras: Json | null
          id: string
          image_url: string
          is_out_of_stock: boolean
          name: string
          price: number
          promotion_price: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          extras?: Json | null
          id?: string
          image_url: string
          is_out_of_stock?: boolean
          name: string
          price: number
          promotion_price?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          extras?: Json | null
          id?: string
          image_url?: string
          is_out_of_stock?: boolean
          name?: string
          price?: number
          promotion_price?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          delivery_tiers: Json | null
          free_shipping_radius_km: number
          id: string
          pix_key: string
          shipping_fee: number
          store_address: Json
          store_name: string
          store_phone: string
          whatsapp_link: string
          working_hours: Json | null
        }
        Insert: {
          delivery_tiers?: Json | null
          free_shipping_radius_km?: number
          id?: string
          pix_key: string
          shipping_fee?: number
          store_address: Json
          store_name?: string
          store_phone: string
          whatsapp_link: string
          working_hours?: Json | null
        }
        Update: {
          delivery_tiers?: Json | null
          free_shipping_radius_km?: number
          id?: string
          pix_key?: string
          shipping_fee?: number
          store_address?: Json
          store_name?: string
          store_phone?: string
          whatsapp_link?: string
          working_hours?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      encrypt_customer_password: {
        Args: { password: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
