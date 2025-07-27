import { NextRequest, NextResponse } from 'next/server';
import { generateMusic, SunoApiError } from '@/lib/sunoApi';
import { FormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    console.log('🎵 POST /api/generate-music-v2 - Starting music generation');
    
    const body = await request.json();
    console.log('🎵 Request body received:', body);
    
    // 요청 데이터 검증
    if (!body || typeof body !== 'object') {
      console.error('❌ Invalid request body');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { prompt, duration, formData } = body;

    // 필수 필드 확인
    if (!prompt) {
      console.error('❌ Missing prompt field');
      return NextResponse.json(
        { error: 'Gemini prompt is required' },
        { status: 400 }
      );
    }

    console.log('🎵 Processing request:', { 
      hasPrompt: !!prompt, 
      duration, 
      hasFormData: !!formData 
    });

    // Suno API 호출 - Gemini 프롬프트와 duration 사용
    const sunoRequestData = {
      ...formData,
      generatedPrompt: prompt, // Gemini가 생성한 프롬프트
      duration: duration || 30
    } as FormData & { generatedPrompt: string };

    console.log('🎵 Calling Suno API with data:', sunoRequestData);

    const result = await generateMusic(sunoRequestData);

    if (!result.success) {
      console.error('❌ Suno API returned error:', result.error);
      return NextResponse.json(
        { error: result.error || 'Music generation failed' },
        { status: 500 }
      );
    }

    console.log('✅ Music generation successful:', result);

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Music generated successfully'
    });

  } catch (error) {
    console.error('❌ Music generation API error:', error);

    if (error instanceof SunoApiError) {
      // Suno API 에러 처리
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          details: 'Suno API integration error'
        },
        { status: error.status || 500 }
      );
    }

    // 일반 에러 처리
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET 메서드: API 상태 확인
export async function GET() {
  try {
    console.log('🔍 GET /api/generate-music-v2 - Status check called');
    
    // API 키 설정 확인
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;

    console.log('🔍 Environment check:', {
      hasApiKey: !!apiKey,
      hasApiUrl: !!apiUrl,
      apiUrl
    });

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { 
          error: 'Suno API not configured',
          configured: false,
          details: 'API key or URL missing from environment variables'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      configured: true,
      apiUrl: apiUrl,
      message: 'Music generation API v2 is ready',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ API status check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check API status',
        configured: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}