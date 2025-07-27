import React, { useState } from 'react';
import { TokenPackage } from '@/types';
import { Zap, Star, Sparkles, Crown, CheckCircle } from 'lucide-react';

interface TokenPackageCardProps {
  package: TokenPackage;
  onSelect: (packageData: TokenPackage) => void;
  isSelected?: boolean;
}

export const TokenPackageCard: React.FC<TokenPackageCardProps> = ({ 
  package: pkg, 
  onSelect,
  isSelected = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleClick = () => {
    onSelect(pkg);
  };

  const getGradientColors = () => {
    if (pkg.id === 'starter') return 'from-amber-500 via-orange-500 to-yellow-500';
    if (pkg.id === 'basic') return 'from-violet-500 via-purple-500 to-pink-500';
    if (pkg.id === 'pro') return 'from-emerald-500 via-teal-500 to-cyan-500';
    return 'from-amber-500 via-orange-500 to-yellow-500';
  };

  const getCardBorderGlow = () => {
    if (pkg.id === 'starter') return 'shadow-amber-500/25 hover:shadow-amber-500/40';
    if (pkg.id === 'basic') return 'shadow-violet-500/25 hover:shadow-violet-500/40';
    if (pkg.id === 'pro') return 'shadow-emerald-500/25 hover:shadow-emerald-500/40';
    return 'shadow-amber-500/25 hover:shadow-amber-500/40';
  };

  return (
    <div 
      className={`
        group relative cursor-pointer transition-all duration-500 ease-out transform
        ${isSelected ? 'scale-105' : 'hover:scale-105'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow */}
      <div className={`
        absolute inset-0 rounded-3xl bg-gradient-to-r ${getGradientColors()} 
        opacity-0 blur-xl transition-opacity duration-500 
        ${isSelected || isHovered ? 'opacity-30' : 'group-hover:opacity-20'}
      `}></div>

      {/* Main Card */}
      <div className={`
        relative bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border-2 overflow-hidden
        transition-all duration-500 ease-out
        ${isSelected 
          ? `border-amber-500/90 dark:border-violet-400/70 shadow-2xl ${getCardBorderGlow()}` 
          : `border-amber-400/60 dark:border-gray-600/50 hover:border-amber-500/80 dark:hover:border-gray-500/70 shadow-lg ${getCardBorderGlow()}`
        }
      `}>
        {/* Animated Background */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${getGradientColors()} opacity-0 
          transition-opacity duration-500
          ${isSelected || isHovered ? 'opacity-10' : ''}
        `}></div>

        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg shadow-violet-500/50 border border-white/20">
              <Crown className="w-4 h-4" />
              <span>가장 인기</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Discount Badge */}
        {pkg.discount && (
          <div className="absolute top-6 right-6 z-10">
            <div className={`
              px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg border border-white/20
              ${pkg.discount >= 50 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/50' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/50'
              }
            `}>
              <div className="flex items-center space-x-1">
                <span>-{pkg.discount}%</span>
                {pkg.discount >= 50 && <Sparkles className="w-3 h-3" />}
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 text-center">
          {/* Token Icon with Animation */}
          <div className={`
            relative w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${getGradientColors()} shadow-lg transition-all duration-500
            ${isHovered ? 'shadow-xl scale-110 rotate-12' : ''}
          `}>
            <Zap className="w-10 h-10 text-white drop-shadow-lg" />
            <div className={`
              absolute inset-0 rounded-2xl bg-white/20 opacity-0 transition-opacity duration-300
              ${isHovered ? 'opacity-100' : ''}
            `}></div>
          </div>

          {/* Package Name */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide">
            {pkg.name}
          </h3>

          {/* Token Count with Enhanced Design */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-amber-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-amber-400/60 dark:border-gray-600/60">
              <Sparkles className="w-5 h-5 text-amber-700 dark:text-yellow-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                {pkg.tokens}
              </span>
              <span className="text-amber-800 dark:text-white/90 font-medium">토큰</span>
            </div>
          </div>

          {/* Price Section with Enhanced Layout */}
          <div className="mb-6">
            {pkg.originalPrice && (
              <div className="text-sm text-gray-600 dark:text-gray-400 line-through mb-2 font-medium">
                정가 ₩{formatPrice(pkg.originalPrice)}
              </div>
            )}
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ₩{formatPrice(pkg.price)}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 bg-amber-100/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-1 inline-block border border-amber-300/40 dark:border-gray-600/40">
              곡당 ₩{formatPrice(Math.round(pkg.price / pkg.tokens))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-line">
            {pkg.description}
          </p>

          {/* Enhanced Select Button */}
          <button className={`
            group/btn relative w-full py-4 rounded-2xl font-bold text-lg overflow-hidden
            transition-all duration-300 transform border-2
            ${isSelected
              ? `bg-gradient-to-r ${getGradientColors()} text-white border-white/30 shadow-lg ${getCardBorderGlow()}`
              : 'bg-amber-100/70 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white border-amber-400/60 dark:border-gray-600/60 hover:bg-amber-200/80 dark:hover:bg-gray-700/90 hover:border-amber-500/80 dark:hover:border-gray-500/80'
            }
          `}>
            {/* Button Background Animation */}
            <div className={`
              absolute inset-0 bg-gradient-to-r ${getGradientColors()} opacity-0 
              transition-opacity duration-300 group-hover/btn:opacity-100
            `}></div>
            
            {/* Button Content */}
            <div className="relative z-10 flex items-center justify-center space-x-2">
              {isSelected ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>선택됨</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />
                  <span>선택하기</span>
                </>
              )}
            </div>

            {/* Button Glow */}
            <div className={`
              absolute inset-0 rounded-2xl bg-gradient-to-r ${getGradientColors()} 
              opacity-0 blur-xl transition-opacity duration-300 group-hover/btn:opacity-30 -z-10
            `}></div>
          </button>
        </div>

        {/* Floating Particles */}
        {(isSelected || isHovered) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};