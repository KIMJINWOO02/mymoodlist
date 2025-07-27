import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;
    
    console.log('🔍 Testing Suno API configuration...');
    console.log('API Key exists:', !!apiKey);
    console.log('API URL:', apiUrl);
    console.log('API Key (first 10 chars):', apiKey?.substring(0, 10) + '...');

    if (!apiKey) {
      return NextResponse.json({
        error: 'SUNO_API_KEY not found in environment variables',
        success: false
      });
    }

    // SunoAPI.org 여러 엔드포인트 테스트
    const testEndpoints = [
      '/api/v1/songs',
      '/api/songs', 
      '/api/generate',
      '/api/v1/generate',
      '/generate',
      '/api/status',
      '/api/health',
      '/health',
      '/'
    ];

    const results = [];
    
    for (const endpoint of testEndpoints) {
      try {
        console.log(`🔍 Testing endpoint: ${apiUrl}${endpoint}`);
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        });

        const status = response.status;
        let responseText = '';
        
        try {
          responseText = await response.text();
        } catch (e) {
          responseText = 'Could not read response';
        }

        results.push({
          endpoint,
          status,
          response: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
        });

        // 200이나 다른 성공적인 응답이 있으면 여기서 중단
        if (status < 400) {
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

    console.log('📊 All endpoint test results:', results);
    
    return NextResponse.json({
      success: true,
      message: 'Suno API endpoint testing completed',
      results: results,
      config: {
        hasApiKey: !!apiKey,
        apiUrl: apiUrl,
        apiKeyPreview: apiKey?.substring(0, 10) + '...'
      }
    });

  } catch (error) {
    console.error('🚨 Test error:', error);
    
    return NextResponse.json({
      error: 'Failed to test Suno API',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}