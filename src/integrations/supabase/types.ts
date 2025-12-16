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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      carrinho_produto: {
        Row: {
          fk_cliente_id: string | null
          fk_produto_id: number | null
          id: number
          quantidade: number
          valor_total_item: number
        }
        Insert: {
          fk_cliente_id?: string | null
          fk_produto_id?: number | null
          id?: never
          quantidade?: number
          valor_total_item: number
        }
        Update: {
          fk_cliente_id?: string | null
          fk_produto_id?: number | null
          id?: never
          quantidade?: number
          valor_total_item?: number
        }
        Relationships: [
          {
            foreignKeyName: "carrinho_produto_fk_cliente_id_fkey"
            columns: ["fk_cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carrinho_produto_fk_produto_id_fkey"
            columns: ["fk_produto_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      endereco: {
        Row: {
          cep: number | null
          fk_cliente_id: string | null
          fk_unidade_id: number | null
          id: number
          rua: string | null
        }
        Insert: {
          cep?: number | null
          fk_cliente_id?: string | null
          fk_unidade_id?: number | null
          id?: never
          rua?: string | null
        }
        Update: {
          cep?: number | null
          fk_cliente_id?: string | null
          fk_unidade_id?: number | null
          id?: never
          rua?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "endereco_fk_cliente_id_fkey"
            columns: ["fk_cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "endereco_fk_unidade_id_fkey"
            columns: ["fk_unidade_id"]
            isOneToOne: false
            referencedRelation: "unidade"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          fk_cliente_id: string | null
          id: number
        }
        Insert: {
          fk_cliente_id?: string | null
          id?: never
        }
        Update: {
          fk_cliente_id?: string | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_fk_cliente_id_fkey"
            columns: ["fk_cliente_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forma_de_pagamento: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: never
          nome: string
        }
        Update: {
          id?: never
          nome?: string
        }
        Relationships: []
      }
      pedido: {
        Row: {
          data_pedido: string | null
          fk_cliente_id: string | null
          fk_unidade_id: number | null
          id: number
          valor_total: number | null
        }
        Insert: {
          data_pedido?: string | null
          fk_cliente_id?: string | null
          fk_unidade_id?: number | null
          id?: never
          valor_total?: number | null
        }
        Update: {
          data_pedido?: string | null
          fk_cliente_id?: string | null
          fk_unidade_id?: number | null
          id?: never
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_fk_cliente_id_fkey"
            columns: ["fk_cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_fk_unidade_id_fkey"
            columns: ["fk_unidade_id"]
            isOneToOne: false
            referencedRelation: "unidade"
            referencedColumns: ["id"]
          },
        ]
      }
      produto: {
        Row: {
          created_at: string | null
          data_vencimento: string | null
          descricao: string | null
          fk_tipo_produto_id: number | null
          fk_vendedor_id: string | null
          id: number
          imagem: string | null
          mime: string | null
          nome: string
          preco: number
          quantidade: number | null
        }
        Insert: {
          created_at?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          fk_tipo_produto_id?: number | null
          fk_vendedor_id?: string | null
          id?: never
          imagem?: string | null
          mime?: string | null
          nome: string
          preco: number
          quantidade?: number | null
        }
        Update: {
          created_at?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          fk_tipo_produto_id?: number | null
          fk_vendedor_id?: string | null
          id?: never
          imagem?: string | null
          mime?: string | null
          nome?: string
          preco?: number
          quantidade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_fk_tipo_produto_id_fkey"
            columns: ["fk_tipo_produto_id"]
            isOneToOne: false
            referencedRelation: "tipo_produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fk_vendedor_id_fkey"
            columns: ["fk_vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_favorito: {
        Row: {
          fk_favoritos_id: number
          fk_produto_id: number
        }
        Insert: {
          fk_favoritos_id: number
          fk_produto_id: number
        }
        Update: {
          fk_favoritos_id?: number
          fk_produto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "produto_favorito_fk_favoritos_id_fkey"
            columns: ["fk_favoritos_id"]
            isOneToOne: false
            referencedRelation: "favoritos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_favorito_fk_produto_id_fkey"
            columns: ["fk_produto_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          celular: string | null
          cnpj: number | null
          cpf: number | null
          created_at: string | null
          data_nasc: string | null
          endereco: string | null
          horario_funcionamento: string | null
          id: string
          imagem_perfil: string | null
          latitude: number | null
          longitude: number | null
          nome: string
          preferencias_alimentares: string | null
          tipo_usuario: string
        }
        Insert: {
          celular?: string | null
          cnpj?: number | null
          cpf?: number | null
          created_at?: string | null
          data_nasc?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id: string
          imagem_perfil?: string | null
          latitude?: number | null
          longitude?: number | null
          nome: string
          preferencias_alimentares?: string | null
          tipo_usuario: string
        }
        Update: {
          celular?: string | null
          cnpj?: number | null
          cpf?: number | null
          created_at?: string | null
          data_nasc?: string | null
          endereco?: string | null
          horario_funcionamento?: string | null
          id?: string
          imagem_perfil?: string | null
          latitude?: number | null
          longitude?: number | null
          nome?: string
          preferencias_alimentares?: string | null
          tipo_usuario?: string
        }
        Relationships: []
      }
      telefone: {
        Row: {
          fk_cliente_id: string | null
          fk_vendedor_id: string | null
          id: number
          numero: number | null
          principal: boolean | null
        }
        Insert: {
          fk_cliente_id?: string | null
          fk_vendedor_id?: string | null
          id?: never
          numero?: number | null
          principal?: boolean | null
        }
        Update: {
          fk_cliente_id?: string | null
          fk_vendedor_id?: string | null
          id?: never
          numero?: number | null
          principal?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "telefone_fk_cliente_id_fkey"
            columns: ["fk_cliente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telefone_fk_vendedor_id_fkey"
            columns: ["fk_vendedor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_produto: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: never
          nome: string
        }
        Update: {
          id?: never
          nome?: string
        }
        Relationships: []
      }
      unidade: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: never
          nome: string
        }
        Update: {
          id?: never
          nome?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendedor" | "comprador"
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
      app_role: ["admin", "vendedor", "comprador"],
    },
  },
} as const
