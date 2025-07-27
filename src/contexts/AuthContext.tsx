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
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};