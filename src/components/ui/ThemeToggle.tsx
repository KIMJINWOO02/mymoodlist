import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'minimal' | 'premium' | 'floating';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium',
  variant = 'premium'
}) => {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // 컴포넌트 마운트 상태 확인 (hydration 문제 방지)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되지 않은 경우 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-14 h-14 text-lg'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return `
          bg-amber-100/90 hover:bg-amber-200/95 border border-amber-400/60 hover:border-amber-500/80
          dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:hover:border-white/30
          backdrop-blur-md rounded-xl transition-all duration-300
        `;
      case 'floating':
        return `
          bg-amber-100/80 hover:bg-amber-200/90 border border-amber-400/50 hover:border-amber-500/70
          dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-white/20
          backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 hover:scale-110
        `;
      default: // premium
        return `
          relative overflow-hidden rounded-2xl 
          bg-amber-100/90 hover:bg-amber-200/95 border border-amber-400/60 hover:border-amber-500/80
          dark:bg-gradient-to-r dark:from-white/5 dark:to-white/10 dark:hover:from-white/10 dark:hover:to-white/15
          dark:border-white/20 dark:hover:border-white/30
          backdrop-blur-xl shadow-lg hover:shadow-xl
          transition-all duration-500 transform hover:scale-105 active:scale-95
        `;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative flex items-center justify-center
        ${sizeClasses[size]} ${getVariantClasses()}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background Glow Effect */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"></div>
      )}

      {/* Icon Container */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Theme Icons with Smooth Transition */}
        <div className="relative">
          {/* Dark Mode Icon */}
          <Moon 
            className={`
              ${iconSizes[size]} absolute inset-0 text-amber-800 dark:text-white transition-all duration-500 ease-out
              ${theme === 'dark' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 rotate-180 scale-75'
              }
            `}
          />
          
          {/* Light Mode Icon */}
          <Sun 
            className={`
              ${iconSizes[size]} absolute inset-0 text-amber-800 dark:text-white transition-all duration-500 ease-out
              ${theme === 'light' 
                ? 'opacity-100 rotate-0 scale-100' 
                : 'opacity-0 -rotate-180 scale-75'
              }
            `}
          />

          {/* Placeholder for consistent sizing */}
          <div className={`${iconSizes[size]} opacity-0`} />
        </div>

        {/* Decorative Elements for Premium Variant */}
        {variant === 'premium' && (
          <>
            {/* Sparkle Effect */}
            <Palette className={`
              absolute top-1 right-1 w-2 h-2 text-amber-600/60 dark:text-white/40 opacity-0 
              transition-all duration-300 ${isHovered ? 'opacity-100' : ''}
            `} />
            
            {/* Animated Border */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
              ${isHovered ? 'opacity-100' : ''}
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              animate-shimmer
            `}></div>
          </>
        )}
      </div>

      {/* Ripple Effect on Click */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className={`
          absolute inset-0 bg-white/30 rounded-full scale-0 opacity-0
          group-active:scale-150 group-active:opacity-100
          transition-all duration-300
        `}></div>
      </div>

      {/* Glow Effect */}
      {variant === 'premium' && (
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 
          opacity-0 blur-xl transition-opacity duration-300 -z-10
          ${isHovered ? 'opacity-30' : ''}
        `}></div>
      )}
    </button>
  );
};