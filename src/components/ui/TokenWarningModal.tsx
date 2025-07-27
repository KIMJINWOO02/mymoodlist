import React from 'react';
import { AlertTriangle, Zap, CreditCard } from 'lucide-react';

interface TokenWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharge: () => void;
  tokensNeeded: number;
  currentTokens: number;
}

export const TokenWarningModal: React.FC<TokenWarningModalProps> = ({
  isOpen,
  onClose,
  onCharge,
  tokensNeeded,
  currentTokens
}) => {
  if (!isOpen) return null;

  const tokensToCharge = tokensNeeded - currentTokens;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          토큰이 부족합니다
        </h2>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            음악 생성을 위해 <strong>{tokensNeeded}개</strong>의 토큰이 필요하지만
            <br />
            현재 <strong>{currentTokens}개</strong>의 토큰만 보유하고 있습니다.
          </p>
          
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">
                {tokensToCharge}개의 토큰이 더 필요합니다
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onCharge}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <CreditCard className="w-5 h-5" />
            <span>토큰 충전하기</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            나중에 하기
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">💡 알아두세요</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 토큰은 음악 1곡당 1개씩 사용됩니다</li>
            <li>• 토큰은 유효기간이 없어 언제든 사용 가능합니다</li>
            <li>• 더 많은 패키지일수록 할인 혜택이 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};