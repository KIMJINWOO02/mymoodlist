import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw } from 'lucide-react';
import { useToastHelpers } from './Toast';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioUrl, 
  title, 
  duration 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { error: showError, success: showSuccess } = useToastHelpers();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // processing 상태인지 확인
    const isProcessingUrl = audioUrl.includes('/api/suno-result/');
    setIsProcessing(isProcessingUrl);
    
    // processing 상태면 폴링 시작
    if (isProcessingUrl && !pollingInterval) {
      console.log('🔄 Starting polling for music completion');
      const interval = setInterval(async () => {
        try {
          const response = await fetch(audioUrl);
          if (response.ok && response.headers.get('content-type')?.includes('audio')) {
            console.log('✅ Music is ready! Reloading audio...');
            audio.load(); // 오디오 다시 로드
            setIsProcessing(false);
            clearInterval(interval);
            setPollingInterval(null);
          }
        } catch (error) {
          console.log('⏳ Still processing...', error);
        }
      }, 5000); // 5초마다 확인
      
      setPollingInterval(interval);
    }
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration || duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      
      if (isProcessingUrl) {
        console.log('🎵 Music still processing, will retry automatically');
        // processing 중이면 에러 메시지 표시하지 않음
      } else {
        showError('로딩 오류', '음악을 로드하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };
    const handleLoadStart = () => {
      console.log('Audio loading started:', audioUrl);
    };
    const handleCanPlay = () => {
      console.log('Audio can play:', audioUrl);
      if (isProcessingUrl) {
        setIsProcessing(false);
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      
      // 폴링 정리
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    };
  }, [duration, audioUrl, pollingInterval, showError]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // processing 상태인지 확인
    const isProcessingUrl = audioUrl.includes('/api/suno-result/');

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        console.log('Attempting to play audio:', audioUrl);
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play error:', error);
      setIsPlaying(false);
      
      if (isProcessingUrl) {
        showError('생성 중', '음악이 아직 생성 중입니다. 잠시 후 다시 시도해주세요.');
      } else {
        showError('재생 오류', '음악 재생 중 오류가 발생했습니다. 브라우저에서 자동 재생이 차단되었을 수 있습니다.');
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleDownload = async () => {
    try {
      console.log('Downloading audio from:', audioUrl);
      
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'generated-music'}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 메모리 정리
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      showError('다운로드 오류', '다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-stone-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-amber-200/25">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={togglePlay}
          disabled={isProcessing}
          className={`w-12 h-12 ${isProcessing 
            ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 cursor-pointer'
          } text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-amber-500/30`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>
        
        <button
          onClick={handleRestart}
          className="w-10 h-10 bg-stone-900/50 hover:bg-stone-800/70 border border-amber-200/30 hover:border-amber-200/50 text-amber-100 hover:text-amber-50 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
        >
          <RotateCcw size={16} />
        </button>

        <div className="flex-1">
          <h3 className="font-bold text-white">
            {isProcessing ? '🎵 음악 생성 중...' : title}
          </h3>
          <p className="text-sm text-white/70 font-medium">
            {isProcessing ? (
              <span className="text-yellow-400">AI가 당신만의 음악을 만들고 있어요</span>
            ) : (
              <>
                <span className="text-emerald-400">{formatTime(currentTime)}</span> / <span className="text-white/90">{formatTime(totalDuration)}</span>
              </>
            )}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-violet-500/25"
        >
          <Download size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={totalDuration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm"
          />
          <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 opacity-50"></div>
        </div>
        <div className="flex justify-between text-xs text-white/70 font-medium">
          <span className="text-emerald-400">{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706, #ea580c);
          cursor: pointer;
          border: 2px solid rgba(255, 248, 220, 0.4);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d97706, #ea580c);
          cursor: pointer;
          border: 2px solid rgba(255, 248, 220, 0.4);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
        }
      `}</style>
    </div>
  );
};