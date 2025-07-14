import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          subscription: 'free' | 'pro';
          usage_today: number;
          last_usage_date: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          subscription?: 'free' | 'pro';
          usage_today?: number;
          last_usage_date?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          subscription?: 'free' | 'pro';
          usage_today?: number;
          last_usage_date?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          prompt: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          prompt: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          prompt?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      shift_notes: {
        Row: {
          id: string;
          user_id: string;
          raw_input: string;
          formatted_output: string;
          template: string;
          client_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raw_input: string;
          formatted_output: string;
          template: string;
          client_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raw_input?: string;
          formatted_output?: string;
          template?: string;
          client_name?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
