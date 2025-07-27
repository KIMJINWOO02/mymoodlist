import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'SUNO_API_KEY not found',
        success: false
      });
    }

    console.log('🎵 Testing Suno generate endpoints...');

    // 일반적인 음악 생성 엔드포인트들 테스트
    const generateEndpoints = [
      '/api/generate',
      '/api/v1/generate',
      '/generate',
      '/api/music/generate',
      '/api/v1/music/generate',
      '/api/custom_generate',
      '/api/v1/songs'
    ];

    const testPrompt = "happy upbeat pop song";
    const results = [];

    for (const endpoint of generateEndpoints) {
      try {
        console.log(`🔄 Testing generate endpoint: ${apiUrl}${endpoint}`);
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: testPrompt,
            instrumental: false,  // make_instrumental -> instrumental
            wait_audio: false
          })
        });

        const status = response.status;
        let responseData = null;
        
        try {
          const text = await response.text();
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = text.substring(0, 300);
          }
        } catch (e) {
          responseData = 'Could not read response';
        }

        results.push({
          endpoint,
          status,
          success: status < 400,
          response: responseData
        });

        console.log(`📡 ${endpoint}: ${status}`, responseData);

        // 성공한 엔드포인트가 있으면 추가 정보 수집
        if (status < 400) {
          console.log('✅ Found working endpoint:', endpoint);
          break;
        }

      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Generate endpoint testing completed',
      results: results,
      workingEndpoints: results.filter(r => r.success),
      config: {
        apiUrl: apiUrl,
        hasApiKey: !!apiKey
      }
    });

  } catch (error) {
    console.error('🚨 Generate test error:', error);
    
    return NextResponse.json({
      error: 'Failed to test generate endpoints',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}