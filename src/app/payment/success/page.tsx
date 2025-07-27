'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseTokens } from '@/contexts/SupabaseTokenContext';
import { useTokens } from '@/contexts/TokenContext';
import { CheckCircle, XCircle, ArrowLeft, Sparkles } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const { refreshTokens } = useSupabaseTokens();
  const { refreshTokens: refreshLocalTokens } = useTokens();
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // URL 파라미터에서 결제 정보 추출
        const orderId = searchParams.get('orderId');
        const paymentKey = searchParams.get('paymentKey');
        const amount = searchParams.get('amount');
        const status = searchParams.get('status');

        if (!orderId || !amount) {
          throw new Error('Missing payment information');
        }

        console.log('🔍 Verifying payment:', { orderId, paymentKey, amount, status });

        // 로컬 스토리지에서 결제 데이터 복원
        const storedPaymentData = localStorage.getItem(`payment_${orderId}`);
        let packageData = null;
        
        if (storedPaymentData) {
          packageData = JSON.parse(storedPaymentData);
          localStorage.removeItem(`payment_${orderId}`); // 사용 후 삭제
        }

        // 결제 검증 API 호출
        const verifyResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            paymentKey,
            amount: parseInt(amount),
            status,
            userId: authUser?.id,
            packageData,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (verifyResult.success) {
          setVerificationStatus('success');
          setPaymentInfo({
            orderId,
            amount: parseInt(amount),
            tokensAdded: verifyResult.tokensAdded,
            packageData,
          });

          // 토큰 정보 새로고침
          if (authUser) {
            await refreshTokens();
          } else {
            await refreshLocalTokens();
          }

        } else {
          throw new Error(verifyResult.error || 'Payment verification failed');
        }

      } catch (error) {
        console.error('❌ Payment verification error:', error);
        setVerificationStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams, authUser, refreshTokens, refreshLocalTokens]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">결제 처리 중...</h2>
          <p className="text-gray-600 dark:text-gray-400">결제 내역을 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-orange-50 dark:bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-100/60 to-orange-200 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,237,213,0.08),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-8 shadow-2xl shadow-amber-300/20 dark:shadow-gray-900/50 text-center">
            
            {verificationStatus === 'success' ? (
              <>
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  결제 완료!
                </h1>
                
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                  토큰 충전이 성공적으로 완료되었습니다.
                </p>

                {/* Payment Info */}
                {paymentInfo && (
                  <div className="bg-amber-50/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-amber-600 dark:text-yellow-400" />
                      <span>결제 정보</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">주문번호</span>
                        <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{paymentInfo.orderId}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">결제금액</span>
                        <span className="font-bold text-gray-900 dark:text-white">₩{formatPrice(paymentInfo.amount)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">충전된 토큰</span>
                        <span className="font-bold text-amber-600 dark:text-yellow-400">
                          +{paymentInfo.tokensAdded} 토큰
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGoHome}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    음악 생성하러 가기
                  </button>
                  
                  <button
                    onClick={handleGoBack}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>돌아가기</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Failed Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  결제 실패
                </h1>
                
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                  결제 처리 중 문제가 발생했습니다.<br />
                  다시 시도해주세요.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGoBack}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    다시 시도하기
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}