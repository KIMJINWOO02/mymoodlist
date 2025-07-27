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

    // Suno AI로 실제 음악 생성 시도
    try {
      console.log('🎼 Generating music with Suno AI...');
      console.log('🔧 Environment check:', {
        hasApiKey: !!process.env.SUNO_API_KEY,
        apiKeyFirst10: process.env.SUNO_API_KEY?.substring(0, 10) + '...',
        apiUrl: process.env.SUNO_API_URL
      });
      
      const sunoResult = await SunoService.generateMusic(prompt, duration);
      
      console.log('✅ Suno AI generation successful:', {
        id: sunoResult.id,
        status: sunoResult.status,
        hasAudio: !!sunoResult.audio_url
      });

      // Suno AI 응답을 표준 형식으로 변환
      return corsResponse({
        success: true,
        message: 'Music generation completed with Suno AI',
        provider: 'suno',
        data: [{
          id: sunoResult.id,
          title: sanitizeInput(sunoResult.title || 'AI Generated Music'),
          audio_url: sunoResult.audio_url,
          image_url: sunoResult.image_url,
          status: sunoResult.status,
          duration: sunoResult.duration || duration
        }]
      }, 200, origin || undefined);

    } catch (sunoError) {
      console.error('❌ DETAILED Suno AI Error:', {
        message: sunoError instanceof Error ? sunoError.message : sunoError,
        stack: sunoError instanceof Error ? sunoError.stack : undefined,
        name: sunoError instanceof Error ? sunoError.name : undefined
      });
      
      // Suno AI 실패시 데모 음악으로 폴백
      const demoResult = await SunoService.generateDemoFallback(prompt, duration);
      
      return corsResponse({
        success: true,
        message: 'Music generation completed with demo fallback',
        provider: 'demo',
        warning: 'Using demo audio - Suno API failed',
        errorDetails: sanitizeErrorMessage(sunoError),
        data: [{
          id: demoResult.id,
          title: sanitizeInput(demoResult.title || 'Generated Music'),
          audio_url: demoResult.audio_url,
          image_url: demoResult.image_url,
          status: demoResult.status,
          duration: demoResult.duration
        }]
      }, 200, origin || undefined);
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