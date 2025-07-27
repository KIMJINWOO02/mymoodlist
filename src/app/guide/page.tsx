'use client';

import React, { useState } from 'react';
import { ArrowLeft, Play, Download, Sparkles, Heart, Music, Zap, CreditCard, Settings, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  tips?: string[];
}

const guideSteps: GuideStep[] = [
  {
    id: '1',
    title: '회원가입 및 로그인',
    description: '무료 계정을 만들고 5개의 무료 토큰을 받아보세요',
    icon: <Sparkles className="w-6 h-6" />,
    details: [
      '홈페이지 우상단의 "회원가입" 버튼 클릭',
      '이메일 주소와 비밀번호 입력',
      '계정 생성 시 자동으로 5개 토큰 지급',
      '로그인하여 서비스 이용 시작'
    ],
    tips: [
      '로그인 시 생성한 음악 히스토리 확인 가능',
      '토큰 잔여량과 사용 내역 실시간 확인'
    ]
  },
  {
    id: '2',
    title: '감정 및 분위기 입력',
    description: '현재 기분이나 원하는 음악 분위기를 선택해주세요',
    icon: <Heart className="w-6 h-6" />,
    details: [
      '"나만의 음악 만들기" 버튼 클릭',
      '현재 상황이나 환경 선택 (집, 카페, 운동 등)',
      '기분이나 감정 상태 선택 (행복, 평온, 에너지틱 등)',
      '직접 입력 옵션으로 더 구체적인 감정 표현 가능'
    ],
    tips: [
      '구체적일수록 더 정확한 음악 생성',
      '여러 감정을 조합해서 표현해도 좋습니다'
    ]
  },
  {
    id: '3',
    title: '음악 스타일 설정',
    description: '장르, 악기, 사용 목적을 선택하여 음악 스타일을 완성하세요',
    icon: <Music className="w-6 h-6" />,
    details: [
      '원하는 음악 장르 선택 (팝, 재즈, 클래식, 일렉트로닉 등)',
      '주요 악기 선택 (피아노, 기타, 바이올린, 신시사이저 등)',
      '음악 사용 목적 설정 (휴식, 집중, 운동, BGM 등)',
      '추가 요청사항이나 특별한 요구사항 입력'
    ],
    tips: [
      '사용 목적에 맞는 장르 선택이 중요',
      '여러 악기 조합으로 풍부한 사운드 연출'
    ]
  },
  {
    id: '4',
    title: 'AI 음악 생성',
    description: 'AI가 입력된 정보를 분석하여 맞춤형 음악을 생성합니다',
    icon: <Zap className="w-6 h-6" />,
    details: [
      '토큰 1개 사용하여 음악 생성 시작',
      'AI가 감정 분석 및 프롬프트 생성 (30초-1분)',
      '고품질 음악 생성 진행 (2-4분)',
      '생성 완료 후 바로 재생 및 다운로드 가능'
    ],
    tips: [
      '생성 중에는 창을 닫지 마세요',
      '실패 시 토큰은 차감되지 않습니다'
    ]
  },
  {
    id: '5',
    title: '음악 재생 및 다운로드',
    description: '완성된 음악을 듣고 다운로드하여 자유롭게 활용하세요',
    icon: <Download className="w-6 h-6" />,
    details: [
      '생성된 음악 즉시 재생하여 확인',
      '고품질 MP3 파일(320kbps)로 다운로드',
      '상업적 용도 포함 자유로운 사용 가능',
      '계정에 1년간 음악 히스토리 보관'
    ],
    tips: [
      '다운로드한 파일명에 생성 날짜 포함',
      '마음에 드는 설정은 다시 사용해보세요'
    ]
  },
  {
    id: '6',
    title: '토큰 관리 및 충전',
    description: '토큰을 효율적으로 관리하고 필요시 추가 구매하세요',
    icon: <CreditCard className="w-6 h-6" />,
    details: [
      '헤더에서 현재 토큰 잔여량 확인',
      '토큰 부족 시 "토큰 충전" 버튼 클릭',
      '다양한 패키지 중 선택하여 구매',
      '신용카드/체크카드로 안전한 결제'
    ],
    tips: [
      '토큰은 유효기간이 없어 언제든 사용 가능',
      '많은 패키지일수록 할인 혜택 제공'
    ]
  }
];

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: '감정 기반 AI 분석',
    description: '사용자의 감정과 상황을 정확히 분석하여 최적의 음악 생성'
  },
  {
    icon: <Music className="w-5 h-5" />,
    title: '다양한 장르 지원',
    description: '팝부터 클래식까지 50+ 장르의 고품질 음악 생성'
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: '상업적 이용 가능',
    description: '저작권 걱정 없이 YouTube, 광고, 프로젝트에 자유 사용'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: '빠른 생성 속도',
    description: '3-5분 내에 완성도 높은 음악 생성 및 다운로드'
  }
];

export default function GuidePage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState('1');

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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                사용 가이드 📚
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                myMoodlist로 AI 음악을 만드는 간단한 방법을 알아보세요
              </p>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-600/20 dark:to-orange-600/20 rounded-2xl p-6 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Play className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />
                빠른 시작
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">1</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">회원가입</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">2</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">감정 입력</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-700 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">3</div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">음악 생성</p>
                </div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {guideSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300
                      ${activeStep === step.id
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                        : 'bg-amber-100/60 dark:bg-gray-800/60 text-amber-800 dark:text-gray-300 hover:bg-amber-200/80 dark:hover:bg-gray-700/80'
                      }
                    `}
                  >
                    {step.icon}
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">단계 {step.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Content */}
            {guideSteps.map((step) => (
              activeStep === step.id && (
                <div key={step.id} className="mb-12">
                  <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-2xl p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl flex items-center justify-center">
                        {step.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">상세 단계</h3>
                        <div className="space-y-3">
                          {step.details.map((detail, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700 dark:text-gray-300">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      {step.tips && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 팁</h3>
                          <div className="space-y-3">
                            {step.tips.map((tip, index) => (
                              <div key={index} className="bg-yellow-50/80 dark:bg-yellow-900/20 p-4 rounded-xl">
                                <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                주요 기능
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-amber-600 dark:text-amber-400">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Help */}
            <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                🎯 추가 도움말
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">음악 품질 최적화</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• 구체적인 감정과 상황 설명</li>
                    <li>• 원하는 악기와 장르 명확히 선택</li>
                    <li>• 사용 목적에 맞는 설정</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">문의 및 지원</h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p><strong>이메일:</strong> illumin0523@gmail.com</p>
                    <p><strong>운영시간:</strong> 평일 09:00 - 18:00</p>
                    <p><strong>FAQ:</strong> 자주 묻는 질문 페이지 참고</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}