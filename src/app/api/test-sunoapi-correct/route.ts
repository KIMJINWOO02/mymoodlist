import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing correct SunoAPI.org endpoint');
    
    const { prompt = "happy upbeat music" } = await request.json();
    
    const apiKey = process.env.SUNO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SUNO_API_KEY not configured'
      });
    }
    
    // 올바른 sunoapi.org 엔드포인트
    const endpoint = 'https://api.sunoapi.org/api/v1/generate';
    
    const requestBody = {
      prompt: prompt,
      model: 'V3_5', // sunoapi.org에서 사용하는 모델명 (올바른 형식)
      wait_audio: false, // 비동기 방식
      customMode: true // SunoAPI.org 필수 파라미터
    };
    
    console.log('📤 Request to:', endpoint);
    console.log('📋 Request body:', requestBody);
    
    const startTime = Date.now();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const responseTime = Date.now() - startTime;
    const responseText = await response.text();
    
    console.log(`📡 Response received in ${responseTime}ms`);
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📄 Raw response:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response',
        rawResponse: responseText.substring(0, 500),
        status: response.status,
        responseTime: responseTime
      });
    }
    
    if (response.ok) {
      console.log('✅ SunoAPI.org call successful');
      
      return NextResponse.json({
        success: true,
        message: 'SunoAPI.org connection successful',
        data: responseData,
        responseTime: responseTime,
        endpoint: endpoint
      });
    } else {
      console.error('❌ SunoAPI.org call failed');
      
      return NextResponse.json({
        success: false,
        error: 'SunoAPI.org call failed',
        status: response.status,
        statusText: response.statusText,
        responseData: responseData,
        responseTime: responseTime,
        endpoint: endpoint
      });
    }
    
  } catch (error: any) {
    console.error('❌ Test API call error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test API call failed',
      details: error.message
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to test correct SunoAPI.org endpoint',
    endpoint: 'https://api.sunoapi.org/api/v1/generate',
    example: {
      method: 'POST',
      body: { prompt: 'happy upbeat music' }
    }
  });
}