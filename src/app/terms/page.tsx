'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
                약관 및 정책 ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                myMoodlist 서비스 이용약관 및 개인정보처리방침
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span>최종 수정일: 2025.01.20</span>
                <span>버전 1.0</span>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-amber-50/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                🎵 myMoodlist 사업자 정보
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                신뢰할 수 있는 AI 음악 생성 서비스
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-blue-600 dark:text-blue-400">❄️</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">서비스명</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">myMoodlist</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-orange-600 dark:text-orange-400">👤</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">대표자</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">김진우</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-purple-600 dark:text-purple-400">🏢</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">운영회사</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">일루민</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-green-600 dark:text-green-400">📧</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">고객센터</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">illumin0523@gmail.com</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-indigo-600 dark:text-indigo-400">#</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">사업자등록번호</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">873-24-01738</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-red-600 dark:text-red-400">📍</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">운영시간</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">평일 09:00 - 18:00</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-100/60 dark:bg-gray-700/60 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-2">ℹ️</span>
                  본 약관은 법적 효력을 갖습니다
                </p>
              </div>
            </div>

            {/* Terms Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">서비스 이용 약관</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  본 약관은 일루민(이하 &quot;회사&quot;가 운영하는 사이트 : myMoodlist)에서 제공하는 인터넷 관련 서비스를 이용함에 있어 사이트와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제1조(목적)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  이 약관은 일루민(이하 &quot;회사&quot;가 운영하는 사이트 : myMoodlist)(이하 &quot;사이트&quot;라 한다)에서 제공하는 인터넷 관련 서비스(이하 &quot;서비스&quot;라 한다)를 이용함에 있어 사이트와 이용자의 권리 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제2조(정의)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;란 회사가 재화 또는 용역(이하 &quot;재화 등&quot;이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이트를 운영하는 사업자의 의미로도 사용합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;이용자&quot;란 &quot;사이트&quot;에 접속하여 이 약관에 따라 &quot;사이트&quot;가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ③ &quot;회원&quot;이라 함은 &quot;사이트&quot;에 회원등록을 한 자로서, 계속적으로 &quot;사이트&quot;가 제공하는 서비스를 이용할 수 있는 자를 말합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ④ &quot;비회원&quot;이라 함은 회원에 가입하지 않고 &quot;사이트&quot;가 제공하는 서비스를 이용하는 자를 말합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ⑤ &quot;토큰&quot;이라 함은 AI 음악 생성 서비스 이용을 위해 구매하는 디지털 이용권을 말합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제3조(약관 등의 명시와 설명 및 개정)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호·모사전송번호·전자우편주소, 사업자등록번호, 통신판매업의 신고번호, 개인정보관리책임자를 이용자가 쉽게 알 수 있도록 회사 사이트의 초기 서비스화면(전면)에 게시합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ③ &quot;사이트&quot;는 관련 법령 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ④ &quot;사이트&quot;가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제4조(서비스의 제공 및 변경)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;는 다음과 같은 업무를 수행합니다.
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
                    <li>구매계약이 체결된 재화 또는 용역의 배송</li>
                    <li>기타 &quot;사이트&quot;가 정하는 업무</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제5조(서비스의 중단)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, &quot;사이트&quot;가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제6조(회원가입)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 이용자는 &quot;사이트&quot;가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                  </p>
                  <div className="ml-4 space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">1. 가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우</p>
                    <p className="text-gray-600 dark:text-gray-400">2. 등록 내용에 허위, 기재누락, 오기가 있는 경우</p>
                    <p className="text-gray-600 dark:text-gray-400">3. 기타 회원으로 등록하는 것이 &quot;사이트&quot;의 기술상 현저히 지장이 있다고 판단되는 경우</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제7조(회원 탈퇴 및 자격 상실 등)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① 회원은 &quot;사이트&quot;에 언제든지 탈퇴를 요청할 수 있으며 &quot;사이트&quot;는 즉시 회원탈퇴를 처리합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② 회원이 다음 각 호의 사유에 해당하는 경우, &quot;사이트&quot;는 회원자격을 제한 및 정지시킬 수 있습니다.
                  </p>
                  <div className="ml-4 space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">1. 가입 신청 시에 허위 내용을 등록한 경우</p>
                    <p className="text-gray-600 dark:text-gray-400">2. &quot;사이트&quot;를 이용하여 구입한 재화 등의 대금을 기일에 지급하지 않는 경우</p>
                    <p className="text-gray-600 dark:text-gray-400">3. 다른 사람의 &quot;사이트&quot; 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</p>
                    <p className="text-gray-600 dark:text-gray-400">4. &quot;사이트&quot;를 이용하여 법령 또는 이 약관의 금지하거나 공서양속에 반하는 행위를 하는 경우</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제17조(개인정보보호)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ③ &quot;사이트&quot;는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ④ &quot;사이트&quot;는 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제18조(&quot;사이트&quot;의 의무)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화·용역을 제공하는데 최선을 다하여야 합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ③ &quot;사이트&quot;는 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제20조(이용자의 의무)</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  이용자는 다음 행위를 하여서는 안 됩니다.
                </p>
                <div className="ml-4 space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">1. 신청 또는 변경시 허위 내용의 등록</p>
                  <p className="text-gray-600 dark:text-gray-400">2. 타인의 정보 도용</p>
                  <p className="text-gray-600 dark:text-gray-400">3. &quot;사이트&quot;에 게시된 정보의 변경</p>
                  <p className="text-gray-600 dark:text-gray-400">4. &quot;사이트&quot;가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</p>
                  <p className="text-gray-600 dark:text-gray-400">5. &quot;사이트&quot; 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                  <p className="text-gray-600 dark:text-gray-400">6. &quot;사이트&quot; 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                  <p className="text-gray-600 dark:text-gray-400">7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 사이트에 공개 또는 게시하는 행위</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제22조(저작권의 귀속 및 이용제한)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;가 작성한 저작물에 대한 저작권과 기타 지적재산권은 &quot;사이트&quot;에 귀속합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② 이용자는 &quot;사이트&quot;를 이용함으로써 얻은 정보 중 &quot;사이트&quot;에게 지적재산권이 귀속된 정보를 &quot;사이트&quot;의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제24조(재판권 및 준거법)</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ① &quot;사이트&quot;와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    ② &quot;사이트&quot;와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  📅 부칙 (시행일)
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  본 약관은 2025년 1월 20일부터 적용합니다.
                </p>
              </div>

              <div className="bg-amber-50/60 dark:bg-gray-800/60 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📞 문의사항</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  본 약관에 대한 문의사항이 있으시면 고객센터로 연락주시기 바랍니다.
                </p>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>이메일: illumin0523@gmail.com</p>
                  <p>운영시간: 평일 09:00 - 18:00</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}