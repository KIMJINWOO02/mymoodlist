import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/lib/api';
import { sanitizeInput, sanitizeErrorMessage, isInputSafe } from '@/lib/validation';
import { corsResponse, handleCorsOptions } from '@/lib/cors';
import { createRateLimitMiddleware, RATE_LIMITS } from '@/lib/rateLimit';
import { z } from 'zod';

// 음악 생성 요청 검증 스키마
const musicGenerationSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(5000, 'Prompt is too long (max 5000 characters)')
    .transform(sanitizeInput),
  duration: z.number()
    .min(10, 'Duration must be at least 10 seconds')
    .max(300, 'Duration cannot exceed 300 seconds')
    .default(30),
  formData: z.object({
    scene: z.string().max(500).optional(),
    mood: z.string().max(500).optional(),
    genre: z.string().max(500).optional(),
    useCase: z.string().max(500).optional(),
    instruments: z.string().max(500).optional(),
    additional: z.string().max(1000).optional(),
  }).optional()
});

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  return corsResponse({
    message: 'Suno AI Music generation API is working!',
    timestamp: new Date().toISOString(),
    endpoint: '/api/music/generate', 
    status: 'ready'
  }, 200, origin || undefined);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    console.log('🎵 Suno AI Music generation API called');
    
    // 레이트 리미팅 체크
    const rateLimitCheck = createRateLimitMiddleware(RATE_LIMITS.MUSIC_GENERATION)(request);
    if (!rateLimitCheck.success) {
      return corsResponse({
        success: false,
        error: rateLimitCheck.error,
        retryAfter: rateLimitCheck.retryAfter
      }, 429, origin || undefined);
    }
    
    // 요청 바디 파싱
    const body = await request.json();
    
    // 입력 검증
    const validationResult = musicGenerationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('❌ Validation failed:', validationResult.error);
      return corsResponse({ 
        success: false,
        error: 'Invalid input parameters',
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, 400, origin || undefined);
    }

    const { prompt, duration, formData } = validationResult.data;
    
    // 추가 보안 검증
    if (!isInputSafe(prompt)) {
      console.error('❌ Unsafe input detected:', prompt.substring(0, 100));
      return corsResponse({ 
        success: false,
        error: 'Input contains potentially unsafe content'
      }, 400, origin || undefined);
    }
    
    console.log('📋 Validated request details:', {
      prompt: prompt.substring(0, 100) + '...',
      duration,
      hasFormData: !!formData
    });

    // 데모 모드는 환경변수로만 제어 (기본값: false)
    const DEMO_MODE = process.env.FORCE_DEMO_MODE === 'true';
    
    if (DEMO_MODE) {
      console.log('🎭 Demo mode enabled, providing immediate demo music');
      
      try {
        const demoResult = await SunoService.generateDemoFallback(prompt, duration);
        
        return corsResponse({
          success: true,
          message: 'Music generation completed with demo (Demo mode enabled)',
          provider: 'demo_immediate',
          data: [{
            id: demoResult.id,
            title: sanitizeInput(demoResult.title || 'AI Generated Demo Music'),
            audio_url: demoResult.audio_url,
            image_url: demoResult.image_url,
            status: demoResult.status,
            duration: demoResult.duration || duration
          }],
          note: 'Demo mode is currently enabled for faster response'
        }, 200, origin || undefined);
        
      } catch (demoError) {
        console.error('❌ Demo mode also failed:', demoError);
      }
    }
    
    // SunoAPI.org를 사용한 실제 음악 생성 시도
    let taskId: string | null = null;
    
    try {
      console.log('🎼 Starting music generation with SunoAPI.org...');
      console.log('🔧 Environment check:', {
        hasApiKey: !!process.env.SUNO_API_KEY,
        apiKeyFirst10: process.env.SUNO_API_KEY?.substring(0, 10) + '...',
        apiUrl: process.env.SUNO_API_URL
      });
      
      // 즉시 taskId 반환 방식으로 음악 생성 시작
      const taskResult = await SunoService.startMusicGeneration(prompt, duration);
      taskId = taskResult.taskId;
      
      console.log('✅ Music generation task started:', {
        taskId: taskId,
        status: 'processing'
      });

      // taskId와 함께 즉시 응답 반환
      return corsResponse({
        success: true,
        message: 'Music generation started with SunoAPI.org',
        provider: 'sunoapi.org',
        taskId: taskId,
        status: 'processing',
        estimatedTime: '30-60 seconds',
        pollUrl: `/api/suno-result/${taskId}`,
        fallbackAvailable: true // 클라이언트에게 폴백 가능함을 알림
      }, 200, origin || undefined);

    } catch (sunoError) {
      console.error('❌ SunoAPI.org Error:', {
        message: sunoError instanceof Error ? sunoError.message : sunoError,
        stack: sunoError instanceof Error ? sunoError.stack : undefined
      });
      
      // API 키 관련 에러인지 확인
      const isApiKeyError = sunoError instanceof Error && 
        (sunoError.message.includes('API key') || 
         sunoError.message.includes('401') || 
         sunoError.message.includes('403') ||
         sunoError.message.includes('unauthorized'));
      
      if (isApiKeyError) {
        console.log('🔑 API key issue detected, providing immediate demo fallback');
        
        try {
          const demoResult = await SunoService.generateDemoFallback(prompt, duration);
          
          return corsResponse({
            success: true,
            message: 'Music generation completed with demo (API key issue)',
            provider: 'demo_immediate',
            data: [{
              id: demoResult.id,
              title: sanitizeInput(demoResult.title || 'AI Generated Demo Music'),
              audio_url: demoResult.audio_url,
              image_url: demoResult.image_url,
              status: demoResult.status,
              duration: demoResult.duration || duration
            }],
            note: 'Demo provided immediately due to API authentication issue'
          }, 200, origin || undefined);
          
        } catch (demoError) {
          console.error('❌ Immediate demo fallback failed:', demoError);
        }
      }
      
      // 다른 에러의 경우 기본 에러 응답
      return corsResponse({
        success: false,
        error: 'Music generation temporarily unavailable',
        details: 'Please try again in a few moments. If the problem persists, contact support.',
        canRetry: true
      }, 503, origin || undefined);
    }
    
  } catch (error) {
    console.error('❌ Music generation API error:', error);
    
    return corsResponse({ 
      success: false,
      error: 'Music generation failed',
      details: sanitizeErrorMessage(error)
    }, 500, origin || undefined);
  }
}