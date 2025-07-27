import React, { useState } from 'react';
import { StepProps } from '@/types';

export const Step7Additional: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev,
  isLast 
}) => {
  const [input, setInput] = useState(formData.additional || '');

  const handleInputChange = (value: string) => {
    setInput(value);
    updateFormData('additional', value);
  };

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          추가로 표현하고 싶은 것이 있나요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          더 구체적인 장면이나 감정이 있다면 자유롭게 적어주세요 (선택사항)
        </p>
      </div>

      <div className="mb-8">
        <textarea
          placeholder="예: 비 오는 날 혼자 걷는 장면, 새벽에 깨어 있는 감정, 숲속 호숫가에서 명상하는 장면..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="input-field h-32 resize-none"
        />
        <p className="text-sm text-amber-700/90 dark:text-orange-300 mt-2">
          이 정보는 더 정확한 음악 생성을 위해 사용됩니다.
        </p>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-br from-amber-50/90 via-yellow-50/85 to-orange-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-black/90 backdrop-blur-xl rounded-lg border border-amber-400/50 dark:border-orange-400/40 shadow-lg shadow-amber-200/30 dark:shadow-orange-900/30">
        <h3 className="font-semibold text-amber-700 dark:text-orange-200 mb-4">입력하신 정보 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">분위기:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.scene || '미선택'}</span>
          </div>
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">감정:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.mood || '미선택'}</span>
          </div>
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">길이:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.duration ? `${formData.duration}초` : '미선택'}</span>
          </div>
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">장르:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.genre || '미선택'}</span>
          </div>
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">용도:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.useCase || '미선택'}</span>
          </div>
          <div>
            <span className="font-medium text-amber-700 dark:text-orange-200">악기:</span>
            <span className="ml-2 text-amber-700/95 dark:text-orange-300">{formData.instruments || '미선택'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onPrev} className="btn-secondary">
          이전
        </button>
        <button
          onClick={onNext}
          className="btn-primary px-8"
        >
          {isLast ? '음악 생성하기' : '다음'}
        </button>
      </div>
    </div>
  );
};