import React, { useState } from 'react';
import { FormData } from '@/types';
import { Header } from './ui/Header';
import { Step1Scene } from './steps/Step1Scene';
import { Step2Mood } from './steps/Step2Mood';
import { Step3Duration } from './steps/Step3Duration';
import { Step4Genre } from './steps/Step4Genre';
import { Step5UseCase } from './steps/Step5UseCase';
import { Step6Instruments } from './steps/Step6Instruments';
import { Step7Additional } from './steps/Step7Additional';

interface MultiStepFormProps {
  onComplete: (formData: FormData) => void;
  onTokenChargeClick?: () => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete, onTokenChargeClick }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    scene: '',
    mood: '',
    duration: 0,
    genre: '',
    useCase: '',
    instruments: '',
    additional: '',
  });

  const steps = [
    Step1Scene,
    Step2Mood,
    Step3Duration,
    Step4Genre,
    Step5UseCase,
    Step6Instruments,
    Step7Additional,
  ];

  const stepTitles = [
    '분위기',
    '감정',
    '길이',
    '장르',
    '용도',
    '악기',
    '추가 설명',
  ];

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep];

  const handleLogoClick = () => {
    // 홈으로 이동하는 함수가 필요하면 onHome prop을 추가하거나
    // window.location.href = '/' 등을 사용
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen py-8 px-4 relative bg-orange-50 dark:bg-black">
      {/* Premium Background - Theme Adaptive */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-100/60 via-yellow-100/50 to-orange-200 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.35),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(202,138,4,0.30),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,237,213,0.08),transparent_70%)]"></div>
      </div>

      {/* Header with Logo and Token Display */}
      <div className="relative z-50">
        <Header 
          onTokenChargeClick={onTokenChargeClick || (() => {})} 
          onLogoClick={handleLogoClick}
          showTokens={false}
        />
      </div>
      {/* Progress Bar with Premium Design */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8 mt-20">
        <div className="bg-gradient-to-br from-orange-50/95 via-amber-50/90 to-yellow-50/95 dark:from-black/95 dark:via-gray-900/95 dark:to-black/95 backdrop-blur-xl rounded-3xl border border-amber-400/60 dark:border-orange-400/60 p-6 shadow-2xl shadow-amber-300/20 dark:shadow-orange-500/40">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < stepTitles.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 dark:from-orange-500 dark:via-orange-400 dark:to-orange-300 text-white dark:text-gray-900 shadow-lg shadow-amber-400/40 dark:shadow-orange-400/60'
                      : 'bg-gradient-to-r from-amber-100/70 to-yellow-100/70 dark:from-gray-700/90 dark:to-gray-800/90 text-amber-800/80 dark:text-orange-200 border border-amber-400/50 dark:border-orange-600/50 shadow-sm shadow-amber-200/30 dark:shadow-orange-900/50'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-semibold ${
                    index <= currentStep 
                      ? 'text-amber-800 dark:text-orange-200 font-semibold' 
                      : 'text-amber-700/70 dark:text-orange-400/90'
                  }`}
                >
                  {title}
                </span>
                {index < stepTitles.length - 1 && (
                  <div
                    className={`flex-1 h-1.5 mx-4 rounded-full ${
                      index < currentStep 
                        ? 'bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 dark:from-orange-500 dark:via-orange-400 dark:to-orange-300 shadow-sm shadow-amber-400/30 dark:shadow-orange-400/50' 
                        : 'bg-gradient-to-r from-amber-200/50 to-yellow-200/50 dark:from-gray-600/80 dark:to-gray-700/80'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-amber-800/95 dark:text-orange-200 font-semibold">
            {currentStep + 1} / {steps.length} 단계
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="relative z-10">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
        />
      </div>
    </div>
  );
};