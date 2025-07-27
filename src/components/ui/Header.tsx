import React, { useState } from 'react';
import { Logo } from './Logo';
import { TokenDisplay } from './TokenDisplay';
import { ThemeToggle } from './ThemeToggle';
import { User, Settings, LogOut, Music, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseTokens } from '@/contexts/SupabaseTokenContext';

interface HeaderProps {
  onTokenChargeClick: () => void;
  onLogoClick?: () => void;
  showTokens?: boolean;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onTokenChargeClick,
  onLogoClick,
  showTokens = false,
  onProfileClick
}) => {
  const { user: authUser, signOut } = useAuth();
  const { tokens: supabaseTokens } = useSupabaseTokens();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <header className="absolute top-0 left-0 w-full p-6 z-50">
      <div className="flex items-center justify-between">
        <Logo 
          size="medium" 
          variant="light" 
          showText={true} 
          onClick={onLogoClick}
        />
        
        <div className="flex items-center space-x-4">
          <ThemeToggle size="medium" variant="floating" />
          {showTokens && (
            <TokenDisplay 
              onChargeClick={onTokenChargeClick}
              size="small"
            />
          )}
          
          {/* Profile Menu */}
          {authUser && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-stone-900/50 hover:bg-stone-900/70 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-200/30 hover:border-amber-200/50 text-amber-100 hover:text-amber-50 transition-all duration-300 hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{authUser.full_name || authUser.email?.split('@')[0]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-900/90 backdrop-blur-xl rounded-2xl border border-amber-200/25 shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-amber-200/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-amber-50 font-medium text-sm">{authUser.full_name || '사용자'}</div>
                        <div className="text-amber-200/70 text-xs">{authUser.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onProfileClick && onProfileClick();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-amber-100 hover:text-amber-50 hover:bg-stone-800/50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">내 정보 관리</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onTokenChargeClick();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-amber-100 hover:text-amber-50 hover:bg-stone-800/50 transition-colors text-left"
                    >
                      <Music className="w-4 h-4" />
                      <span className="text-sm">토큰 충전</span>
                    </button>
                    
                    <div className="border-t border-amber-200/20 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          signOut();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-amber-200/80 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">로그아웃</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};