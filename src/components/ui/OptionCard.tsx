import React from 'react';
import { Option } from '@/types';

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
  onClick: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onClick }) => {
  return (
    <div
      className={`option-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-amber-800 dark:text-orange-100 mb-2 drop-shadow-sm">{option.label}</h3>
      {option.description && (
        <p className="text-sm text-amber-700/95 dark:text-orange-200">{option.description}</p>
      )}
    </div>
  );
};