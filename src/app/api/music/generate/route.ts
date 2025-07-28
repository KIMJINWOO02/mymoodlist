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

    // 임시로 즉시 데모 음악 제공 (API 문제 해결까지)
    console.log('🎭 Providing demo music while API issues are resolved...');
    
    try {
      const demoResult = await SunoService.generateDemoFallback(prompt, duration);
      
      return corsResponse({
        success: true,
        message: 'Music generated successfully (demo mode)',
        provider: 'demo',
        data: [{
          id: demoResult.id,
          title: sanitizeInput(demoResult.title || 'AI Generated Demo Music'),
          audio_url: demoResult.audio_url,
          image_url: demoResult.image_url,
          status: demoResult.status,
          duration: demoResult.duration || duration
        }],
        note: 'Demo mode active - working to restore full API functionality'
      }, 200, origin || undefined);
      
    } catch (demoError) {
      console.error('❌ Even demo fallback failed:', demoError);
      
      return corsResponse({
        success: false,
        error: 'Music generation temporarily unavailable',
        details: 'Both API and demo systems are currently unavailable. Please try again later.'
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