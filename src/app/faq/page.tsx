'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Music, Sparkles, CreditCard, Download, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  // 서비스 소개
  {
    id: '1',
    category: '서비스 소개',
    question: 'myMoodlist가 무엇인가요?',
    answer: 'myMoodlist는 AI 기술을 활용하여 사용자의 감정과 분위기에 맞는 맞춤형 음악을 생성해주는 서비스입니다. 간단한 질문에 답하기만 하면 고품질의 프로페셔널한 음악을 몇 분 안에 만들어드립니다.'
  },
  {
    id: '2',
    category: '서비스 소개',
    question: '다른 음악 생성 서비스와 어떤 차이가 있나요?',
    answer: '저희는 감정 분석에 특화된 AI를 사용하여 더욱 정확하고 개인화된 음악을 생성합니다. 또한 업계 최고 수준의 음질과 다양한 장르를 지원하며, 생성된 음악은 완전히 저작권 걱정 없이 자유롭게 사용할 수 있습니다.'
  },
  
  // 음악 생성
  {
    id: '3',
    category: '음악 생성',
    question: '음악 생성은 어떻게 이루어지나요?',
    answer: '1) 현재 감정이나 원하는 분위기를 선택 2) 음악 사용 목적과 장르 설정 3) AI가 감정을 분석하고 최적의 음악 생성 4) 고품질 음원 완성 및 다운로드 - 전체 과정이 3-5분 정도 소요됩니다.'
  },
  {
    id: '4',
    category: '음악 생성',
    question: '한 번에 몇 개의 음악을 생성할 수 있나요?',
    answer: '토큰 1개당 음악 1곡을 생성할 수 있습니다. 여러 버전을 원하시면 각각 토큰을 사용하여 생성하실 수 있으며, 매번 조금씩 다른 느낌의 음악이 만들어집니다.'
  },
  {
    id: '5',
    category: '음악 생성',
    question: '생성된 음악의 길이는 얼마나 되나요?',
    answer: '기본적으로 2-3분 길이의 완성된 음악이 생성됩니다. 인트로, 메인 멜로디, 아웃트로가 포함된 완전한 형태의 곡으로 제공됩니다.'
  },
  
  // 토큰 시스템
  {
    id: '6',
    category: '토큰 시스템',
    question: '토큰이 무엇인가요?',
    answer: '토큰은 myMoodlist에서 음악을 생성하기 위해 필요한 디지털 이용권입니다. 음악 1곡 생성 시 토큰 1개가 사용되며, 다양한 패키지로 구매할 수 있습니다.'
  },
  {
    id: '7',
    category: '토큰 시스템',
    question: '토큰에 유효기간이 있나요?',
    answer: '아니요, 토큰은 유효기간이 없습니다. 언제든지 원할 때 사용하실 수 있으며, 계정에 영구적으로 보관됩니다.'
  },
  {
    id: '8',
    category: '토큰 시스템',
    question: '회원가입하면 무료 토큰을 받을 수 있나요?',
    answer: '네! 회원가입 시 5개의 무료 토큰을 지급해드립니다. 바로 음악 생성을 체험해보실 수 있습니다.'
  },
  
  // 결제 및 환불
  {
    id: '9',
    category: '결제 및 환불',
    question: '어떤 결제 방법을 지원하나요?',
    answer: '신용카드 및 체크카드 결제를 지원합니다. 안전한 결제를 위해 나이스페이먼츠 결제 시스템을 사용하고 있습니다.'
  },
  {
    id: '10',
    category: '결제 및 환불',
    question: '환불이 가능한가요?',
    answer: '토큰을 사용하지 않은 경우에는 환불이 가능합니다. 단, 토큰으로 음악을 1회 이상 생성한 경우에는 환불이 어렵습니다. 자세한 내용은 환불정책을 확인해주세요.'
  },
  
  // 음질 및 다운로드
  {
    id: '11',
    category: '음질 및 다운로드',
    question: '음악의 음질은 어떻게 되나요?',
    answer: '고품질 MP3 형식(320kbps)으로 제공되며, 스튜디오 퀄리티의 선명한 음질을 자랑합니다. 상업적 용도로도 충분히 사용할 수 있는 품질입니다.'
  },
  {
    id: '12',
    category: '음질 및 다운로드',
    question: '생성된 음악을 상업적으로 사용할 수 있나요?',
    answer: '네, 가능합니다! 생성된 음악은 100% 저작권 걱정 없이 YouTube, 팟캐스트, 광고, 개인 프로젝트 등에 자유롭게 사용하실 수 있습니다.'
  },
  {
    id: '13',
    category: '음질 및 다운로드',
    question: '다운로드한 음악을 다시 받을 수 있나요?',
    answer: '계정에 로그인하시면 과거에 생성한 음악들을 다시 다운로드하실 수 있습니다. 음악은 1년간 보관됩니다.'
  },
  
  // 기술적 문제
  {
    id: '14',
    category: '기술적 문제',
    question: '음악 생성이 실패했는데 토큰이 차감됐어요.',
    answer: '음악 생성이 실패한 경우 토큰은 차감되지 않습니다. 만약 시스템 오류로 토큰이 차감됐다면 고객센터로 연락주시면 즉시 복구해드리겠습니다.'
  },
  {
    id: '15',
    category: '기술적 문제',
    question: '로그인이 안 되거나 비밀번호를 잊어버렸어요.',
    answer: '로그인 화면에서 "비밀번호 찾기"를 클릭하시면 등록된 이메일로 재설정 링크를 보내드립니다. 그래도 해결되지 않으면 고객센터로 문의해주세요.'
  }
];

const categories = ['전체', '서비스 소개', '음악 생성', '토큰 시스템', '결제 및 환불', '음질 및 다운로드', '기술적 문제'];

export default function FAQPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = selectedCategory === '전체' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '서비스 소개': return <HelpCircle className="w-4 h-4" />;
      case '음악 생성': return <Music className="w-4 h-4" />;
      case '토큰 시스템': return <Sparkles className="w-4 h-4" />;
      case '결제 및 환불': return <CreditCard className="w-4 h-4" />;
      case '음질 및 다운로드': return <Download className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-gray-600/50 p-8 shadow-2xl">
            
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                자주 묻는 질문 💡
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                myMoodlist 이용 중 궁금한 점들을 빠르게 해결해보세요
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-full font-medium transition-all duration-300
                      ${selectedCategory === category
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'bg-amber-100/60 dark:bg-gray-800/60 text-amber-800 dark:text-gray-300 hover:bg-amber-200/80 dark:hover:bg-gray-700/80'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-amber-50/60 dark:bg-gray-800/60 rounded-2xl border border-amber-200/60 dark:border-gray-600/60 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full p-6 text-left hover:bg-amber-100/80 dark:hover:bg-gray-700/80 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                          {getCategoryIcon(faq.category)}
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-amber-600 dark:text-amber-400">
                        {expandedItems.includes(faq.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                      {faq.question}
                    </h3>
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-amber-200/60 dark:border-gray-600/60">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                📞 추가 문의
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                찾으시는 답변이 없으신가요? 언제든 문의해주세요.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>이메일:</strong> illumin0523@gmail.com</p>
                <p><strong>운영시간:</strong> 평일 09:00 - 18:00</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}