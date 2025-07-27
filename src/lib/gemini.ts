import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormData as MusicFormData } from '@/types';

// API 키 설정 (서버 사이드에서만 접근)
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('Gemini API key not found. Please set GEMINI_API_KEY in .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiService {
  // 음악 생성용 프롬프트 생성
  static async generateMusicPrompt(formData: MusicFormData): Promise<string> {
    try {
      // Gemini Pro 1.5 모델 사용 (최신 버전)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // 사용자 입력을 기반으로 한 프롬프트 생성 요청
      const prompt = this.createPromptTemplate(formData);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      // 에러 발생 시 기본 프롬프트 반환
      return this.createFallbackPrompt(formData);
    }
  }

  // Gemini에게 전달할 프롬프트 템플릿 생성
  private static createPromptTemplate(formData: FormData): string {
    const { scene, mood, genre, useCase, instruments, additional } = formData;

    return `
당신은 감정 기반 음악 스타일 설계자입니다. 
사용자가 입력한 감정과 분위기를 바탕으로 시적이고 묘사적인 영어 문장을 생성해주세요.

사용자 입력 정보:
- 장면/상황: ${scene || '정보 없음'}
- 분위기/감정: ${mood || '정보 없음'}  
- 선호 장르: ${genre || '정보 없음'}
- 사용 목적: ${useCase || '정보 없음'}
- 악기: ${Array.isArray(instruments) ? instruments.join(', ') : instruments || '정보 없음'}
- 추가 요청사항: ${additional || '정보 없음'}

지침:
1. 감정을 기반으로 시적인 1~3문장으로 구성하세요
2. 실제 장면이 그려지는 묘사형 문장을 생성하세요
3. 음악 길이나 BPM은 포함하지 마세요
4. 일부 입력값이 빠져도 AI가 추론해서 보완하세요
5. 감정, 장면, 악기의 느낌이 자연스럽게 드러나야 합니다

출력 요구사항:
- 영어 문단형 문장으로 작성
- 기술적 용어보다는 감정과 이미지 중심
- 시적이고 서정적인 표현 사용

예시: "Floating above a silent forest lake, gentle strings and airy synths create a tranquil world where time feels suspended."

이제 위 정보를 바탕으로 감정적이고 시적인 영어 묘사 문장을 생성해주세요:
`;
  }

  // Gemini API 실패 시 사용할 기본 프롬프트 생성 (시적 묘사형)
  private static createFallbackPrompt(formData: FormData): string {
    const { scene, mood, genre, instruments } = formData;
    
    // 시적 표현을 위한 맵핑
    const sceneMap: { [key: string]: string } = {
      '집': 'In the warm embrace of home',
      '자연': 'Beneath the vast open sky',
      '도시': 'Through the bustling urban heartbeat',
      '카페': 'In the gentle hum of a cozy café',
      '해변': 'Where ocean waves kiss the shore',
      '숲': 'Deep within the whispering forest',
      '밤': 'Under the starlit midnight sky'
    };

    const moodMap: { [key: string]: string } = {
      '평온한': 'gentle melodies float like soft whispers',
      '신나는': 'vibrant rhythms dance with infectious energy',
      '감성적인': 'tender harmonies weave through the heart',
      '몽환적인': 'ethereal sounds drift like morning mist',
      '강렬한': 'powerful waves of music surge forward',
      '슬픈': 'melancholic notes fall like autumn rain',
      '희망적인': 'uplifting tones rise like the dawn',
      '신비로운': 'mysterious echoes swirl in the shadows'
    };

    const instrumentMap: { [key: string]: string } = {
      '피아노': 'delicate piano keys',
      '기타': 'gentle guitar strings',
      '바이올린': 'soaring violin melodies',
      '드럼': 'rhythmic heartbeats',
      '신시사이저': 'shimmering synthesizers'
    };

    const scenePhrase = sceneMap[scene] || 'In a moment of quiet reflection';
    const moodPhrase = moodMap[mood] || 'beautiful melodies flow gently';
    const instrumentPhrase = instrumentMap[instruments] || 'harmonious instruments';

    return `${scenePhrase}, ${instrumentPhrase} create a world where ${moodPhrase}, painting emotions in sound.`;
  }

  // API 키 유효성 검사
  static isConfigured(): boolean {
    return !!apiKey;
  }

  // 테스트용 간단한 프롬프트 생성
  static async testConnection(): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hello, can you respond with "Gemini AI is working correctly!"?');
      const response = await result.response;
      return response.text();
    } catch (error) {
      throw new Error(`Gemini connection test failed: ${error}`);
    }
  }
}