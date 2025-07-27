'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TokenTransaction } from '@/types';
import { FREE_TOKENS } from '@/constants/tokenPackages';

interface TokenContextType {
  user: User | null;
  loading: boolean;
  refreshTokens: () => Promise<void>;
  useTokens: (amount: number, description: string) => Promise<boolean>;
  addTokens: (amount: number, description: string) => Promise<void>;
  getTransactionHistory: () => Promise<TokenTransaction[]>;
  refundTokens: (amount: number, description: string) => Promise<boolean>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user with free tokens (demo mode)
  useEffect(() => {
    const initializeUser = () => {
      const savedUser = localStorage.getItem('musewave_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Create new user with free tokens
        const newUser: User = {
          id: 'demo_user_' + Date.now(),
          tokens: FREE_TOKENS,
          createdAt: new Date(),
        };
        setUser(newUser);
        localStorage.setItem('musewave_user', JSON.stringify(newUser));
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const refreshTokens = async () => {
    // In a real app, this would fetch from your backend
    if (user) {
      const savedUser = localStorage.getItem('musewave_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  };

  const useTokens = async (amount: number, description: string): Promise<boolean> => {
    if (!user || user.tokens < amount) {
      return false;
    }

    const updatedUser = {
      ...user,
      tokens: user.tokens - amount,
    };

    setUser(updatedUser);
    localStorage.setItem('musewave_user', JSON.stringify(updatedUser));

    // Save transaction history
    const transaction: TokenTransaction = {
      id: 'tx_' + Date.now(),
      userId: user.id,
      type: 'usage',
      amount: -amount,
      description,
      createdAt: new Date(),
    };

    const transactions = JSON.parse(localStorage.getItem('musewave_transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('musewave_transactions', JSON.stringify(transactions));

    return true;
  };

  const addTokens = async (amount: number, description: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      tokens: user.tokens + amount,
      lastTokenPurchase: new Date(),
    };

    setUser(updatedUser);
    localStorage.setItem('musewave_user', JSON.stringify(updatedUser));

    // Save transaction history
    const transaction: TokenTransaction = {
      id: 'tx_' + Date.now(),
      userId: user.id,
      type: 'purchase',
      amount: amount,
      description,
      createdAt: new Date(),
    };

    const transactions = JSON.parse(localStorage.getItem('musewave_transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('musewave_transactions', JSON.stringify(transactions));
  };

  const getTransactionHistory = async (): Promise<TokenTransaction[]> => {
    const transactions = JSON.parse(localStorage.getItem('musewave_transactions') || '[]');
    return transactions.filter((tx: TokenTransaction) => tx.userId === user?.id);
  };

  // 토큰 환불 기능 (음악 생성 실패 시 사용)
  const refundTokens = async (amount: number, description: string): Promise<boolean> => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      tokens: user.tokens + amount, // 토큰 추가 (환불)
    };

    setUser(updatedUser);
    localStorage.setItem('musewave_user', JSON.stringify(updatedUser));

    // 환불 트랜잭션 기록
    const transaction: TokenTransaction = {
      id: 'tx_refund_' + Date.now(),
      userId: user.id,
      type: 'refund',
      amount: amount, // 양수로 기록
      description: `환불: ${description}`,
      createdAt: new Date(),
    };

    const transactions = JSON.parse(localStorage.getItem('musewave_transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('musewave_transactions', JSON.stringify(transactions));

    return true;
  };

  const value: TokenContextType = {
    user,
    loading,
    refreshTokens,
    useTokens,
    addTokens,
    getTransactionHistory,
    refundTokens,
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};