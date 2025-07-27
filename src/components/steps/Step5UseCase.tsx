import React, { useState } from 'react';
import { StepProps } from '@/types';
import { useCaseOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';

export const Step5UseCase: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    const option = useCaseOptions.find(opt => opt.id === optionId);
    if (option) {
      updateFormData('useCase', option.label);
      setUseCustom(false);
      setCustomInput('');
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      updateFormData('useCase', customInput.trim());
    }
  };

  const canProceed = formData.useCase || customInput.trim();

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          어떤 용도로 사용하실 건가요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          음악의 사용 목적을 알려주시면 더 적합한 음악을 만들어드려요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {useCaseOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.useCase === option.label}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="custom-usecase"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="custom-usecase" className="text-amber-700 dark:text-orange-200 font-medium">
            직접 입력하기
          </label>
        </div>

        {useCustom && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="예: 결혼식 입장음악, 게임 배경음악..."
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