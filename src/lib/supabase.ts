import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with enhanced error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true  // 디버그 모드 활성화
  },
  global: {
    headers: {
      'X-Client-Info': 'music-app@1.0.0'
    },
    fetch: (url, options = {}) => {
      console.log('🌐 Supabase fetch:', url, options.method || 'GET');
      
      // 30초 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('⏰ Supabase request timeout after 30s:', url);
        controller.abort();
      }, 30000);
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).then(response => {
        clearTimeout(timeoutId);
        console.log('✅ Supabase response:', response.status, url);
        return response;
      }).catch(error => {
        clearTimeout(timeoutId);
        console.error('❌ Supabase fetch error:', error, url);
        throw error;
      });
    }
  }
});

// Runtime check for production
export function checkSupabaseConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase environment variables not configured properly');
    return false;
  }
  return true;
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          tokens: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tokens?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      music_generations: {
        Row: {
          id: string;
          user_id: string | null;
          title: string | null;
          prompt: string;
          generated_prompt: string | null;
          music_url: string | null;
          thumbnail_url: string | null;
          duration: number | null;
          genre: string | null;
          mood: string | null;
          scene: string | null;
          use_case: string | null;
          instruments: string[] | null;
          status: 'generating' | 'completed' | 'failed';
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title?: string | null;
          prompt: string;
          generated_prompt?: string | null;
          music_url?: string | null;
          thumbnail_url?: string | null;
          duration?: number | null;
          genre?: string | null;
          mood?: string | null;
          scene?: string | null;
          use_case?: string | null;
          instruments?: string[] | null;
          status?: 'generating' | 'completed' | 'failed';
          tokens_used?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string | null;
          prompt?: string;
          generated_prompt?: string | null;
          music_url?: string | null;
          thumbnail_url?: string | null;
          duration?: number | null;
          genre?: string | null;
          mood?: string | null;
          scene?: string | null;
          use_case?: string | null;
          instruments?: string[] | null;
          status?: 'generating' | 'completed' | 'failed';
          tokens_used?: number;
          created_at?: string;
        };
      };
      token_transactions: {
        Row: {
          id: string;
          user_id: string | null;
          transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus';
          amount: number;
          description: string;
          package_name: string | null;
          payment_method: string | null;
          payment_amount: number | null;
          music_generation_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus';
          amount: number;
          description: string;
          package_name?: string | null;
          payment_method?: string | null;
          payment_amount?: number | null;
          music_generation_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          transaction_type?: 'purchase' | 'usage' | 'refund' | 'bonus';
          amount?: number;
          description?: string;
          package_name?: string | null;
          payment_method?: string | null;
          payment_amount?: number | null;
          music_generation_id?: string | null;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string | null;
          favorite_genres: string[] | null;
          favorite_moods: string[] | null;
          favorite_instruments: string[] | null;
          theme_preference: 'light' | 'dark' | 'system';
          language_preference: string;
          email_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          favorite_genres?: string[] | null;
          favorite_moods?: string[] | null;
          favorite_instruments?: string[] | null;
          theme_preference?: 'light' | 'dark' | 'system';
          language_preference?: string;
          email_notifications?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          favorite_genres?: string[] | null;
          favorite_moods?: string[] | null;
          favorite_instruments?: string[] | null;
          theme_preference?: 'light' | 'dark' | 'system';
          language_preference?: string;
          email_notifications?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      music_favorites: {
        Row: {
          id: string;
          user_id: string | null;
          music_generation_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          music_generation_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          music_generation_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}