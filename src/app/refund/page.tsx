'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100/60 to-orange-200 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-amber-800 dark:text-amber-100 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>돌아가기</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-8 shadow-2xl">
            
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                환불정책 💳
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                myMoodlist 토큰 구매 환불 및 취소 정책
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>최종 수정일: 2025.01.20</span>
                <span>버전 1.0</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">환불 및 취소정책</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  myMoodlist는 전자상거래법 및 소비자보호법에 따라 이용자의 권익을 보호하고 공정한 거래를 위하여 다음과 같은 환불정책을 운영합니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">구독취소</h3>
                <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    서비스 구독을 취소하더라도 구독기간이 남았을 경우 해당 기간 동안 서비스 이용이 가능합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">환불</h3>
                <div className="bg-amber-50/60 dark:bg-amber-900/20 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    구매한 서비스는 소프트웨어 상품으로, 구매 후 서비스 적용 전 환불 가능합니다. 서비스 적용 후에는 환불이 불가합니다.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ 환불 가능한 경우</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">토큰 구매 후 음악 생성 서비스를 전혀 이용하지 않은 경우</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">시스템 오류로 인한 중복 결제 또는 서비스 이용 불가</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❌ 환불 불가능한 경우</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">구매한 토큰으로 음악 생성 서비스를 1회 이상 이용한 경우</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                          <span className="text-gray-700 dark:text-gray-300">이용자의 단순 변심이나 이용 계획 변경</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제3조(환불 신청 방법)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    환불을 원하시는 경우 다음 절차에 따라 신청해주시기 바랍니다.
                  </p>
                  <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">고객센터 연락</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">이메일을 통해 환불 신청</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">환불 검토</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">환불 조건 확인 및 승인 처리 (1-3영업일)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">환불 처리</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">승인 시 원 결제수단으로 환불 (3-7영업일)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  📞 환불 문의
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">환불과 관련한 문의사항이 있으시면 언제든 연락주세요.</p>
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>이메일:</strong> illumin0523@gmail.com</p>
                    <p><strong>운영시간:</strong> 평일 09:00 - 18:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  📅 부칙
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  본 환불정책은 2025년 1월 20일부터 적용됩니다.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}