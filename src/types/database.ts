export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      areas: {
        Row: {
          center: unknown;
          created_at: string;
          id: string;
          is_active: boolean;
          level: Database['public']['Enums']['area_level'];
          name: string;
          parent_id: string | null;
          slug: string;
          sort_order: number;
          zoom_level: number | null;
        };
        Insert: {
          center?: unknown;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          level: Database['public']['Enums']['area_level'];
          name: string;
          parent_id?: string | null;
          slug: string;
          sort_order?: number;
          zoom_level?: number | null;
        };
        Update: {
          center?: unknown;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          level?: Database['public']['Enums']['area_level'];
          name?: string;
          parent_id?: string | null;
          slug?: string;
          sort_order?: number;
          zoom_level?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      store_themes: {
        Row: {
          is_available: boolean;
          last_verified_at: string | null;
          price_per_person: number | null;
          store_id: string;
          theme_id: string;
        };
        Insert: {
          is_available?: boolean;
          last_verified_at?: string | null;
          price_per_person?: number | null;
          store_id: string;
          theme_id: string;
        };
        Update: {
          is_available?: boolean;
          last_verified_at?: string | null;
          price_per_person?: number | null;
          store_id?: string;
          theme_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'store_themes_store_id_fkey';
            columns: ['store_id'];
            isOneToOne: false;
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'store_themes_theme_id_fkey';
            columns: ['theme_id'];
            isOneToOne: false;
            referencedRelation: 'themes';
            referencedColumns: ['id'];
          },
        ];
      };
      stores: {
        Row: {
          address: string;
          area_id: string;
          created_at: string;
          id: string;
          images: string[];
          instagram_url: string | null;
          kakao_place_id: string | null;
          naver_place_id: string | null;
          last_verified_at: string | null;
          location: unknown;
          name: string;
          opening_hours: Json | null;
          phone: string | null;
          slug: string;
          status: Database['public']['Enums']['store_status'];
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          address: string;
          area_id: string;
          created_at?: string;
          id?: string;
          images?: string[];
          instagram_url?: string | null;
          kakao_place_id?: string | null;
          naver_place_id?: string | null;
          last_verified_at?: string | null;
          location: unknown;
          name: string;
          opening_hours?: Json | null;
          phone?: string | null;
          slug: string;
          status?: Database['public']['Enums']['store_status'];
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          address?: string;
          area_id?: string;
          created_at?: string;
          id?: string;
          images?: string[];
          instagram_url?: string | null;
          kakao_place_id?: string | null;
          naver_place_id?: string | null;
          last_verified_at?: string | null;
          location?: unknown;
          name?: string;
          opening_hours?: Json | null;
          phone?: string | null;
          slug?: string;
          status?: Database['public']['Enums']['store_status'];
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stores_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      themes: {
        Row: {
          cover_image: string | null;
          created_at: string;
          description: string | null;
          difficulty: number | null;
          genres: string[];
          gm_required: boolean;
          id: string;
          max_players: number;
          min_players: number;
          play_time_min: number | null;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: number | null;
          genres?: string[];
          gm_required?: boolean;
          id?: string;
          max_players: number;
          min_players: number;
          play_time_min?: number | null;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: number | null;
          genres?: string[];
          gm_required?: boolean;
          id?: string;
          max_players?: number;
          min_players?: number;
          play_time_min?: number | null;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_pairs: {
        Args: {
          p_area_slug?: string;
          p_difficulty_max?: number;
          p_difficulty_min?: number;
          p_genres?: string[];
          p_max_play_time?: number;
          p_players?: number;
          p_query?: string;
          p_theme_slug?: string;
        };
        Returns: {
          store_id: string;
          theme_id: string;
        }[];
      };
      search_stores: {
        Args: {
          p_area_slug?: string;
          p_difficulty_max?: number;
          p_difficulty_min?: number;
          p_genres?: string[];
          p_max_lat?: number;
          p_max_lng?: number;
          p_max_play_time?: number;
          p_min_lat?: number;
          p_min_lng?: number;
          p_players?: number;
          p_query?: string;
          p_theme_slug?: string;
        };
        Returns: {
          address: string;
          area_id: string;
          area_name: string;
          id: string;
          lat: number;
          lng: number;
          matched_theme_count: number;
          name: string;
          slug: string;
          thumbnail: string;
          total_theme_count: number;
          kakao_place_id: string;
          naver_place_id: string;
        }[];
      };
      search_themes: {
        Args: {
          p_area_slug?: string;
          p_difficulty_max?: number;
          p_difficulty_min?: number;
          p_genres?: string[];
          p_max_play_time?: number;
          p_players?: number;
          p_query?: string;
          p_store_slug?: string;
        };
        Returns: {
          cover_image: string;
          difficulty: number;
          genres: string[];
          gm_required: boolean;
          id: string;
          max_players: number;
          min_players: number;
          play_time_min: number;
          slug: string;
          store_count: number;
          title: string;
        }[];
      };
    };
    Enums: {
      area_level: 'city' | 'district' | 'neighborhood';
      store_status: 'active' | 'closed' | 'hidden';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      area_level: ['city', 'district', 'neighborhood'],
      store_status: ['active', 'closed', 'hidden'],
    },
  },
} as const;
