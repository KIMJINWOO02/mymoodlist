import axios from 'axios';
import { FormData as MusicFormData, GeminiResponse, SunoResponse, MusicGenerationResult, ApiError } from '@/types';
import { GeminiService as NewGeminiService } from './gemini';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds for API calls (reduced from 5 minutes)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 폴링 전용 API 인스턴스 (더 짧은 타임아웃)
const pollingApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 15000, // 15 seconds for polling requests
  headers: {
    'Content-Type': 'application/json'
  }
});

export class ApiService {
  // 폴링 중단을 위한 AbortController 저장소
  private static pollingControllers = new Map<string, AbortController>();
  
  // 폴링 중단 메서드
  static cancelPolling(taskId: string) {
    const controller = this.pollingControllers.get(taskId);
    if (controller) {
      controller.abort();
      this.pollingControllers.delete(taskId);
      console.log(`🛑 Polling cancelled for taskId: ${taskId}`);
    }
  }
  
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
      console.log('🎵 Starting music generation request...');
      
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

      // 응답 타입 확인: taskId가 있으면 폴링 시작, 데이터가 있으면 즉시 반환
      if (response.data.taskId) {
        console.log(`🔄 Music generation started, polling for completion. TaskId: ${response.data.taskId}`);
        
        // 폴링으로 완성 대기
        return await this.pollForCompletion(response.data.taskId, geminiPrompt, formData.duration);
        
      } else if (response.data.data && response.data.data[0]) {
        // 즉시 완성된 경우 (데모 또는 캐시된 결과)
        const sunoData = response.data.data[0];
        
        console.log('✅ Music generation completed immediately');
        
        return {
          prompt: geminiPrompt,
          audioUrl: sunoData.audio_url,
          title: sunoData.title,
          duration: sunoData.duration || formData.duration,
          imageUrl: sunoData.image_url
        };
      } else {
        throw new ApiError('Invalid response format from music generation API');
      }
      
    } catch (error: any) {
      console.error('❌ Music generation failed:', error.message);
      throw new ApiError(
        error?.response?.data?.error || error?.message || 'Failed to generate music', 
        error?.response?.status
      );
    }
  }

  // 음악 생성 완료를 위한 폴링 함수
  static async pollForCompletion(taskId: string, prompt: string, duration: number): Promise<MusicGenerationResult> {
    const maxAttempts = 18; // 3분 최대 대기 (10초 간격)
    const baseInterval = 10000; // 10초 기본 간격
    let pollInterval = baseInterval;
    
    // AbortController 생성 및 저장
    const controller = new AbortController();
    this.pollingControllers.set(taskId, controller);
    
    console.log(`🔄 Starting polling for taskId: ${taskId}`);
    
    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // 폴링이 취소되었는지 확인
        if (controller.signal.aborted) {
          console.log('🛑 Polling was cancelled');
          throw new ApiError('Polling was cancelled by user');
        }
        
        try {
        // 첫 번째 시도가 아니면 대기
        if (attempt > 0) {
          console.log(`⏳ Polling attempt ${attempt + 1}/${maxAttempts}, waiting ${pollInterval/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        
        // 상태 확인 (폴링 전용 API 사용)
        console.log(`🔍 Checking status for taskId: ${taskId}`);
        const statusResponse = await pollingApi.get(`/api/suno-result/${taskId}`);
        
        console.log(`📡 Status response:`, statusResponse.data);
        
        if (statusResponse.data.success && statusResponse.data.data) {
          const result = statusResponse.data.data;
          
          if (result.status === 'completed' && result.audio_url) {
            console.log('✅ Music generation completed successfully!');
            return {
              prompt: prompt,
              audioUrl: result.audio_url,
              title: result.title || 'AI Generated Music',
              duration: result.duration || duration,
              imageUrl: result.image_url
            };
          } else if (result.status === 'failed') {
            console.error('❌ Music generation failed on server');
            throw new ApiError('Music generation failed on server');
          }
          
          // processing 상태면 계속 대기
          console.log(`⏳ Still processing... (${result.status || 'unknown'})`);
        } else {
          console.log('⚠️ No data in response, continuing to poll...');
        }
        
        // 점진적으로 폴링 간격 증가 (백오프)
        pollInterval = Math.min(pollInterval * 1.2, 20000); // 최대 20초
        
      } catch (error: any) {
        console.warn(`⚠️ Polling attempt ${attempt + 1} failed:`, error.message);
        
        // 404나 네트워크 에러는 재시도
        if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
          console.log('🔄 Retrying due to network/404 error...');
          continue;
        }
        
        // 마지막 시도라면 에러 발생
        if (attempt === maxAttempts - 1) {
          console.error('❌ All polling attempts exhausted');
          break;
        }
      }
    }
    
    // 타임아웃 시 데모 폴백 제공
    console.log('⏰ Polling timeout, providing demo fallback');
    try {
      const demoResult = await SunoService.generateDemoFallback(prompt, duration);
      console.log('🎭 Demo fallback provided successfully');
      
      return {
        prompt: prompt,
        audioUrl: demoResult.audio_url,
        title: demoResult.title || 'Demo Music (Generation Timeout)',
        duration: demoResult.duration || duration,
        imageUrl: demoResult.image_url
      };
    } catch (demoError) {
      console.error('❌ Demo fallback also failed:', demoError);
      throw new ApiError('Music generation timeout and demo fallback failed - please try again');
    }
    } finally {
      // 폴링 완료 시 컨트롤러 정리
      this.pollingControllers.delete(taskId);
      console.log(`🧹 Cleaned up polling controller for taskId: ${taskId}`);
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
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
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
  
  // 새로운 메서드: 음악 생성 시작 (올바른 sunoapi.org 엔드포인트 사용)
  static async startMusicGeneration(prompt: string, duration: number = 30): Promise<{ taskId: string }> {
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      throw new Error('Suno API key not found. Please set SUNO_API_KEY in environment variables.');
    }

    console.log('🎼 Starting music generation with correct sunoapi.org endpoint...');

    const url = `${this.SUNO_API_URL}/api/v1/generate`;
    
    const requestBody = {
      prompt: prompt,
      model: 'V3_5', // sunoapi.org 지원 모델 (올바른 형식)
      wait_audio: false, // 비동기 방식
      customMode: true, // SunoAPI.org 필수 파라미터
      instrumental: false, // 가사 포함 음악 생성
      callBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mymoodlist.com'}/api/suno-callback`
    };

    console.log('📤 Starting generation with request:', { 
      prompt: prompt.substring(0, 100) + '...', 
      model: requestBody.model,
      wait_audio: requestBody.wait_audio 
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`📡 Generation start response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SunoAPI.org generation start error:', errorText);
      throw new Error(`SunoAPI.org error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Generation started successfully:', result);

    // sunoapi.org 실제 응답 형식에 맞춰 처리
    if (result.code === 200 && result.data && result.data.taskId) {
      const taskId = result.data.taskId;
      
      console.log('✅ Extracted taskId:', taskId);
      
      // 저장소에 작업 등록
      try {
        const { callbackStorage } = await import('@/lib/storage');
        await callbackStorage.registerTask(taskId);
      } catch (storageError) {
        console.warn('Storage registration failed, continuing without it:', storageError);
      }
      
      return { taskId: taskId };
    } else {
      console.error('Unexpected response format:', result);
      throw new Error(`Unexpected response format: ${JSON.stringify(result)}`);
    }
  }
  
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

    const url = `${this.SUNO_API_URL}/api/v1/query?taskId=${taskId}`;
    
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