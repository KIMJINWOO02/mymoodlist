import React, { useState } from 'react';
import { StepProps } from '@/types';
import { genreOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';

export const Step4Genre: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    const option = genreOptions.find(opt => opt.id === optionId);
    if (option) {
      updateFormData('genre', option.label);
      setUseCustom(false);
      setCustomInput('');
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      updateFormData('genre', customInput.trim());
    }
  };

  const canProceed = formData.genre || customInput.trim();

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          선호하는 장르가 있나요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          원하는 음악 장르를 선택하거나 AI에게 맡겨주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {genreOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.genre === option.label}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="custom-genre"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="custom-genre" className="text-amber-700 dark:text-orange-200 font-medium">
            직접 입력하기
          </label>
        </div>

        {useCustom && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="예: 인디 포크, 트랩, 하우스..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onBlur={handleCustomSubmit}
              className="input-field"
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