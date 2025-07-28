import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Simple Music Generation Test');
    
    const { prompt = "happy upbeat music" } = await request.json();
    
    // 환경 변수 확인
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL || 'https://api.sunoapi.org';
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'SUNO_API_KEY not found in environment variables',
        fallback: 'Using demo music instead'
      }, { status: 200 });
    }
    
    console.log('🔑 API Key available:', apiKey.substring(0, 10) + '...');
    console.log('🌐 API URL:', apiUrl);
    console.log('📝 Prompt:', prompt.substring(0, 50) + '...');
    
    // 단순한 Suno API 호출 테스트
    const endpoint = `${apiUrl}/api/v1/generate`;
    
    const requestBody = {
      prompt: prompt,
      customMode: true,
      instrumental: false,
      wait_audio: false, // 비동기 방식
      model: 'V3_5'
    };
    
    console.log('📤 Sending request to:', endpoint);
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
    
    console.log(`📡 Response received in ${responseTime}ms`);
    console.log('📊 Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response from Suno API',
        rawResponse: responseText.substring(0, 500),
        status: response.status,
        responseTime: responseTime
      }, { status: 500 });
    }
    
    // 성공 응답 처리
    if (response.ok && responseData.code === 200) {
      console.log('✅ Suno API call successful');
      
      return NextResponse.json({
        success: true,
        message: 'Suno API connection successful',
        data: responseData,
        responseTime: responseTime,
        endpoint: endpoint
      }, { status: 200 });
    } else {
      console.error('❌ Suno API call failed');
      
      return NextResponse.json({
        success: false,
        error: 'Suno API call failed',
        status: response.status,
        statusText: response.statusText,
        responseData: responseData,
        responseTime: responseTime,
        endpoint: endpoint
      }, { status: response.status || 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Test music generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test music generation failed',
      details: error.message,
      stack: error.stack?.substring(0, 500)
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to this endpoint with a prompt to test music generation',
    example: {
      method: 'POST',
      body: { prompt: 'happy upbeat music' }
    }
  });
}