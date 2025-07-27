import { supabase } from './supabase';
import { FormData, MusicGenerationResult } from '@/types';

export interface MusicGeneration {
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
}

export class MusicService {
  // 음악 생성 요청 저장
  static async createMusicGeneration(
    userId: string,
    formData: FormData,
    generatedPrompt: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('music_generations')
        .insert({
          user_id: userId,
          prompt: `Scene: ${formData.scene}, Mood: ${formData.mood}, Genre: ${formData.genre}, Use Case: ${formData.useCase}, Instruments: ${formData.instruments}, Custom: ${formData.additional}`,
          generated_prompt: generatedPrompt,
          duration: parseInt(formData.duration.toString()),
          genre: formData.genre,
          mood: formData.mood,
          scene: formData.scene,
          use_case: formData.useCase,
          instruments: formData.instruments,
          status: 'generating',
          tokens_used: 1
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating music generation:', error);
      throw error;
    }
  }

  // 음악 생성 완료 업데이트
  static async updateMusicGeneration(
    id: string,
    result: MusicGenerationResult
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_generations')
        .update({
          title: result.title,
          music_url: result.audioUrl,
          thumbnail_url: result.imageUrl,
          status: 'completed'
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating music generation:', error);
      throw error;
    }
  }

  // 음악 생성 실패 업데이트
  static async markMusicGenerationFailed(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('music_generations')
        .update({
          status: 'failed'
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking music generation as failed:', error);
      throw error;
    }
  }

  // 사용자의 음악 생성 히스토리 가져오기
  static async getUserMusicHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<MusicGeneration[]> {
    try {
      const { data, error } = await supabase
        .from('music_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching music history:', error);
      return [];
    }
  }

  // 특정 음악 생성 정보 가져오기
  static async getMusicGeneration(id: string): Promise<MusicGeneration | null> {
    try {
      const { data, error } = await supabase
        .from('music_generations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching music generation:', error);
      return null;
    }
  }

  // 음악 즐겨찾기 추가/제거
  static async toggleFavorite(userId: string, musicId: string): Promise<boolean> {
    try {
      // 기존 즐겨찾기 확인
      const { data: existing } = await supabase
        .from('music_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('music_generation_id', musicId)
        .single();

      if (existing) {
        // 즐겨찾기 제거
        const { error } = await supabase
          .from('music_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('music_generation_id', musicId);

        if (error) throw error;
        return false;
      } else {
        // 즐겨찾기 추가
        const { error } = await supabase
          .from('music_favorites')
          .insert({
            user_id: userId,
            music_generation_id: musicId
          });

        if (error) throw error;
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // 사용자의 즐겨찾기 음악 가져오기
  static async getUserFavorites(userId: string): Promise<MusicGeneration[]> {
    try {
      const { data, error } = await supabase
        .from('music_favorites')
        .select(`
          music_generation_id,
          music_generations (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(item => item.music_generations).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }
  }

  // 음악 생성 통계
  static async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_uuid: userId });

      if (error) throw error;
      return data?.[0] || {
        total_generations: 0,
        total_tokens_used: 0,
        total_tokens_purchased: 0,
        favorite_genre: null,
        favorite_mood: null
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        total_generations: 0,
        total_tokens_used: 0,
        total_tokens_purchased: 0,
        favorite_genre: null,
        favorite_mood: null
      };
    }
  }

  // 사용자 선호도 저장
  static async saveUserPreferences(
    userId: string,
    preferences: {
      favorite_genres?: string[];
      favorite_moods?: string[];
      favorite_instruments?: string[];
      theme_preference?: 'light' | 'dark' | 'system';
      language_preference?: string;
      email_notifications?: boolean;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  // 사용자 선호도 가져오기
  static async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116은 "not found" 에러
      
      return data || {
        favorite_genres: [],
        favorite_moods: [],
        favorite_instruments: [],
        theme_preference: 'system',
        language_preference: 'ko',
        email_notifications: true
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return {
        favorite_genres: [],
        favorite_moods: [],
        favorite_instruments: [],
        theme_preference: 'system',
        language_preference: 'ko',
        email_notifications: true
      };
    }
  }
}