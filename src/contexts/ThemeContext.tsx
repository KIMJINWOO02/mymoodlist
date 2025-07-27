'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // 에러 대신 기본값 반환 (경고 제거)
    return {
      theme: 'dark' as const,
      toggleTheme: () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      },
      setTheme: (theme: 'light' | 'dark') => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }
    };
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('musewave_theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setThemeState(initialTheme);
    setMounted(true);
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
      localStorage.setItem('musewave_theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="loading-container">{children}</div>;
  }

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-container ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};