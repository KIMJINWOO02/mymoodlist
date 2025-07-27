import React, { useState } from 'react';
import { StepProps } from '@/types';
import { instrumentOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';

export const Step6Instruments: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    const option = instrumentOptions.find(opt => opt.id === optionId);
    if (option) {
      updateFormData('instruments', option.label);
      setUseCustom(false);
      setCustomInput('');
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      updateFormData('instruments', customInput.trim());
    }
  };

  const canProceed = formData.instruments || customInput.trim();

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          어떤 악기를 사용할까요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          원하는 악기 구성을 선택해주세요. AI가 추천해드릴 수도 있어요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {instrumentOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.instruments === option.label}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="custom-instruments"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="custom-instruments" className="text-amber-700 dark:text-orange-200 font-medium">
            직접 입력하기
          </label>
        </div>

        {useCustom && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="예: 바이올린 + 첼로 + 피아노..."
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