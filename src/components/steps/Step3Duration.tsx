import React from 'react';
import { StepProps } from '@/types';
import { durationOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';

export const Step3Duration: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}) => {
  const handleOptionSelect = (optionId: string) => {
    updateFormData('duration', parseInt(optionId));
  };

  const canProceed = formData.duration > 0;

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          음악 길이를 선택해주세요
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          용도에 맞는 적절한 길이를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {durationOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.duration.toString() === option.id}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <button onClick={onPrev} className="btn-secondary">
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-primary ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          다음
        </button>
      </div>
    </div>
  );
};