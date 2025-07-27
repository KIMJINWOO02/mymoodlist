'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo size="small" variant="light" showText={true} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              단 10초만에 완벽한 AI 프로급 사운드를 만나세요. 100+ 스타일, 4K 고음질, 무제한 생성.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">AI 음악 생성</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">감정 분석</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">음원 다운로드</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">토큰 충전</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">자주 묻는 질문</Link></li>
              <li><Link href="/guide" className="text-gray-400 hover:text-white transition-colors text-sm">사용 가이드</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">이용약관</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">개인정보처리방침</Link></li>
              <li><Link href="/refund" className="text-gray-400 hover:text-white transition-colors text-sm">환불정책</Link></li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h3 className="text-white font-semibold mb-4">회사 정보</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p><strong>회사명:</strong> 일루민</p>
              <p><strong>대표자:</strong> 김진우</p>
              <p><strong>사업자등록번호:</strong> 873-24-01738</p>
              <p><strong>고객센터:</strong> illumin0523@gmail.com</p>
              <p><strong>운영시간:</strong> 평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 myMoodlist All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">🇰🇷</span>
                <span className="text-xs text-gray-400">한국어</span>
              </div>
              <div className="text-xs text-gray-400">
                서비스 정상 운영
              </div>
            </div>
          </div>
          
          {/* Legal Notice */}
          <div className="mt-4 text-xs text-gray-500 leading-relaxed">
            <p>경기도 수원시 영통구 센트럴타운로 85 202동 1205호</p>
            <p>myMoodlist © 2025 일루민 | 고객센터 : illumin0523@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};