import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Debug Real Music Generation');
    
    const { prompt = "debug test music", duration = 30 } = await request.json();
    
    console.log('Input:', { prompt, duration });
    
    // 실제 startMusicGeneration 함수 직접 호출
    try {
      console.log('Calling SunoService.startMusicGeneration...');
      const result = await SunoService.startMusicGeneration(prompt, duration);
      
      console.log('✅ startMusicGeneration SUCCESS:', result);
      
      return NextResponse.json({
        success: true,
        message: 'Real music generation successful',
        taskId: result.taskId,
        provider: 'suno'
      });
      
    } catch (sunoError: any) {
      console.error('❌ startMusicGeneration FAILED:', sunoError);
      console.error('Error message:', sunoError.message);
      console.error('Error stack:', sunoError.stack);
      
      return NextResponse.json({
        success: false,
        error: 'SunoAPI call failed in real function',
        details: sunoError.message,
        stack: sunoError.stack?.substring(0, 500)
      });
    }
    
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint failed',
      details: error.message
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to debug real music generation',
    usage: 'POST with body: { prompt: "test", duration: 30 }'
  });
}