import axios from 'axios';
import { FormData as MusicFormData, GeminiResponse, SunoResponse, MusicGenerationResult, ApiError } from '@/types';
import { GeminiService as NewGeminiService } from './gemini';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 60000, // 60 seconds for music generation
});

export class ApiService {
  
  static async generatePrompt(formData: MusicFormData): Promise<string> {
    try {
      // API 라우트를 통해 서버 사이드에서 Gemini 호출
      const response = await api.post('/api/generate-prompt', formData);
      return response.data.prompt;
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw new ApiError('Failed to generate prompt', (error as any)?.response?.status);
    }
  }

  static async generateMusic(formData: MusicFormData, geminiPrompt: string): Promise<MusicGenerationResult> {
    try {
      // Gemini 프롬프트와 duration을 함께 전달
      const requestData = {
        prompt: geminiPrompt,
        duration: formData.duration,
        formData: formData
      };

      const response = await api.post('/api/music/generate', requestData);
      
      if (!response.data.success) {
        throw new ApiError(response.data.error || 'Music generation failed');
      }

      // Suno API 응답을 MusicGenerationResult 형태로 변환
      const sunoData = response.data.data[0]; // 첫 번째 생성된 음악 선택
      
      return {
        prompt: geminiPrompt, // Gemini가 생성한 프롬프트 유지
        audioUrl: sunoData.audio_url,
        title: sunoData.title,
        duration: sunoData.duration || formData.duration,
        imageUrl: sunoData.image_url
      };
    } catch (error) {
      console.error('Error generating music:', error);
      throw new ApiError('Failed to generate music', (error as any)?.response?.status);
    }
  }

  static async checkMusicStatus(id: string): Promise<SunoResponse> {
    try {
      const response = await api.get(`/api/music-status/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error checking music status:', error);
      throw new ApiError('Failed to check music status', (error as any)?.response?.status);
    }
  }
}

// Gemini API integration
export class GeminiService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  static async generatePrompt(formData: MusicFormData): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const prompt = this.buildPrompt(formData);
    
    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No text generated from Gemini API');
      }

      return generatedText.trim();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate prompt with Gemini API');
    }
  }

  private static buildPrompt(formData: MusicFormData): string {
    return `
You are an emotional music style designer. Based on the user's input, create a poetic 1-3 sentence description in English that captures the essence of their desired music.

User Input:
- Scene: ${formData.scene}
- Mood: ${formData.mood}
- Genre: ${formData.genre}
- Use Case: ${formData.useCase}
- Instruments: ${formData.instruments}
- Additional: ${formData.additional || 'None'}

Instructions:
- Create a vivid, atmospheric description that captures the emotion and scene
- Focus on imagery and feeling rather than technical details
- Use poetic language that evokes the desired mood
- Keep it 1-3 sentences maximum
- Write in English only
- Make it suitable for music generation AI

Example output format:
"Floating above a silent forest lake, gentle strings and airy synths create a tranquil world where time feels suspended."

Generate the music description:`;
  }
}

// Suno AI 실제 구현 (여러 API 옵션 지원)
export class SunoService {
  private static readonly SUNO_API_URL = process.env.SUNO_API_URL || 'https://api.sunoapi.org';
  private static readonly PROXY_URL = process.env.SUNO_PROXY_URL || 'https://suno-api-beta.vercel.app/api';
  
  static async generateMusic(prompt: string, duration: number = 30): Promise<SunoResponse> {
    // SunoAPI.org 직접 API 사용
    try {
      return await this.generateWithSunoAPIOrg(prompt, duration);
    } catch (error) {
      console.log('SunoAPI.org failed, using demo fallback:', error);
      return await this.generateDemoFallback(prompt, duration);
    }
  }

  // SunoAPI.org API 사용 (올바른 엔드포인트: /api/v1/generate)
  private static async generateWithSunoAPIOrg(prompt: string, duration: number): Promise<SunoResponse> {
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error('Suno API key not found. Please set SUNO_API_KEY in environment variables.');
    }

    console.log('🎼 Calling SunoAPI.org with prompt:', prompt.substring(0, 100) + '...');

    const endpoint = '/api/v1/generate';
    const url = `${this.SUNO_API_URL}${endpoint}`;
    
    console.log(`🔄 Using confirmed endpoint: ${url}`);
    
    const requestBody = {
      prompt: prompt,
      customMode: true,      // SunoAPI.org 필수 파라미터
      instrumental: false,
      wait_audio: false,     // 비동기로 시작
      model: 'V3_5',        // SunoAPI.org 지원 모델명
      callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/suno-callback` // 더미 URL (폴링 사용)
    };

    console.log('📤 Request body:', requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`📡 Response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SunoAPI.org error response:', errorText);
      throw new Error(`SunoAPI.org error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ SunoAPI.org raw response:', result);

    // SunoAPI.org 응답 형식 처리
    if (result.code === 200 && result.data && result.data.taskId) {
      // 비동기 작업 시작 성공 - taskId 받음
      const taskId = result.data.taskId;
      console.log('✅ Music generation started, taskId:', taskId);
      
      // taskId로 상태 확인 및 완료 대기
      return await this.waitForMusicCompletion(taskId, prompt, duration);
    } else {
      console.error('Unexpected response format:', result);
      throw new Error(`Unexpected response format: ${JSON.stringify(result)}`);
    }
  }

  // taskId로 음악 완성 대기 (간단한 폴링 방식)
  private static async waitForMusicCompletion(taskId: string, prompt: string, duration: number): Promise<SunoResponse> {
    // 저장소에 작업 등록
    const { callbackStorage } = await import('@/lib/storage');
    await callbackStorage.registerTask(taskId);
    
    console.log('🔄 Using simplified polling approach for task:', taskId);
    
    // 간단한 대기 시간 (30초) 후 응답 반환
    // 실제 폴링은 클라이언트나 별도 프로세스에서 처리
    setTimeout(async () => {
      try {
        // 백그라운드에서 콜백 확인
        console.log('⏰ Background: Checking if callback arrived for', taskId);
        const result = await callbackStorage.getResult(taskId);
        if (result && result.status === 'completed') {
          console.log('✅ Background: Found completed result');
        }
      } catch (error) {
        console.warn('⚠️ Background check failed:', error);
      }
    }, 30000);
    
    // 즉시 processing 상태로 응답
    return {
      id: taskId,
      title: 'AI Generated Music (Processing)',
      audio_url: `/api/suno-result/${taskId}`, // 결과 조회 엔드포인트
      image_url: null,
      status: 'processing', // 처리 중
      prompt: prompt,
      duration: duration,
      created_at: new Date().toISOString()
    };
  }

  // Suno Proxy API 사용 (더 안정적)
  private static async generateWithProxy(prompt: string, duration: number): Promise<SunoResponse> {
    const response = await fetch(`${this.PROXY_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_PROXY_KEY || ''}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        make_instrumental: false,
        wait_audio: true,
        model: 'chirp-v3-5',
        duration: Math.min(duration, 240) // 최대 4분
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Suno Proxy API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // Suno 직접 API 사용
  private static async generateWithDirectAPI(prompt: string, duration: number): Promise<SunoResponse> {
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error('Suno API key not found. Please set SUNO_API_KEY in environment variables.');
    }

    // 음악 생성 요청
    const generateResponse = await fetch(`${this.SUNO_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'chirp-v3-5',
        wait_audio: true,
        make_instrumental: false,
        duration: Math.min(duration, 240)
      })
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      throw new Error(`Suno API error: ${generateResponse.status} - ${errorText}`);
    }

    const result = await generateResponse.json();
    return result;
  }

  static async checkStatus(id: string): Promise<SunoResponse> {
    try {
      // 프록시를 통한 상태 확인
      const response = await fetch(`${this.PROXY_URL}/get?ids=${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUNO_PROXY_KEY || ''}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Status check error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Suno status check error:', error);
      throw new Error('Failed to check music generation status');
    }
  }

  // 데모용 폴백 (API 키가 없을 때)
  static async generateDemoFallback(prompt: string, duration: number): Promise<SunoResponse> {
    console.log('Using demo fallback for Suno API');
    
    // 실제 Suno와 유사한 응답 구조 반환
    return {
      id: 'demo-' + Date.now(),
      status: 'complete',
      audio_url: '/api/demo-audio',
      image_url: null,
      title: 'AI Generated Demo Music',
      prompt: prompt,
      duration: 5,
      created_at: new Date().toISOString()
    };
  }
}