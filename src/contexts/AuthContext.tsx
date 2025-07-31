'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, type AuthUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  // signInWithGoogle: () => Promise<any>; // 임시 비활성화
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<AuthUser | null>;
  refreshUser: () => Promise<void>;
  repairAuth: () => Promise<boolean>;
  clearCorruptedAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 사용자 상태 확인
    const initializeAuth = async () => {
      try {
        let currentUser = await AuthService.getCurrentUser();
        
        // 사용자 정보를 가져올 수 없으면 인증 복구 시도
        if (!currentUser) {
          console.log('🔧 Attempting to repair authentication...');
          const repaired = await AuthService.repairAuth();
          if (repaired) {
            currentUser = await AuthService.getCurrentUser();
          }
        }
        
        setUser(currentUser);
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        
        // refresh token 에러인 경우 정리
        if (error?.message?.includes('refresh') || error?.message?.includes('Invalid Refresh Token')) {
          console.log('🧹 Clearing corrupted auth data due to refresh token error');
          await AuthService.clearCorruptedAuth();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 인증 상태 변경 감지
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signUp(email, password, fullName);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signIn(email, password);
      
      // 로그인 성공 시 사용자 정보 업데이트
      console.log('🔍 SignIn result:', result);
      if (result && result.user) {
        console.log('✅ Setting user from result.user:', result.user);
        setUser(result.user);
      } else if (result && result.session && result.session.user) {
        console.log('✅ Setting user from result.session.user:', result.session.user);
        setUser(result.session.user);
      } else {
        console.log('⚠️ No user found in result:', result);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  // const signInWithGoogle = async () => {
  //   구글 로그인 임시 비활성화
  // };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    const updatedUser = await AuthService.updateProfile(updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const repairAuth = async () => {
    try {
      const repaired = await AuthService.repairAuth();
      if (repaired) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
      return repaired;
    } catch (error) {
      console.error('Repair auth error:', error);
      return false;
    }
  };

  const clearCorruptedAuth = async () => {
    try {
      await AuthService.clearCorruptedAuth();
      setUser(null);
    } catch (error) {
      console.error('Clear corrupted auth error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    // signInWithGoogle, // 임시 비활성화
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
    repairAuth,
    clearCorruptedAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};