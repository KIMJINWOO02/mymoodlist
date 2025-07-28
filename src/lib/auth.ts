import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  tokens: number;
  created_at?: string;
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

  // 현재 사용자 정보 가져오기 (토큰 새로고침 포함)
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // 먼저 현재 세션 확인 및 토큰 새로고침 시도
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session error, attempting to refresh:', sessionError.message);
        // 세션 에러가 있으면 토큰 새로고침 시도
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Token refresh failed:', refreshError.message);
          // 새로고침 실패 시 로그아웃 처리
          await this.signOut();
          return null;
        }
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.warn('Failed to get user:', userError?.message);
        return null;
      }

      // users 테이블에서 추가 정보 가져오기
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to get user data from users table:', error.message);
        // 사용자 테이블에 데이터가 없으면 기본값으로 생성
        if (error.code === 'PGRST116') {
          await this.createUserRecord(user);
          return await this.getCurrentUser(); // 재귀 호출로 다시 시도
        }
        throw error;
      }

      return {
        id: user.id,
        email: user.email!,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        tokens: userData.tokens,
        created_at: user.created_at
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // 사용자 레코드 생성 (회원가입 시 자동 생성되지 않은 경우)
  private static async createUserRecord(user: any) {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          tokens: 5, // 기본 토큰
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to create user record:', error);
      }
    } catch (error) {
      console.error('Error creating user record:', error);
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

  // 손상된 인증 토큰 정리
  static async clearCorruptedAuth() {
    try {
      console.log('🧹 Clearing corrupted authentication data...');
      
      // 로컬 스토리지의 Supabase 세션 데이터 정리
      if (typeof window !== 'undefined') {
        const supabaseKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || key.includes('supabase')
        );
        
        supabaseKeys.forEach(key => {
          localStorage.removeItem(key);
          console.log(`Removed localStorage key: ${key}`);
        });
        
        // 세션 스토리지도 정리
        const sessionKeys = Object.keys(sessionStorage).filter(key => 
          key.startsWith('sb-') || key.includes('supabase')
        );
        
        sessionKeys.forEach(key => {
          sessionStorage.removeItem(key);
          console.log(`Removed sessionStorage key: ${key}`);
        });
      }
      
      // Supabase 세션 종료
      await supabase.auth.signOut();
      
      console.log('✅ Corrupted authentication data cleared');
      
      // 페이지 새로고침으로 완전히 초기화
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error clearing corrupted auth:', error);
    }
  }

  // 인증 상태 복복
  static async repairAuth() {
    try {
      console.log('🔧 Attempting to repair authentication...');
      
      // 현재 세션 상태 확인
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error detected:', error.message);
        
        // 세션 에러가 refresh token 관련이면 정리
        if (error.message.includes('refresh') || error.message.includes('token')) {
          await this.clearCorruptedAuth();
          return false;
        }
      }
      
      if (!session) {
        console.log('No active session found');
        return false;
      }
      
      // 사용자 정보 가져오기 시도
      const user = await this.getCurrentUser();
      if (user) {
        console.log('✅ Authentication repaired successfully');
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Auth repair failed:', error);
      await this.clearCorruptedAuth();
      return false;
    }
  }
}