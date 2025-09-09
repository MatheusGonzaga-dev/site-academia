import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rzojanygdumtbafpnhxy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6b2phbnlnZHVtdGJhZnBuaHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDA2NDEsImV4cCI6MjA3MjkxNjY0MX0.ZQpgUH6UZ-a-hsLAbf_v00MkXhRDmmTtIxeuUl-_1qM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          date: string
          exercises: any // JSON
          duration: number | null
          notes: string | null
          completed: boolean
          from_weekly_plan: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          date: string
          exercises: any
          duration?: number | null
          notes?: string | null
          completed?: boolean
          from_weekly_plan?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          date?: string
          exercises?: any
          duration?: number | null
          notes?: string | null
          completed?: boolean
          from_weekly_plan?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      diet_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          meals: any // JSON
          water_intake: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          meals: any
          water_intake: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meals?: any
          water_intake?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          weight: number | null
          body_fat: number | null
          measurements: any // JSON
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          weight?: number | null
          body_fat?: number | null
          measurements?: any
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight?: number | null
          body_fat?: number | null
          measurements?: any
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weekly_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          schedule: any // JSON
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          schedule: any
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          schedule?: any
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
