import React, { useState } from 'react';
import { StepProps } from '@/types';
import { sceneOptions } from '@/constants/options';
import { OptionCard } from '@/components/ui/OptionCard';
import { sanitizeInput, isInputSafe } from '@/lib/validation';
import { useToastHelpers } from '@/components/ui/Toast';

export const Step1Scene: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev, 
  isFirst 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const { warning } = useToastHelpers();

  const handleOptionSelect = (optionId: string) => {
    const option = sceneOptions.find(opt => opt.id === optionId);
    if (option) {
      updateFormData('scene', option.label);
      setUseCustom(false);
      setCustomInput('');
    }
  };

  const handleCustomSubmit = () => {
    const input = customInput.trim();
    
    if (!input) return;
    
    // 길이 체크
    if (input.length > 500) {
      warning('입력 제한', '장면 설명은 500자 이내로 입력해주세요.');
      return;
    }
    
    // 안전성 체크
    if (!isInputSafe(input)) {
      warning('부적절한 내용', '안전하지 않은 내용이 포함되어 있습니다.');
      return;
    }
    
    // 입력 정리 및 저장
    const sanitizedInput = sanitizeInput(input);
    updateFormData('scene', sanitizedInput);
  };

  const canProceed = formData.scene || customInput.trim();

  return (
    <div className="step-card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 dark:text-orange-100 drop-shadow-sm mb-4">
          어떤 분위기의 장면을 그리고 계신가요?
        </h2>
        <p className="text-amber-700/95 dark:text-orange-200">
          음악이 연상시킬 장면이나 배경을 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sceneOptions.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={formData.scene === option.label}
            onClick={() => handleOptionSelect(option.id)}
          />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="custom-scene"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="custom-scene" className="text-amber-700 dark:text-orange-200 font-medium">
            직접 입력하기
          </label>
        </div>

        {useCustom && (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                placeholder="예: 비 오는 날 작은 카페 창가에서..."
                value={customInput}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setCustomInput(value);
                  }
                }}
                onBlur={handleCustomSubmit}
                className={`input-field h-20 resize-none ${
                  customInput.length > 400 ? 'border-yellow-300' : ''
                } ${customInput.length > 480 ? 'border-red-300' : ''}`}
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {customInput.length}/500
              </div>
            </div>
            {customInput.length > 400 && (
              <p className={`text-xs ${
                customInput.length > 480 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {customInput.length > 480 
                  ? '입력 가능한 글자 수를 초과했습니다.' 
                  : '글자 수 제한에 가까워지고 있습니다.'
                }
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`btn-secondary ${isFirst ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
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