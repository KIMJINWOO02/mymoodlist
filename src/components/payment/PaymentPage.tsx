import React, { useState } from 'react';
import { TokenPackage, PaymentResult } from '@/types';
import { TOKEN_PACKAGES } from '@/constants/tokenPackages';
import { TokenPackageCard } from './TokenPackageCard';
import { useTokens } from '@/contexts/TokenContext';
import { useSupabaseTokens } from '@/contexts/SupabaseTokenContext';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useToastHelpers } from '@/components/ui/Toast';
import { ArrowLeft, CreditCard, Smartphone, Building, Shield, Star, CheckCircle, Sparkles } from 'lucide-react';

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onBack, onSuccess }) => {
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'phone' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // 인증 상태에 따라 적절한 토큰 시스템 사용
  const { user: authUser } = useAuth();
  const { addTokens: addLocalTokens } = useTokens();
  const { addTokens: addSupabaseTokens } = useSupabaseTokens();
  const { error: showError, warning: showWarning } = useToastHelpers();

  const handlePackageSelect = (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;
    if (!agreeToTerms) {
      showWarning('약관 동의 필요', '이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 결제 초기화 API 호출
      const initResponse = await fetch('/api/payment/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          amount: selectedPackage.price,
          tokens: selectedPackage.tokens,
          userId: authUser?.id,
          paymentMethod,
        }),
      });

      const initData = await initResponse.json();

      if (!initData.success) {
        throw new Error('Payment initialization failed');
      }

      // 2. 결제 데이터 임시 저장 (결제 성공 페이지에서 사용)
      localStorage.setItem(`payment_${initData.orderId}`, JSON.stringify({
        name: selectedPackage.name,
        tokens: selectedPackage.tokens,
        paymentMethod,
      }));

      // 3. 나이스페이 결제 호출
      if (typeof window !== 'undefined' && (window as any).AUTHNICE) {
        const { AUTHNICE } = window as any;
        
        AUTHNICE.requestPay({
          clientId: initData.clientId,
          method: paymentMethod,
          orderId: initData.orderId,
          amount: initData.amount,
          goodsName: initData.goodsName,
          returnUrl: initData.returnUrl,
          fnError: (result: any) => {
            console.error('Payment error:', result);
            showError('결제 실패', `결제 중 오류가 발생했습니다: ${result.msg}`);
            // 실패 시 임시 저장 데이터 삭제
            localStorage.removeItem(`payment_${initData.orderId}`);
            setIsProcessing(false);
          }
        });

        // 결제 창이 열렸으므로 로딩 상태 해제
        // 실제 결제 완료는 returnUrl에서 처리됨
        setIsProcessing(false);
        
      } else {
        throw new Error('Nicepay script not loaded');
      }

    } catch (error) {
      console.error('Payment error:', error);
      showError('결제 오류', '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-orange-50 dark:bg-black">
      {/* Premium Background - Theme Adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-100/60 via-yellow-100/50 to-orange-200 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.35),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(202,138,4,0.30),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,237,213,0.08),transparent_70%)]"></div>
      </div>

      {/* Header with Enhanced Glassmorphism */}
      <header className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between">
        <div className="bg-white/90 dark:bg-stone-900/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-400/60 dark:border-amber-200/30">
          <Logo size="small" variant="light" showText={true} />
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle size="medium" variant="floating" />
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 bg-white/90 dark:bg-stone-900/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-400/60 dark:border-amber-200/30 text-amber-800 dark:text-amber-100 hover:bg-amber-100/95 dark:hover:bg-stone-900/70 hover:border-amber-500/80 dark:hover:border-amber-200/50 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">돌아가기</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Page Title */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600/25 to-orange-600/25 dark:from-amber-600/25 dark:to-orange-600/25 backdrop-blur-xl rounded-full px-6 py-2 border border-amber-400/50 dark:border-amber-200/30 mb-6">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-300" />
              <span className="text-amber-800 dark:text-amber-100 font-medium">프리미엄 토큰 패키지</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 dark:from-amber-50 dark:via-orange-100 dark:to-amber-100 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm">
              토큰 충전하기
            </h1>
            <p className="text-xl text-amber-800/90 dark:text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
              AI 음악 생성을 위한 토큰을 구매하고, 무제한으로 창작의 세계를 탐험해보세요
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 mt-8">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-white/60">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">안전한 결제</span>
              </div>
              <div className="w-1 h-1 bg-amber-600/30 dark:bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2 text-amber-700 dark:text-white/60">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium">프리미엄 품질</span>
              </div>
              <div className="w-1 h-1 bg-amber-600/30 dark:bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2 text-amber-700 dark:text-white/60">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">즉시 충전</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Package Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-8 shadow-2xl shadow-amber-300/20 dark:shadow-gray-900/50">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    토큰 패키지 선택
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TOKEN_PACKAGES.map((pkg) => (
                    <TokenPackageCard
                      key={pkg.id}
                      package={pkg}
                      onSelect={handlePackageSelect}
                      isSelected={selectedPackage?.id === pkg.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-8 shadow-2xl shadow-amber-300/20 dark:shadow-gray-900/50 sticky top-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    결제 정보
                  </h2>
                </div>

                {selectedPackage ? (
                  <>
                    {/* Selected Package Summary */}
                    <div className="relative bg-amber-50/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-amber-400/60 dark:border-gray-600/60 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-violet-500/10 dark:to-purple-500/10"></div>
                      <div className="relative z-10">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span>선택된 패키지</span>
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-800 dark:text-gray-200">{selectedPackage.name}</span>
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
                              <span className="font-bold text-amber-700 dark:text-yellow-400">{selectedPackage.tokens} 토큰</span>
                            </div>
                          </div>
                          
                          {selectedPackage.originalPrice && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">정가</span>
                              <span className="text-gray-600 dark:text-gray-400 line-through">₩{formatPrice(selectedPackage.originalPrice)}</span>
                            </div>
                          )}
                          
                          <div className="border-t border-amber-400/60 dark:border-gray-600/60 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-900 dark:text-white font-medium">결제 금액</span>
                              <div className="text-right">
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                  ₩{formatPrice(selectedPackage.price)}
                                </span>
                                {selectedPackage.originalPrice && (
                                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    {selectedPackage.discount}% 할인 적용
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-8">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>결제 수단 선택</span>
                      </h3>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'card', icon: CreditCard, label: '신용/체크카드', desc: '국내외 모든 카드' }
                        ].map((method) => (
                          <label key={method.id} className="group cursor-pointer">
                            <div className={`
                              relative p-4 rounded-2xl border transition-all duration-300
                              ${paymentMethod === method.id 
                                ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 border-blue-400/60 shadow-lg shadow-blue-500/25' 
                                : 'bg-amber-100/60 dark:bg-gray-800/60 border-amber-400/40 dark:border-gray-600/40 hover:bg-amber-200/70 dark:hover:bg-gray-700/70 hover:border-amber-500/60 dark:hover:border-gray-500/60'
                              }
                            `}>
                              <div className="flex items-center space-x-4">
                                <input
                                  type="radio"
                                  value={method.id}
                                  checked={paymentMethod === method.id}
                                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                                  className="hidden"
                                />
                                <div className={`
                                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                  ${paymentMethod === method.id 
                                    ? 'bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg' 
                                    : 'bg-amber-200/60 dark:bg-gray-700/80 group-hover:bg-amber-300/70 dark:group-hover:bg-gray-600/90'
                                  }
                                `}>
                                  <method.icon className="w-5 h-5 text-gray-800 dark:text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 dark:text-white">{method.label}</div>
                                  <div className="text-sm text-gray-700 dark:text-gray-300">{method.desc}</div>
                                </div>
                                <div className={`
                                  w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                                  ${paymentMethod === method.id 
                                    ? 'border-blue-400 bg-blue-400' 
                                    : 'border-amber-500/80 dark:border-gray-500/80'
                                  }
                                `}>
                                  {paymentMethod === method.id && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing || !agreeToTerms}
                      className={`
                        group relative w-full py-4 rounded-2xl font-bold text-lg overflow-hidden
                        transition-all duration-300 transform
                        ${isProcessing || !agreeToTerms
                          ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]'
                        }
                      `}
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      
                      {/* Button Content */}
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>결제 처리 중...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            <span>₩{formatPrice(selectedPackage.price)} 안전하게 결제하기</span>
                          </>
                        )}
                      </div>

                      {/* Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30 -z-10"></div>
                    </button>

                    {/* Terms Agreement */}
                    <div className="mt-6">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          <a href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors">이용약관</a> 및 <a href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors">개인정보처리방침</a>에 동의합니다. (필수)
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100/70 dark:bg-gray-700/70 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-amber-600 dark:text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-gray-200 text-lg font-medium">패키지를 선택해주세요</p>
                    <p className="text-gray-700 dark:text-gray-400 text-sm mt-2">왼쪽에서 원하는 토큰 패키지를 선택하세요</p>
                  </div>
                )}
              </div>

              {/* Benefits Info */}
              <div className="bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-6 shadow-2xl shadow-amber-300/20 dark:shadow-gray-900/50 mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                  <span>토큰 혜택</span>
                </h3>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    { icon: '♾️', text: '토큰은 유효기간 없이 사용 가능' },
                    { icon: '🎵', text: '음악 1곡 생성 시 토큰 1개 사용' },
                    { icon: '💰', text: '더 많은 패키지일수록 할인 혜택' },
                    { icon: '🛡️', text: '24시간 고객지원 서비스' },
                    { icon: '⚡', text: '즉시 충전, 바로 사용 가능' }
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3 group">
                      <span className="text-lg">{benefit.icon}</span>
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};