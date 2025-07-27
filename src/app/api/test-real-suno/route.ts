import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Starting real Suno API test...');
    
    const testPrompt = "Create a gentle, peaceful instrumental music with soft piano and strings";
    const testDuration = 30;
    
    console.log('📤 Calling Suno API with test prompt...');
    
    // 실제 Suno API 호출 테스트
    const result = await SunoService.generateMusic(testPrompt, testDuration);
    
    console.log('✅ Suno API test successful:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Suno API test completed successfully',
      result: result,
      testDetails: {
        prompt: testPrompt,
        duration: testDuration,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Suno API test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Suno API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}