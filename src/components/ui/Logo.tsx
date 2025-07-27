import React from 'react';
import { Waves, Sparkles, Circle } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
  showText?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'light',
  showText = true,
  onClick
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10 sm:w-12 sm:h-12',
    large: 'w-14 h-14 sm:w-16 sm:h-16'
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32
  };

  const textSizes = {
    small: 'text-base font-bold',
    medium: 'text-xl font-bold',
    large: 'text-3xl font-bold'
  };

  const colorClasses = variant === 'light' 
    ? 'text-white' 
    : 'text-gray-800';

  const isClickable = !!onClick;

  return (
    <div 
      className={`flex items-center space-x-3 ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}`}
      onClick={onClick}
    >
      {/* Modern Unique Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-600 dark:from-amber-500 dark:via-yellow-400 dark:to-orange-500 rounded-3xl flex items-center justify-center relative shadow-xl shadow-amber-400/40 dark:shadow-amber-300/50 overflow-hidden group`}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        
        {/* Custom geometric pattern representing mood waves */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Central circle */}
          <div className="w-3 h-3 bg-white dark:bg-amber-50 rounded-full absolute z-20 shadow-sm"></div>
          
          {/* Mood waves - concentric circles */}
          <div className="absolute w-8 h-8 border-2 border-white/70 dark:border-amber-50/80 rounded-full animate-pulse"></div>
          <div className="absolute w-6 h-6 border-2 border-white/85 dark:border-amber-50/90 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute w-4 h-4 border border-white dark:border-amber-50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Decorative particles */}
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-0 left-0 w-1 h-1 bg-violet-300 rounded-full animate-bounce" style={{animationDelay: '1.2s'}}></div>
        </div>
      </div>

      {/* Modern Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} leading-tight tracking-tight`}>
            <span className="bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-800 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent font-extrabold">
              myMoodlist
            </span>
          </span>
          <span className="text-xs leading-tight tracking-wider uppercase font-medium text-amber-700/90 dark:text-gray-300">
            AI Music Generator
          </span>
        </div>
      )}
    </div>
  );
};