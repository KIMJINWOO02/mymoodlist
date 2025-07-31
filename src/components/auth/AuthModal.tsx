'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 AuthModal handleSubmit called', { mode, email });
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }
        if (password.length < 6) {
          throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
        }
        
        const result = await signUp(email, password, fullName);
        
        if (result.needsEmailConfirmation) {
          setSuccess('이메일 인증 링크를 발송했습니다. 이메일을 확인해주세요.');
        } else {
          onClose();
        }
      } else if (mode === 'signin') {
        console.log('🔑 Calling signIn function...');
        await signIn(email, password);
        console.log('✅ signIn completed, closing modal');
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccess('비밀번호 재설정 링크를 이메일로 발송했습니다.');
      }
    } catch (error: any) {
      console.error('❌ AuthModal error:', error);
      setError(error.message);
    } finally {
      console.log('🏁 AuthModal finally block, setting loading to false');
      setIsLoading(false);
    }
  };

  // 구글 로그인 함수 제거 (이메일 로그인만 사용)

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'signup' ? '회원가입' : mode === 'forgot' ? '비밀번호 찾기' : '로그인'}
                </h2>
                <p className="text-white/60 text-sm">
                  {mode === 'signup' ? '뮤즈웨이브에 오신 것을 환영합니다' : mode === 'forgot' ? '이메일로 재설정 링크를 보내드립니다' : '다시 오신 것을 환영합니다'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm">
              {success}
            </div>
          )}


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300"
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300"
                    placeholder="비밀번호를 입력하세요"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>처리 중...</span>
                </div>
              ) : (
                <>
                  {mode === 'signup' ? '회원가입' : mode === 'forgot' ? '재설정 링크 보내기' : '로그인'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="mt-6 text-center text-sm">
            {mode === 'signin' ? (
              <div className="space-y-2">
                <p className="text-white/60">
                  계정이 없으신가요?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    회원가입
                  </button>
                </p>
                <p className="text-white/60">
                  비밀번호를 잊으셨나요?{' '}
                  <button
                    onClick={() => switchMode('forgot')}
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    비밀번호 찾기
                  </button>
                </p>
              </div>
            ) : mode === 'signup' ? (
              <p className="text-white/60">
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  로그인
                </button>
              </p>
            ) : (
              <p className="text-white/60">
                <button
                  onClick={() => switchMode('signin')}
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  로그인으로 돌아가기
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};