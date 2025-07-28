import axios from 'axios';
import { FormData as MusicFormData, GeminiResponse, SunoResponse, MusicGenerationResult, ApiError } from '@/types';
import { GeminiService as NewGeminiService } from './gemini';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 300000, // 5 minutes for music generation
  headers: {
    'Content-Type': 'application/json'
  }
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
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎵 Music generation attempt ${attempt}/${maxRetries}`);
        
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
        
        console.log('✅ Music generation successful');
        
        return {
          prompt: geminiPrompt, // Gemini가 생성한 프롬프트 유지
          audioUrl: sunoData.audio_url,
          title: sunoData.title,
          duration: sunoData.duration || formData.duration,
          imageUrl: sunoData.image_url
        };
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Music generation attempt ${attempt} failed:`, error.message);
        
        // 마지막 시도가 아니고 타임아웃 에러인 경우 재시도
        if (attempt < maxRetries && (
          error.code === 'ECONNABORTED' || 
          error.response?.status === 504 ||
          error.response?.status === 503 ||
          error.message.includes('timeout')
        )) {
          console.log(`⏳ Retrying in 2 seconds... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        // 다른 에러는 즉시 throw
        break;
      }
    }

    console.error('❌ All music generation attempts failed');
    throw new ApiError(
      lastError?.response?.data?.error || lastError?.message || 'Failed to generate music', 
      lastError?.response?.status
    );
  }

  // 음악 생성 완료를 위한 폴링 함수
  static async pollForCompletion(taskId: string, prompt: string, duration: number): Promise<MusicGenerationResult> {
    const maxAttempts = 30; // 5분 최대 대기 (10초 간격)
    const pollInterval = 10000; // 10초 간격
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // 10초 대기
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        // 상태 확인
        const statusResponse = await api.get(`/api/suno-result/${taskId}`);
        
        if (statusResponse.data.success && statusResponse.data.data) {
          const result = statusResponse.data.data;
          
          if (result.status === 'completed' && result.audio_url) {
            return {
              prompt: prompt,
              audioUrl: result.audio_url,
              title: result.title || 'AI Generated Music',
              duration: result.duration || duration,
              imageUrl: result.image_url
            };
          } else if (result.status === 'failed') {
            throw new ApiError('Music generation failed on server');
          }
          // processing 상태면 계속 대기
        }
      } catch (error) {
        console.warn(`Polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw new ApiError('Music generation timeout - please try again');
        }
      }
    }
    
    throw new ApiError('Music generation timeout - please try again');
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
      console.log('🎵 Attempting Suno API music generation...');
      return await this.generateWithSunoAPIOrg(prompt, duration);
    } catch (error) {
      console.error('❌ SunoAPI.org failed:', error);
      
      // 에러가 API 키 관련이면 즉시 데모로 폴백
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('403')) {
        console.log('🔑 API key issue detected, using demo fallback');
        return await this.generateDemoFallback(prompt, duration);
      }
      
      // 다른 에러는 한 번 더 시도 후 데모 폴백
      try {
        console.log('🔄 Retrying with proxy API...');
        return await this.generateWithProxy(prompt, duration);
      } catch (retryError) {
        console.log('🎭 All methods failed, using demo fallback');
        return await this.generateDemoFallback(prompt, duration);
      }
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
      wait_audio: false,     // 비동기로 변경 - taskId만 받고 폴링으로 확인
      model: 'V3_5',        // SunoAPI.org 지원 모델명
      callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/suno-callback`
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

    // SunoAPI.org 응답 형식 처리 (wait_audio: false로 taskId 받고 폴링)
    if (result.code === 200 && result.data) {
      // taskId 받고 폴링 시작
      if (result.data.taskId) {
        const taskId = result.data.taskId;
        console.log('⏳ Received taskId, starting polling:', taskId);
        return await this.waitForMusicCompletion(taskId, prompt, duration);
      } else if (Array.isArray(result.data) && result.data.length > 0) {
        // 예외적으로 즉시 완성된 경우
        const musicData = result.data[0];
        console.log('✅ Music completed immediately');
        return {
          id: musicData.id || 'immediate-' + Date.now(),
          title: musicData.title || 'AI Generated Music',
          audio_url: musicData.audio_url || musicData.audioUrl,
          image_url: musicData.image_url || musicData.imageUrl,
          status: 'complete',
          prompt: prompt,
          duration: musicData.duration || duration,
          created_at: new Date().toISOString()
        };
      }
    } else {
      console.error('Unexpected response format:', result);
      throw new Error(`Unexpected response format: ${JSON.stringify(result)}`);
    }
  }

  // taskId로 음악 완성 대기 (실제 폴링 방식)
  private static async waitForMusicCompletion(taskId: string, prompt: string, duration: number): Promise<SunoResponse> {
    // 저장소에 작업 등록
    const { callbackStorage } = await import('@/lib/storage');
    await callbackStorage.registerTask(taskId);
    
    console.log('🔄 Starting real polling for task:', taskId);
    
    // 실제 폴링 - 최대 5분 동안 10초마다 확인
    const maxAttempts = 30; // 5분 = 30 * 10초
    const pollInterval = 10000; // 10초
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`🔍 Polling attempt ${attempt + 1}/${maxAttempts} for taskId:`, taskId);
      
      // 첫 번째 시도가 아니면 대기
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
      
      try {
        // 1단계: 콜백 결과 확인
        let result = await callbackStorage.getResult(taskId);
        
        // 2단계: 콜백이 없으면 Suno API에 직접 상태 확인
        if (!result) {
          console.log(`🔍 No callback result, checking Suno API directly for ${taskId}`);
          try {
            const statusResult = await this.checkSunoTaskStatus(taskId);
            if (statusResult && statusResult.status === 'completed') {
              // 수동으로 콜백 저장
              await callbackStorage.saveCallback(taskId, statusResult);
              console.log('✅ Manually saved completed result from Suno API check');
              result = statusResult; // 결과 업데이트
            }
          } catch (statusError) {
            console.warn('⚠️ Direct Suno API status check failed:', statusError);
          }
        }
        
        if (result && result.status === 'completed' && result.audioUrl) {
          console.log('✅ Music generation completed for taskId:', taskId);
          
          return {
            id: taskId,
            title: result.title || 'AI Generated Music',
            audio_url: result.audioUrl,
            image_url: result.imageUrl || null,
            status: 'complete',
            prompt: prompt,
            duration: result.duration || duration,
            created_at: new Date().toISOString()
          };
        } else if (result && result.status === 'failed') {
          console.error('❌ Music generation failed for taskId:', taskId, result.error);
          throw new Error(`Music generation failed: ${result.error}`);
        }
        
        // 아직 완료되지 않음 - 계속 폴링
        console.log(`⏳ Task ${taskId} still in progress... (attempt ${attempt + 1})`);
        
      } catch (error) {
        console.warn(`⚠️ Polling error for taskId ${taskId} (attempt ${attempt + 1}):`, error);
        
        // 마지막 시도라면 에러 발생
        if (attempt === maxAttempts - 1) {
          throw new Error(`Music generation timeout after ${maxAttempts} attempts`);
        }
      }
    }
    
    // 시간 초과
    console.error('⏰ Timeout waiting for music generation completion');
    throw new Error('Music generation timeout - please try again');
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

  // SunoAPI.org 작업 상태 확인
  private static async checkSunoTaskStatus(taskId: string): Promise<any> {
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error('Suno API key not found');
    }

    const url = `${this.SUNO_API_URL}/api/v1/get?taskId=${taskId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code === 200 && result.data) {
      return {
        id: taskId,
        status: result.data.status === 'complete' ? 'completed' : result.data.status,
        audio_url: result.data.audio_url,
        title: result.data.title,
        duration: result.data.duration,
        image_url: result.data.image_url
      };
    }
    
    return null;
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