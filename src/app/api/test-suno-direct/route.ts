import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Direct Suno API Test');
    
    const { prompt = "happy music" } = await request.json();
    
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SUNO_API_KEY not configured'
      });
    }
    
    // 여러 가능한 엔드포인트 시도
    const endpoints = [
      'https://api.sunoapi.org/api/v1/music/generate',
      'https://api.sunoapi.org/api/generate',  
      'https://api.sunoapi.org/v1/generate',
      'https://api.sunoapi.org/generate'
    ];
    
    const testPrompt = {
      prompt: prompt,
      model: 'chirp-v3-5',
      wait_audio: false
    };
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPrompt)
        });
        
        const responseText = await response.text();
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          response: responseText.substring(0, 500)
        });
        
        if (response.ok) {
          console.log(`✅ Working endpoint found: ${endpoint}`);
          break;
        }
        
      } catch (error: any) {
        results.push({
          endpoint,
          error: error.message,
          success: false
        });
      }
    }
    
    return NextResponse.json({
      success: results.some(r => r.success),
      message: 'Suno API endpoint test results',
      results,
      recommendation: results.find(r => r.success)?.endpoint || 'No working endpoint found'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to test Suno API endpoints',
    usage: 'POST with body: {"prompt": "test music"}'
  });
}