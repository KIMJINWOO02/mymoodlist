import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId') || 'cac77ea96a82fc562098c7c865f5c53d'; // 방금 생성된 taskId 사용
    
    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key',
        success: false
      });
    }

    console.log('🔍 Testing status endpoints for taskId:', taskId);

    // 가능한 상태 확인 엔드포인트들 테스트
    const statusEndpoints = [
      `/api/v1/tasks/${taskId}`,
      `/api/v1/task/${taskId}`,
      `/api/v1/get?ids=${taskId}`,
      `/api/v1/songs/${taskId}`,
      `/api/v1/generate/${taskId}`,
      `/api/tasks/${taskId}`,
      `/api/task/${taskId}`,
      `/api/get?ids=${taskId}`,
      `/api/status/${taskId}`
    ];

    const results = [];

    for (const endpoint of statusEndpoints) {
      try {
        console.log(`🔄 Testing status endpoint: ${apiUrl}${endpoint}`);
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
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
        if (status < 400 && responseData && typeof responseData === 'object') {
          console.log('✅ Found working status endpoint:', endpoint);
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
      message: 'Status endpoint testing completed',
      taskId: taskId,
      results: results,
      workingEndpoints: results.filter(r => r.success),
      config: {
        apiUrl: apiUrl,
        hasApiKey: !!apiKey
      }
    });

  } catch (error) {
    console.error('🚨 Status test error:', error);
    
    return NextResponse.json({
      error: 'Failed to test status endpoints',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}