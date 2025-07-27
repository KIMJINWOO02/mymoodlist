'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface TokenTransaction {
  id: string;
  user_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus';
  amount: number;
  description: string;
  package_name?: string;
  payment_method?: string;
  payment_amount?: number;
  music_generation_id?: string;
  created_at: string;
}

interface SupabaseTokenContextType {
  tokens: number;
  loading: boolean;
  refreshTokens: () => Promise<void>;
  useTokens: (amount: number, description: string, musicGenerationId?: string) => Promise<boolean>;
  addTokens: (amount: number, description: string, packageName?: string, paymentMethod?: string, paymentAmount?: number) => Promise<void>;
  getTransactionHistory: () => Promise<TokenTransaction[]>;
  refundTokens: (amount: number, description: string, originalTransactionId?: string) => Promise<boolean>;
}

const SupabaseTokenContext = createContext<SupabaseTokenContextType | undefined>(undefined);

export const useSupabaseTokens = () => {
  const context = useContext(SupabaseTokenContext);
  if (context === undefined) {
    throw new Error('useSupabaseTokens must be used within a SupabaseTokenProvider');
  }
  return context;
};

interface SupabaseTokenProviderProps {
  children: ReactNode;
}

export const SupabaseTokenProvider: React.FC<SupabaseTokenProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshTokens();
    } else {
      setTokens(0);
      setLoading(false);
    }
  }, [user, refreshTokens]);

  const refreshTokens = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('tokens')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setTokens(data.tokens);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const useTokens = async (amount: number, description: string, musicGenerationId?: string): Promise<boolean> => {
    if (!user || tokens < amount) {
      return false;
    }

    try {
      // 토큰 사용 트랜잭션 생성
      const { error: transactionError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'usage',
          amount: -amount,
          description,
          music_generation_id: musicGenerationId
        });

      if (transactionError) throw transactionError;

      // 토큰 잔액 새로고침
      await refreshTokens();
      return true;
    } catch (error) {
      console.error('Error using tokens:', error);
      return false;
    }
  };

  const addTokens = async (
    amount: number, 
    description: string, 
    packageName?: string, 
    paymentMethod?: string, 
    paymentAmount?: number
  ) => {
    if (!user) return;

    try {
      // 토큰 추가 트랜잭션 생성
      const { error: transactionError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'purchase',
          amount,
          description,
          package_name: packageName,
          payment_method: paymentMethod,
          payment_amount: paymentAmount
        });

      if (transactionError) throw transactionError;

      // 토큰 잔액 새로고침
      await refreshTokens();
    } catch (error) {
      console.error('Error adding tokens:', error);
      throw error;
    }
  };

  const getTransactionHistory = async (): Promise<TokenTransaction[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  // 토큰 환불 기능 (음악 생성 실패 시 사용)
  const refundTokens = async (amount: number, description: string, originalTransactionId?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // 환불 트랜잭션 생성
      const { error: transactionError } = await supabase
        .from('token_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'refund',
          amount: amount, // 양수로 환불
          description: `환불: ${description}`,
          music_generation_id: originalTransactionId
        });

      if (transactionError) throw transactionError;

      // 토큰 잔액 새로고침
      await refreshTokens();
      return true;
    } catch (error) {
      console.error('Error refunding tokens:', error);
      return false;
    }
  };

  const value: SupabaseTokenContextType = {
    tokens,
    loading,
    refreshTokens,
    useTokens,
    addTokens,
    getTransactionHistory,
    refundTokens,
  };

  return (
    <SupabaseTokenContext.Provider value={value}>
      {children}
    </SupabaseTokenContext.Provider>
  );
};