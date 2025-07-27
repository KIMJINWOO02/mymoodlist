import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;
    
    console.log('🧪 Simple Suno API test...');
    console.log('API Key exists:', !!apiKey);
    console.log('API URL:', apiUrl);

    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key',
        success: false
      });
    }

    // 최소한의 요청으로 테스트
    const response = await fetch(`${apiUrl}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: "happy music",
        customMode: true,
        instrumental: false,
        model: "V3_5",
        callBackUrl: "http://localhost:3000/api/suno-callback"
      })
    });

    console.log('📡 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      response: responseData,
      headers: Object.fromEntries(response.headers.entries())
    });

  } catch (error) {
    console.error('🚨 Simple test error:', error);
    
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error),
      success: false
    });
  }
}