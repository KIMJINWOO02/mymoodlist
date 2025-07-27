import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  tokens: number;
}

export class AuthService {
  // 회원가입
  static async signUp(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          }
        }
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || '회원가입 중 오류가 발생했습니다.');
    }
  }

  // 로그인
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || '로그인 중 오류가 발생했습니다.');
    }
  }

  // 구글 로그인 (임시 비활성화)
  // static async signInWithGoogle() {
  //   구글 OAuth 설정 후 활성화 예정
  // }

  // 로그아웃
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('로그아웃 중 오류가 발생했습니다.');
    }
  }

  // 현재 사용자 정보 가져오기
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // users 테이블에서 추가 정보 가져오기
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        id: user.id,
        email: user.email!,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        tokens: userData.tokens
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // 세션 변경 감지
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }

  // 비밀번호 재설정 요청
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error('비밀번호 재설정 요청 중 오류가 발생했습니다.');
    }
  }

  // 비밀번호 업데이트
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }

  // 프로필 업데이트
  static async updateProfile(updates: {
    full_name?: string;
    avatar_url?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('사용자를 찾을 수 없습니다.');

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      return await this.getCurrentUser();
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error('프로필 업데이트 중 오류가 발생했습니다.');
    }
  }

  // 이메일 중복 확인
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      // Supabase는 직접적인 이메일 중복 확인 API를 제공하지 않으므로
      // 회원가입 시도 후 에러 메시지로 판단하거나, users 테이블을 조회
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      return !!data;
    } catch (error) {
      return false;
    }
  }
}