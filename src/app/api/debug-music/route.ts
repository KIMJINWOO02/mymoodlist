import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Music Generation Debug Check');
    
    // 환경 변수 확인
    const envCheck = {
      SUNO_API_KEY: !!process.env.SUNO_API_KEY,
      SUNO_API_KEY_LENGTH: process.env.SUNO_API_KEY?.length || 0,
      SUNO_API_KEY_PREFIX: process.env.SUNO_API_KEY?.substring(0, 10) || 'none',
      SUNO_API_URL: process.env.SUNO_API_URL || 'default',
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY?.length || 0,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'default',
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Environment Check:', envCheck);
    
    // Suno API 연결 테스트
    let sunoTest = { success: false, error: 'Not tested' };
    if (process.env.SUNO_API_KEY) {
      try {
        const testResponse = await fetch(`${process.env.SUNO_API_URL || 'https://api.sunoapi.org'}/api/v1/get?taskId=test`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
            'Content-Type': 'application/json',
          }
        });
        
        sunoTest = {
          success: testResponse.ok,
          status: testResponse.status,
          statusText: testResponse.statusText,
          error: testResponse.ok ? null : await testResponse.text()
        };
      } catch (error: any) {
        sunoTest = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Gemini API 연결 테스트  
    let geminiTest = { success: false, error: 'Not tested' };
    if (process.env.GEMINI_API_KEY) {
      try {
        const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Hello, test message'
              }]
            }]
          })
        });
        
        geminiTest = {
          success: testResponse.ok,
          status: testResponse.status,
          statusText: testResponse.statusText,
          error: testResponse.ok ? null : await testResponse.text()
        };
      } catch (error: any) {
        geminiTest = {
          success: false,
          error: error.message
        };
      }
    }
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      sunoApiTest: sunoTest,
      geminiApiTest: geminiTest,
      recommendations: []
    };
    
    // 권장사항 생성
    if (!envCheck.SUNO_API_KEY) {
      diagnostics.recommendations.push('❌ SUNO_API_KEY is missing - music generation will not work');
    } else if (envCheck.SUNO_API_KEY_LENGTH < 20) {
      diagnostics.recommendations.push('⚠️ SUNO_API_KEY seems too short - verify the key is correct');
    } else if (!sunoTest.success) {
      diagnostics.recommendations.push(`❌ Suno API connection failed: ${sunoTest.error}`);
    } else {
      diagnostics.recommendations.push('✅ Suno API key is configured and connection test passed');
    }
    
    if (!envCheck.GEMINI_API_KEY) {
      diagnostics.recommendations.push('❌ GEMINI_API_KEY is missing - prompt generation will not work');
    } else if (!geminiTest.success) {
      diagnostics.recommendations.push(`❌ Gemini API connection failed: ${geminiTest.error}`);
    } else {
      diagnostics.recommendations.push('✅ Gemini API key is configured and connection test passed');
    }
    
    return NextResponse.json(diagnostics, { status: 200 });
    
  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Debug check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}