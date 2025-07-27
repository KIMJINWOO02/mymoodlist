export interface FormData {
  scene: string;
  mood: string;
  duration: number;
  genre: string;
  useCase: string;
  instruments: string;
  additional: string;
}

export interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string | number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export interface Option {
  id: string;
  label: string;
  description?: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface SunoResponse {
  id: string;
  title?: string;
  audio_url: string;
  video_url?: string;
  image_url?: string | null;
  status: 'queued' | 'processing' | 'complete' | 'error';
  prompt?: string;
  duration?: number;
  created_at?: string;
  model_name?: string;
  tags?: string;
}

export interface MusicGenerationResult {
  prompt: string;
  audioUrl: string;
  title?: string;
  duration: number;
  imageUrl?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token System Types
export interface User {
  id: string;
  email?: string;
  tokens: number;
  createdAt: Date;
  lastTokenPurchase?: Date;
}

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular?: boolean;
  description: string;
}

export interface PaymentRequest {
  packageId: string;
  amount: number;
  tokens: number;
  userId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  tokensAdded: number;
  newBalance: number;
  message?: string;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  createdAt: Date;
  relatedId?: string; // music generation ID, payment ID, etc.
}