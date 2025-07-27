import React, { useState } from 'react';
import { StepProps } from '@/types';
import { moodOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';

export const Step2Mood: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    const option = moodOptions.find(opt => opt.id === optionId);
    if (option) {
      updateFormData('mood', option.label);
      setUseCustom(false);
      setCustomInput('');
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      updateFormData('mood', customInput.trim());
    }
  };

  const canProceed = formData.mood || customInput.trim();

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          어떤 감정을 담고 싶으신가요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          음악에 담길 주된 감정이나 분위기를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {moodOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.mood === option.label}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="custom-mood"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="custom-mood" className="text-amber-700 dark:text-orange-200 font-medium">
            직접 입력하기
          </label>
        </div>

        {useCustom && (
          <div className="space-y-4">
            <textarea
              placeholder="예: 그리움과 희망이 섞인..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomSubmit}
              className="input-field h-20 resize-none"
            />
          </div>
        )}
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