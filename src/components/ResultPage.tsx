import React from 'react';
import { MusicGenerationResult } from '@/types';
import { AudioPlayer } from './ui/AudioPlayer';
import { Logo } from './ui/Logo';
import { RotateCcw, Share2, Heart } from 'lucide-react';
import { useToastHelpers } from './ui/Toast';

interface ResultPageProps {
  result: MusicGenerationResult;
  onRestart: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onRestart }) => {
  const { success: showSuccess } = useToastHelpers();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '감정 기반 음악 생성기',
          text: '나만의 감정을 담은 음악을 들어보세요!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess('공유 성공', '링크가 클립보드에 복사되었습니다!');
    }
  };

  const handleSave = () => {
    // In a real app, this would save to user's library
    showSuccess('저장 성공', '음악이 저장되었습니다! (데모 기능)');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-900/30 to-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.20),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(161,98,7,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,248,220,0.08),transparent_70%)]"></div>
      </div>

      {/* Header with Logo */}
      <header className="absolute top-0 left-0 w-full p-6 z-20">
        <div className="bg-stone-900/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-amber-200/30 inline-block">
          <Logo size="small" variant="light" showText={true} />
        </div>
      </header>
      
      <div className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-xl rounded-full px-6 py-2 border border-amber-200/30 mb-6">
              <span className="text-amber-300">🎵</span>
              <span className="text-amber-100 font-medium">음악 생성 완료</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-50 via-orange-100 to-amber-100 bg-clip-text text-transparent mb-6 leading-tight drop-shadow-sm">
              당신만의 음악이 완성되었습니다!
            </h1>
            <p className="text-xl text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
              감정과 상상력이 만들어낸 특별한 <span className="text-amber-300 font-semibold">프로급 음악</span>을 즐겨보세요
            </p>
          </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Music Player Section */}
          <div className="space-y-6">
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-amber-50 mb-6 text-center flex items-center justify-center space-x-2">
                <span>🎧</span>
                <span>음악 플레이어</span>
              </h2>
              <AudioPlayer
                audioUrl={result.audioUrl}
                title={result.title || '감정 기반 생성 음악'}
                duration={result.duration}
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl">
              <h3 className="font-bold text-amber-50 mb-6 text-center">음악 관리</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={onRestart}
                  className="group flex items-center justify-center space-x-2 bg-stone-900/50 hover:bg-stone-800/70 border border-amber-200/30 hover:border-amber-200/50 text-amber-100 hover:text-amber-50 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <RotateCcw size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                  <span>다시 만들기</span>
                </button>
                <button
                  onClick={handleShare}
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500/25 to-red-500/25 hover:from-orange-500/35 hover:to-red-500/35 border border-orange-400/35 hover:border-orange-400/55 text-orange-200 hover:text-orange-100 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Share2 size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>공유하기</span>
                </button>
                <button
                  onClick={handleSave}
                  className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500/25 to-yellow-500/25 hover:from-amber-500/35 hover:to-yellow-500/35 border border-amber-400/35 hover:border-amber-400/55 text-amber-200 hover:text-amber-100 px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Heart size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>저장하기</span>
                </button>
              </div>
            </div>
          </div>

          {/* Prompt and Details Section */}
          <div className="space-y-6">
            {/* Generated Prompt */}
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-amber-50 mb-6 flex items-center space-x-2">
                <span>🎨</span>
                <span>AI가 생성한 음악 프롬프트</span>
              </h2>
              <div className="bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/35 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10"></div>
                <p className="relative z-10 text-amber-100 italic leading-relaxed text-lg">
                  "{result.prompt}"
                </p>
              </div>
              <p className="text-amber-100/80 mt-4 text-center">
                <span className="text-amber-300 font-semibold">Gemini AI</span>가 감정을 분석하여 생성한 프롬프트로 <span className="text-orange-300 font-semibold">Suno AI</span>가 음악을 완성했습니다.
              </p>
            </div>

            {/* Music Details */}
            <div className="bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-amber-50 mb-6 flex items-center space-x-2">
                <span>📊</span>
                <span>음악 정보</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-amber-200/20">
                  <span className="font-medium text-amber-100/80">제목</span>
                  <span className="text-amber-50 font-medium">{result.title || '감정 기반 생성 음악'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-amber-200/20">
                  <span className="font-medium text-amber-100/80">길이</span>
                  <span className="text-amber-300 font-semibold">{result.duration}초</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-amber-200/20">
                  <span className="font-medium text-amber-100/80">생성 방식</span>
                  <span className="text-orange-300 font-semibold">Gemini AI + Suno AI</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-amber-100/80">생성 시간</span>
                  <span className="text-amber-50 font-medium">{new Date().toLocaleString('ko-KR')}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-amber-600/25 to-orange-600/25 backdrop-blur-xl rounded-3xl border border-amber-400/35 p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-amber-50 mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💡</span>
                </div>
                <span>프리미엄 팁</span>
              </h3>
              <ul className="text-amber-100/90 space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>음악이 마음에 들지 않으면 '다시 만들기'로 새로운 음악을 생성해보세요</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>더 구체적인 설명을 추가하면 원하는 스타일에 가까운 음악을 얻을 수 있어요</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>다운로드한 음악은 상업적 용도로 사용하기 전에 저작권을 확인해주세요</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};