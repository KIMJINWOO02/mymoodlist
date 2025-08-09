import { FormData as MusicFormData } from '@/types';

interface SunoGenerateRequest {
  prompt: string;
  make_instrumental?: boolean;
  wait_audio?: boolean;
  model?: string;
  tags?: string;
  title?: string;
}

interface SunoGenerateResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    image_url: string;
    lyric: string;
    audio_url: string;
    video_url: string;
    created_at: string;
    model_name: string;
    status: 'complete' | 'queued' | 'generating';
    gpt_description_prompt: string;
    prompt: string;
    type: string;
    tags: string;
    duration?: number;
  }[];
  error?: string;
  message?: string;
}

export class SunoApiError extends Error {
  constructor(
    message: string, 
    public status?: number, 
    public code?: string
  ) {
    super(message);
    this.name = 'SunoApiError';
  }
}

/**
 * MusicFormData를 Suno API 프롬프트로 변환
 */
export function createSunoPrompt(formData: MusicFormData): string {
  const elements = [];
  
  // 장면/분위기
  if (formData.scene) {
    elements.push(`Scene: ${formData.scene}`);
  }
  
  // 감정/무드
  if (formData.mood) {
    elements.push(`Mood: ${formData.mood}`);
  }
  
  // 장르
  if (formData.genre) {
    elements.push(`Genre: ${formData.genre}`);
  }
  
  // 용도
  if (formData.useCase) {
    elements.push(`Use case: ${formData.useCase}`);
  }
  
  // 악기
  if (formData.instruments) {
    elements.push(`Instruments: ${formData.instruments}`);
  }
  
  // 추가 설명
  if (formData.additional) {
    elements.push(`Additional: ${formData.additional}`);
  }
  
  // 기본 프롬프트 구성
  let prompt = `Create a ${formData.duration || 30}-second musical piece`;
  
  if (elements.length > 0) {
    prompt += ` with the following characteristics: ${elements.join(', ')}`;
  }
  
  return prompt;
}

/**
 * 장르를 Suno 태그 형식으로 변환
 */
export function createSunoTags(formData: MusicFormData): string {
  const tags = [];
  
  if (formData.genre) {
    tags.push(formData.genre.toLowerCase());
  }
  
  if (formData.mood) {
    tags.push(formData.mood.toLowerCase());
  }
  
  // 악기 태그 추가
  if (formData.instruments) {
    if (formData.instruments.includes('피아노')) tags.push('piano');
    if (formData.instruments.includes('기타')) tags.push('guitar');
    if (formData.instruments.includes('바이올린')) tags.push('violin');
    if (formData.instruments.includes('드럼')) tags.push('drums');
  }
  
  return tags.join(', ');
}

/**
 * Suno API를 호출하여 음악 생성
 */
export async function generateMusic(formData: MusicFormData): Promise<SunoGenerateResponse> {
  const apiKey = process.env.SUNO_API_KEY;
  const apiUrl = process.env.SUNO_API_URL;
  
  console.log('🔍 Suno API Configuration Check:', {
    hasApiKey: !!apiKey,
    hasApiUrl: !!apiUrl,
    apiUrl: apiUrl,
    keyLength: apiKey?.length || 0
  });
  
  if (!apiKey) {
    console.error('❌ SUNO_API_KEY not configured');
    throw new SunoApiError('Suno API key not configured', 500, 'CONFIG_ERROR');
  }
  
  if (!apiUrl) {
    console.error('❌ SUNO_API_URL not configured');
    throw new SunoApiError('Suno API URL not configured', 500, 'CONFIG_ERROR');
  }
  
  // Gemini가 생성한 프롬프트 사용, 없으면 fallback
  const prompt = (formData as any).generatedPrompt || createSunoPrompt(formData);
  const tags = createSunoTags(formData);
  
  const requestBody = {
    prompt: prompt,
    style: tags || "AI Generated",
    title: `${formData.mood || 'Generated'} Music`,
    customMode: true,
    instrumental: !formData.useCase?.includes('보컬') && !formData.useCase?.includes('가사'),
    model: "V3_5",
    callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mymoodlist.com'}/api/suno-callback`
  };
  
  console.log('🎵 Suno API Request:', {
    url: `${apiUrl}/api/v1/generate`,
    prompt: prompt.substring(0, 100) + '...',
    style: requestBody.style,
    title: requestBody.title,
    model: requestBody.model,
    instrumental: requestBody.instrumental
  });
  
  try {
    console.log('🎵 Generating music with Suno API:', { prompt, tags });
    
    const response = await fetch(`${apiUrl}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'myMoodlist/1.0'
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Suno API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: `${apiUrl}/api/v1/generate`
      });
      
      switch (response.status) {
        case 400:
          throw new SunoApiError('Invalid request parameters', 400, 'INVALID_PARAMS');
        case 401:
          throw new SunoApiError('Invalid API key - Check your SUNO_API_KEY', 401, 'UNAUTHORIZED');
        case 429:
          throw new SunoApiError('Insufficient credits or rate limit exceeded', 429, 'RATE_LIMIT');
        case 500:
          throw new SunoApiError('Suno API server error', 500, 'SERVER_ERROR');
        default:
          throw new SunoApiError(`Suno API error: ${response.status} - ${errorText}`, response.status, 'API_ERROR');
      }
    }
    
    const result: SunoGenerateResponse = await response.json();
    
    console.log('✅ Music generation successful:', result);
    
    // 성공 응답에 success: true 추가
    return {
      ...result,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Failed to generate music:', error);
    
    // 에러를 throw하지 않고 에러 응답을 반환
    return {
      success: false,
      error: error instanceof SunoApiError ? error.message : 'Music generation failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * 생성 상태 확인 (비동기 생성 시 사용)
 */
export async function checkGenerationStatus(ids: string[]): Promise<SunoGenerateResponse> {
  const apiKey = process.env.SUNO_API_KEY;
  const apiUrl = process.env.SUNO_API_URL;
  
  if (!apiKey || !apiUrl) {
    throw new SunoApiError('Suno API not configured', 500, 'CONFIG_ERROR');
  }
  
  try {
    const response = await fetch(`${apiUrl}/?ids=${ids.join(',')}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new SunoApiError(`Failed to check status: ${response.status}`, response.status);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('❌ Failed to check generation status:', error);
    throw error;
  }
}

/**
 * API 크레딧 확인
 */
export async function checkCredits(): Promise<{ credits: number }> {
  const apiKey = process.env.SUNO_API_KEY;
  const apiUrl = process.env.SUNO_API_URL;
  
  if (!apiKey || !apiUrl) {
    throw new SunoApiError('Suno API not configured', 500, 'CONFIG_ERROR');
  }
  
  try {
    const response = await fetch(`${apiUrl}/get_credits`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new SunoApiError(`Failed to check credits: ${response.status}`, response.status);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('❌ Failed to check credits:', error);
    throw error;
  }
}