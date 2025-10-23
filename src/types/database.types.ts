export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          encrypted_password: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          encrypted_password: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          encrypted_password?: string
        }
      }
      reports: {
        Row: {
          id: number
          user_id: string
          image_urls: string[]
          created_at: string
          waste_type: string
          waste_volume: string
          location_category: string
          notes: string | null
          lattitude: string
          longitude: string
        }
        Insert: {
          id?: number
          user_id: string
          image_urls: string[]
          created_at?: string
          waste_type: string
          waste_volume: string
          location_category: string
          notes?: string | null
          latitude: string
          longitude: string
        }
        Update: {
          id?: number
          user_id?: string
          image_urls?: string[]
          created_at?: string
          waste_type?: string
          waste_volume?: string
          location_category?: string
          notes?: string | null
          latitude?: string
          longitude?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      location_category_enum: 'sungai' | 'pinggir_jalan' | 'area_public' | 'tanah_kosong' | 'lainnya'
      waste_type_enum: 'organik' | 'anorganik' | 'berbahaya' | 'campuran'
      waste_volume_enum: 'kurang_dari_1kg' | '1_5kg' | '6_10kg' | 'lebih_dari_10kg'
    }
  }
}
