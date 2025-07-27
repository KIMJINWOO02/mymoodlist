'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
                개인정보처리방침 🔒
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                myMoodlist 개인정보 수집 및 이용에 관한 정책
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>최종 수정일: 2025.01.20</span>
                <span>버전 1.0</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">개인정보처리방침</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  일루민(이하 &quot;회사&quot;)는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제1조(개인정보의 처리목적)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-xl p-4">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">회원 가입 및 관리</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">AI 음악 생성 서비스 제공</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">결제 및 정산 서비스</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">고객 지원 및 문의 응답</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">서비스 개선 및 새로운 서비스 개발</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제2조(개인정보의 처리 및 보유기간)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>
                  <div className="bg-green-50/60 dark:bg-green-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">보유기간</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">회원 정보</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">회원 탈퇴 시까지</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">결제 정보</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">5년 (전자상거래법)</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">생성된 음악</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">1년</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">접속 로그</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">3개월</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제3조(정보주체와 법정대리인의 권리·의무 및 행사방법)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                  </p>
                  <div className="bg-purple-50/60 dark:bg-purple-900/20 rounded-xl p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보 처리현황 통지요구</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보 열람요구</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보 정정·삭제요구</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보 처리정지요구</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제4조(처리하는 개인정보 항목)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    회사는 다음의 개인정보 항목을 처리하고 있습니다.
                  </p>
                  <div className="bg-amber-50/60 dark:bg-amber-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">수집 항목</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">필수항목</h5>
                        <ul className="text-sm space-y-1">
                          <li className="text-gray-600 dark:text-gray-400">• 이메일 주소</li>
                          <li className="text-gray-600 dark:text-gray-400">• 비밀번호 (암호화 저장)</li>
                          <li className="text-gray-600 dark:text-gray-400">• 이름 (닉네임)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">자동 수집</h5>
                        <ul className="text-sm space-y-1">
                          <li className="text-gray-600 dark:text-gray-400">• IP 주소</li>
                          <li className="text-gray-600 dark:text-gray-400">• 접속 기록</li>
                          <li className="text-gray-600 dark:text-gray-400">• 브라우저 정보</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제5조(개인정보의 제3자 제공)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회사는 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                  </p>
                  <div className="bg-red-50/60 dark:bg-red-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">제공 현황</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">나이스페이먼츠</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 제공목적: 결제 처리</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 제공항목: 결제정보, 구매자명</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 보유기간: 거래 완료 후 5년</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제6조(개인정보처리의 위탁)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                  </p>
                  <div className="bg-indigo-50/60 dark:bg-indigo-900/20 rounded-xl p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Supabase</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁업무: 데이터베이스 운영 및 관리</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁기간: 서비스 제공 기간</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Google (Gemini AI)</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁업무: AI 음악 프롬프트 생성</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁기간: 서비스 제공 기간</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Suno AI</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁업무: AI 음악 생성</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">• 위탁기간: 서비스 제공 기간</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제7조(개인정보의 파기)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② 개인정보 파기의 절차 및 방법은 다음과 같습니다.
                  </p>
                  <div className="ml-4 space-y-2">
                    <p className="text-gray-600 dark:text-gray-400"><strong>파기절차:</strong> 불필요한 개인정보 및 개인정보파일은 개인정보보호책임자의 승인을 얻어 파기합니다.</p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>파기방법:</strong> 전자적 형태의 정보는 복구 불가능한 방법으로 영구삭제하며, 종이 문서는 분쇄기로 분쇄하거나 소각합니다.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제8조(개인정보의 안전성 확보조치)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
                  </p>
                  <div className="bg-gray-50/60 dark:bg-gray-800/60 rounded-xl p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보 취급 직원의 최소화 및 교육</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">정기적인 자체 감사 실시</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보의 암호화</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">해킹 등에 대비한 기술적 대책</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">개인정보에 대한 접근 제한</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제9조(개인정보보호책임자)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
                  </p>
                  <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">개인정보보호책임자</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300"><strong>성명:</strong> 김진우</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>직책:</strong> 대표</p>
                      <p className="text-gray-700 dark:text-gray-300"><strong>연락처:</strong> illumin0523@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제10조(권익침해 구제방법)</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보보호위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
                  </p>
                  <div className="bg-blue-50/60 dark:bg-blue-900/20 rounded-xl p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="text-gray-700 dark:text-gray-300">• 개인정보보호위원회: privacy.go.kr (국번없이) 182</li>
                      <li className="text-gray-700 dark:text-gray-300">• 개인정보침해신고센터: privacy.go.kr (국번없이) 182</li>
                      <li className="text-gray-700 dark:text-gray-300">• 대검찰청: www.spo.go.kr (국번없이) 1301</li>
                      <li className="text-gray-700 dark:text-gray-300">• 경찰청: ecrm.cyber.go.kr (국번없이) 182</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  📅 부칙
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  이 개인정보처리방침은 2025년 1월 20일부터 적용됩니다.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}