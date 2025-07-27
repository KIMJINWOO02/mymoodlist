import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200/30 border-t-amber-500 shadow-lg"></div>
        <div className="absolute inset-3 animate-pulse rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-25"></div>
      </div>
    </div>
  );
};

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900/30 to-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-12 shadow-2xl max-w-2xl mx-auto text-center">
          <LoadingSpinner />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-50 via-orange-100 to-amber-100 bg-clip-text text-transparent mt-8 mb-6 leading-tight drop-shadow-sm">
            음악을 생성하고 있습니다
          </h2>
          <p className="text-xl text-amber-100/90 mb-10 leading-relaxed">
            {message}
          </p>
          <div className="bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/35">
            <p className="text-amber-200 font-medium leading-relaxed">
              🎵 {message.includes('약 2-3분') ? '실제 AI 음악이 생성되고 있습니다!' : 'AI가 당신의 감정을 깊이 분석하고 있습니다...'}
              <br />
              <span className="text-amber-100/90">
                {message.includes('약 2-3분') 
                  ? '고품질 음원 제작 중이므로 잠시만 기다려주세요. 데모가 아닌 진짜 음악을 만들고 있어요!' 
                  : '잠시만 기다려주세요. 최고의 음악을 만들어드릴게요!'}
              </span>
            </p>
            {message.includes('약 2-3분') && (
              <div className="mt-6 bg-orange-500/20 border border-orange-400/50 rounded-xl p-4">
                <p className="text-orange-200 text-sm font-medium">
                  ⏰ 실제 AI 생성으로 약 2-3분이 소요됩니다
                  <br />
                  <span className="text-orange-100/80">완료 후 고품질 음원을 제공해드립니다</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};