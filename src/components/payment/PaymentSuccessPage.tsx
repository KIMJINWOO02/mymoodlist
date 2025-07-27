import React from 'react';
import { CheckCircle, Zap, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface PaymentSuccessPageProps {
  tokensAdded: number;
  newBalance: number;
  onContinue: () => void;
  onHome?: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  tokensAdded,
  newBalance,
  onContinue,
  onHome
}) => {
  
  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900/30 to-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)]"></div>
      </div>

      {/* Header with Logo and Back Button */}
      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <div className="flex items-center justify-between">
          <div className="bg-stone-900/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-200/30 inline-block">
            <Logo size="small" variant="light" showText={true} />
          </div>
          <button
            onClick={handleHome}
            className="group flex items-center space-x-2 bg-stone-900/60 hover:bg-stone-800/70 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-200/30 hover:border-amber-200/50 text-amber-100 hover:text-amber-50 transition-all duration-300 shadow-lg"
          >
            <Home size={20} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium">홈으로</span>
          </button>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center relative z-10 py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-12 shadow-2xl">
            {/* Success Icon with Animation */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full opacity-20 animate-ping"></div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-50 via-orange-100 to-amber-100 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm">
              결제가 완료되었습니다!
            </h1>

            <p className="text-xl text-amber-100/90 mb-10 leading-relaxed">
              토큰이 성공적으로 충전되었습니다.
              <br />
              <span className="text-amber-300 font-semibold">이제 무한한 음악 창작을 시작하세요!</span>
            </p>

            {/* Token Info with Premium Design */}
            <div className="relative bg-gradient-to-br from-amber-600/25 via-orange-600/20 to-yellow-600/25 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-amber-400/35 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                    +{tokensAdded} 토큰 충전됨
                  </span>
                </div>
                
                <div className="text-center">
                  <div className="text-amber-100/80 mb-2 font-medium">현재 보유 토큰</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-50 via-orange-100 to-amber-100 bg-clip-text text-transparent mb-2">
                    {newBalance} 토큰
                  </div>
                  <div className="text-amber-300 font-semibold">
                    약 {newBalance}곡의 프로급 음악을 생성할 수 있습니다
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button with Enhanced Design */}
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button
                onClick={onContinue}
                className="relative w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3"
              >
                <span>🎵 음악 생성하러 가기</span>
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Additional Info with Premium Styling */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💡</span>
                </div>
                <span>프리미엄 혜택</span>
              </h3>
              <ul className="text-sm text-white/80 space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>토큰은 유효기간 없이 언제든 사용 가능합니다</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                  <span>더 자세한 설명을 입력할수록 더 좋은 음악이 생성됩니다</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <span>생성된 음악은 고음질로 자유롭게 다운로드할 수 있습니다</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};