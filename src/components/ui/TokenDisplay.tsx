import React, { useState } from 'react';
import { Zap, Plus, Sparkles } from 'lucide-react';
import { useTokens } from '@/contexts/TokenContext';

interface TokenDisplayProps {
  onChargeClick: () => void;
  size?: 'small' | 'medium';
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ 
  onChargeClick, 
  size = 'medium' 
}) => {
  const { user, loading } = useTokens();
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={`${size === 'small' ? 'w-24 h-8' : 'w-28 h-10'} bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
        <div className={`${size === 'small' ? 'w-16 h-8' : 'w-20 h-10'} bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse`}></div>
      </div>
    );
  }

  const sizeClasses = size === 'small' 
    ? 'text-sm px-4 py-2' 
    : 'text-base px-5 py-2.5';

  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center space-x-3 group">
      {/* Token Balance - Premium Glassmorphism Design */}
      <div className={`
        relative overflow-hidden rounded-2xl ${sizeClasses}
        bg-gradient-to-r from-slate-800/80 to-slate-900/80
        backdrop-blur-xl border border-white/20
        shadow-lg shadow-black/25
        flex items-center space-x-3
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-black/30
        hover:border-white/30 hover:scale-[1.02]
        group-hover:bg-gradient-to-r group-hover:from-slate-700/80 group-hover:to-slate-800/80
      `}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-purple-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        
        {/* Lightning Icon with Glow Effect */}
        <div className="relative">
          <Zap className={`${iconSize} text-yellow-400 drop-shadow-sm transition-all duration-300 group-hover:text-yellow-300 group-hover:drop-shadow-lg`} />
          <div className={`absolute inset-0 ${iconSize} bg-yellow-400/30 rounded-full blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
        </div>

        {/* Token Count with Enhanced Typography */}
        <div className="relative flex items-center space-x-1">
          <span className="font-bold text-white tracking-wide drop-shadow-sm">
            {user?.tokens || 0}
          </span>
          <span className="text-xs text-white/70 font-medium tracking-wider uppercase">
            tokens
          </span>
        </div>

        {/* Sparkle Effect */}
        <Sparkles className={`${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'} text-white/40 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-yellow-300`} />
      </div>

      {/* Charge Button - Ultra Premium Design */}
      <button
        onClick={onChargeClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative overflow-hidden rounded-2xl ${sizeClasses}
          bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
          hover:from-amber-400 hover:via-orange-400 hover:to-red-400
          text-white font-bold tracking-wide
          shadow-lg shadow-orange-500/25
          hover:shadow-xl hover:shadow-orange-500/40
          transform transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          flex items-center space-x-2
          border border-white/20 hover:border-white/30
          group/button
        `}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100"></div>
        
        {/* Shimmer Effect */}
        <div className={`absolute inset-0 -translate-x-full transition-transform duration-700 ease-out ${isHovered ? 'translate-x-full' : ''}`}>
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
        </div>

        {/* Plus Icon with Rotation Effect */}
        <Plus className={`${iconSize} transition-transform duration-300 group-hover/button:rotate-90 drop-shadow-sm relative z-10`} />
        
        {/* Button Text */}
        <span className="relative z-10 drop-shadow-sm">충전</span>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 opacity-0 blur-xl transition-opacity duration-300 group-hover/button:opacity-30 -z-10"></div>
      </button>
    </div>
  );
};