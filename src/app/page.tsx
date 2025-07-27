'use client';

import React, { useState } from 'react';
import { FormData, MusicGenerationResult } from '@/types';
import { MultiStepForm } from '@/components/MultiStepForm';
import { ResultPage } from '@/components/ResultPage';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ApiService } from '@/lib/api';
import { Music, Sparkles, Heart, Zap, User, LogIn } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { PaymentPage } from '@/components/payment/PaymentPage';
import { PaymentSuccessPage } from '@/components/payment/PaymentSuccessPage';
import { AuthModal } from '@/components/auth/AuthModal';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { useTokens } from '@/contexts/TokenContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseTokens } from '@/contexts/SupabaseTokenContext';
import { TOKENS_PER_GENERATION } from '@/constants/tokenPackages';
import { useToastHelpers } from '@/components/ui/Toast';

type AppState = 'landing' | 'form' | 'loading' | 'result' | 'payment' | 'paymentSuccess' | 'profile';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [musicResult, setMusicResult] = useState<MusicGenerationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [tokensAdded, setTokensAdded] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // 기존 localStorage 기반 토큰 시스템
  const { user: localUser, useTokens: consumeTokens, refundTokens: refundLocalTokens } = useTokens();
  
  // Supabase 인증 시스템
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const { tokens: supabaseTokens, useTokens: consumeSupabaseTokens, refundTokens: refundSupabaseTokens } = useSupabaseTokens();
  
  // Toast 알림 시스템
  const { error: showError, warning: showWarning, success: showSuccess } = useToastHelpers();

  const handleGetStarted = () => {
    if (!authUser) {
      // 로그인하지 않은 경우 로그인 모달 표시
      setAuthMode('signin');
      setShowAuthModal(true);
      return;
    }
    setAppState('form');
  };

  const handleFormComplete = async (formData: FormData) => {
    // 로그인된 사용자는 Supabase 토큰, 비로그인 사용자는 로컬 토큰 사용
    const currentTokens = authUser ? supabaseTokens : (localUser?.tokens || 0);
    const useTokensFunction = authUser ? consumeSupabaseTokens : consumeTokens;
    const refundTokensFunction = authUser ? refundSupabaseTokens : refundLocalTokens;

    // Check if user has enough tokens
    if (currentTokens < TOKENS_PER_GENERATION) {
      showWarning('토큰 부족', `음악 생성을 위해 ${TOKENS_PER_GENERATION}개의 토큰이 필요합니다. 토큰을 충전해주세요.`);
      setAppState('payment');
      return;
    }

    setAppState('loading');
    setLoadingMessage('음악 생성을 준비하고 있습니다...');

    // 토큰 차감 없이 먼저 음악 생성 시도
    let musicGenerationSuccess = false;
    let generatedResult = null;

    try {
      setLoadingMessage('감정을 분석하고 프롬프트를 생성하고 있습니다...');

      // Generate prompt with Gemini
      const prompt = await ApiService.generatePrompt(formData);
      setLoadingMessage('AI가 음악을 생성하고 있습니다...');

      // Generate music with Suno using Gemini's prompt
      const result = await ApiService.generateMusic(formData, prompt);
      
      // 음악 생성 성공 확인
      if (result && result.audioUrl) {
        musicGenerationSuccess = true;
        generatedResult = result;
        setLoadingMessage('음악 생성이 완료되었습니다. 토큰을 차감합니다...');

        // 성공했을 때만 토큰 차감
        const tokenUsed = await useTokensFunction(TOKENS_PER_GENERATION, '음악 생성 성공');
        if (!tokenUsed) {
          showError('토큰 차감 오류', '토큰 차감 중 오류가 발생했습니다. 고객지원에 문의해주세요.');
          setAppState('form');
          return;
        }

        setMusicResult(result);
        setAppState('result');
      } else {
        throw new Error('음악 생성 결과가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      
      // 음악 생성 실패 시에는 토큰 차감 없음
      if (!musicGenerationSuccess) {
        showError('음악 생성 실패', '음악 생성에 실패했습니다. 토큰은 차감되지 않았습니다. 다시 시도해주세요.');
      } else {
        // 토큰은 차감되었지만 결과 저장 실패 (매우 드문 경우)
        showError('처리 오류', '음악 생성은 성공했으나 결과 처리 중 오류가 발생했습니다. 고객지원에 문의해주세요.');
      }
      setAppState('form');
    }
  };

  const handleRestart = () => {
    setAppState('landing');
    setMusicResult(null);
  };

  const handleTokenCharge = () => {
    setAppState('payment');
  };

  const handlePaymentSuccess = () => {
    const lastPackage = JSON.parse(localStorage.getItem('lastPackagePurchase') || '{}');
    setTokensAdded(lastPackage.tokens || 0);
    setAppState('paymentSuccess');
  };

  const handlePaymentBack = () => {
    setAppState('landing');
  };

  const handleContinueAfterPayment = () => {
    setAppState('form');
  };

  const handleProfileClick = () => {
    setAppState('profile');
  };

  if (appState === 'form') {
    return <MultiStepForm onComplete={handleFormComplete} onTokenChargeClick={handleTokenCharge} />;
  }

  if (appState === 'loading') {
    return <LoadingState message={loadingMessage} />;
  }

  if (appState === 'result' && musicResult) {
    return <ResultPage result={musicResult} onRestart={handleRestart} />;
  }

  if (appState === 'payment') {
    return (
      <PaymentPage 
        onBack={handlePaymentBack} 
        onSuccess={handlePaymentSuccess} 
      />
    );
  }

  if (appState === 'paymentSuccess') {
    const currentTokens = authUser ? supabaseTokens : (localUser?.tokens || 0);
    return (
      <PaymentSuccessPage
        tokensAdded={tokensAdded}
        newBalance={currentTokens}
        onContinue={handleContinueAfterPayment}
        onHome={handleRestart}
      />
    );
  }

  if (appState === 'profile') {
    return (
      <ProfilePage
        onBack={() => setAppState('landing')}
        onTokenChargeClick={handleTokenCharge}
      />
    );
  }

  const handleLogoClick = () => {
    setAppState('landing');
  };

  // Landing Page
  return (
    <div className="min-h-screen relative">
      {/* Header with Logo and Token Display */}
      <Header 
        onTokenChargeClick={handleTokenCharge} 
        onLogoClick={handleLogoClick}
        onProfileClick={handleProfileClick}
        showTokens={false}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Background Elements - Theme Adaptive */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900/30 to-stone-800 dark:from-stone-900 dark:via-amber-900/30 dark:to-stone-800 light:from-orange-50 light:via-amber-100/60 light:to-orange-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)] light:bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.30),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)] light:bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.25),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)] light:bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.40),transparent_70%)]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="mb-16">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  {/* Custom mood wave pattern for hero */}
                  <div className="relative flex items-center justify-center">
                    {/* Central core */}
                    <div className="w-4 h-4 bg-white rounded-full absolute z-20 shadow-lg"></div>
                    
                    {/* Animated mood waves */}
                    <div className="absolute w-12 h-12 border-3 border-white/40 rounded-full animate-pulse"></div>
                    <div className="absolute w-8 h-8 border-3 border-white/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute w-6 h-6 border-2 border-white/80 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    
                    {/* Floating mood particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.8s'}}></div>
                    <div className="absolute top-0 left-1 w-1.5 h-1.5 bg-violet-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1.2s'}}></div>
                    <div className="absolute bottom-0 right-1 w-1 h-1 bg-emerald-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1.5s'}}></div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-amber-800 via-yellow-600 to-orange-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent drop-shadow-sm">
                myMoodlist
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-amber-800 dark:text-white mb-4 font-medium drop-shadow-sm">
              감정으로 완성하는 나만의 음악
            </p>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-amber-700/95 dark:text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              당신의 감정, 분위기, 상황을 입력하면 AI가 완벽한 고품질 음악을 생성합니다
              <br />
              <span className="text-yellow-700 dark:text-gray-300 font-semibold">프로페셔널 음원 • 즉시 다운로드 • 무제한 재생</span>
            </p>
          </div>

          {/* Premium Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 - 감정 분석 */}
            <div className="group relative">
              <div className="bg-orange-50/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-300/50 dark:border-gray-600/50 hover:border-amber-400/70 dark:hover:border-gray-500/70 transition-all duration-300 hover:bg-orange-100/90 dark:hover:bg-gray-800/80 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-white mb-3">감정 분석 AI</h3>
                <p className="text-amber-800/90 dark:text-gray-200 leading-relaxed text-sm">
                  고도화된 AI가 당신의 감정, 분위기, 상황을 깊이 있게 분석하여 
                  <span className="text-amber-300 dark:text-amber-300 light:text-amber-700 font-semibold"> 완벽한 음악적 표현</span>으로 변환합니다
                </p>
              </div>
            </div>

            {/* Feature 2 - 고품질 음원 */}
            <div className="group relative">
              <div className="bg-orange-50/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-300/50 dark:border-gray-600/50 hover:border-amber-400/70 dark:hover:border-gray-500/70 transition-all duration-300 hover:bg-orange-100/90 dark:hover:bg-gray-800/80 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-white mb-3">프로급 음질</h3>
                <p className="text-amber-800/90 dark:text-gray-200 leading-relaxed text-sm">
                  업계 최고 수준의 AI 음악 엔진으로 
                  <span className="text-orange-700 dark:text-gray-100 font-semibold"> 스튜디오 퀄리티</span>의 음원을 
                  몇 분 안에 생성합니다
                </p>
              </div>
            </div>

            {/* Feature 3 - 다운로드 */}
            <div className="group relative">
              <div className="bg-orange-50/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border border-amber-300/50 dark:border-gray-600/50 hover:border-amber-400/70 dark:hover:border-gray-500/70 transition-all duration-300 hover:bg-orange-100/90 dark:hover:bg-gray-800/80 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-white mb-3">소장 & 활용</h3>
                <p className="text-amber-800/90 dark:text-gray-200 leading-relaxed text-sm">
                  생성된 음악을 
                  <span className="text-yellow-700 dark:text-gray-100 font-semibold"> 고음질로 다운로드</span>하여 
                  영상, 팟캐스트, 개인 프로젝트에 자유롭게 활용하세요
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-8">
            {authUser ? (
              <div className="space-y-6">
                {/* 로그인된 사용자 */}
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="flex items-center space-x-3 bg-stone-900/50 backdrop-blur-xl rounded-2xl px-6 py-3 border border-amber-200/30">
                    <User className="w-5 h-5 text-amber-100" />
                    <span className="text-amber-50 font-medium">{authUser.full_name || authUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-600/30 to-orange-600/30 backdrop-blur-xl rounded-2xl px-6 py-3 border border-amber-400/40">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 font-bold">{supabaseTokens} 토큰</span>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button
                    onClick={handleGetStarted}
                    className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white px-8 md:px-16 py-4 md:py-5 rounded-full text-lg md:text-2xl font-bold hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    🎵 나만의 음악 만들기
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <button
                    onClick={() => setAppState('payment')}
                    className="text-amber-300 hover:text-amber-200 transition-colors underline font-medium"
                  >
                    토큰 충전하기
                  </button>
                  <span className="text-amber-200/40">•</span>
                  <button
                    onClick={signOut}
                    className="text-amber-100/80 hover:text-amber-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 비로그인 사용자 */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-100 to-orange-200 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button
                    onClick={handleGetStarted}
                    className="relative bg-amber-50 text-amber-900 px-8 md:px-16 py-4 md:py-5 rounded-full text-lg md:text-2xl font-bold hover:bg-amber-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    🎵 무료로 시작하기
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <button
                    onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                    className="flex items-center space-x-2 text-amber-300 hover:text-amber-200 transition-colors font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>로그인</span>
                  </button>
                  <span className="text-amber-200/40">•</span>
                  <button
                    onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                    className="text-amber-100/80 hover:text-amber-50 transition-colors font-medium"
                  >
                    회원가입
                  </button>
                </div>
                
                <div className="bg-stone-900/40 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/20 max-w-2xl mx-auto">
                  <p className="text-amber-100/90 text-center">
                    <span className="text-amber-300 font-semibold">✨ 회원가입 혜택</span><br />
                    5개 무료 토큰 지급 • 고품질 다운로드 • 무제한 재생
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 to-amber-900/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-50 mb-6">
              간단한 <span className="text-amber-300">단 3단계</span>로 완성
            </h2>
            <p className="text-lg sm:text-xl text-amber-100/80 max-w-2xl mx-auto px-4">
              복잡한 설정 없이, 감정만 입력하면 바로 완성되는 나만의 음악
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-amber-50 mb-4">감정 입력</h3>
              <p className="text-amber-100/80 leading-relaxed">
                지금 기분, 원하는 분위기, 사용 목적을
                <br />간단한 질문으로 알려주세요
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-amber-50 mb-4">AI 분석</h3>
              <p className="text-amber-100/80 leading-relaxed">
                고도화된 AI가 감정을 분석하고
                <br />완벽한 음악 스타일을 설계합니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-amber-50 mb-4">음악 완성</h3>
              <p className="text-amber-100/80 leading-relaxed">
                프로급 품질의 음악이 생성되고
                <br />바로 듣고 다운로드할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}