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
    
    // 여러 가능한 base URL과 엔드포인트 조합 시도
    const baseUrls = [
      'https://api.sunoapi.org',
      'https://sunoapi.org',
      'https://api.suno.ai',
      'https://suno.ai/api'
    ];
    
    const paths = [
      '/api/v1/generate',
      '/v1/generate', 
      '/api/generate',
      '/generate'
    ];
    
    const endpoints = [];
    baseUrls.forEach(base => {
      paths.forEach(path => {
        endpoints.push(base + path);
      });
    });
    
    // 올바른 SunoAPI.org 요청 형식들
    const testRequests = [
      {
        prompt: prompt,
        style: "AI Generated", 
        title: "AI Generated Music",
        customMode: true,
        instrumental: false,
        model: "V3_5",
        callBackUrl: "https://mymoodlist.com/api/suno-callback"
      },
      {
        prompt: prompt,
        customMode: false,
        instrumental: false
      },
      {
        prompt: prompt,
        model: "V3_5"
      },
      {
        prompt: prompt
      }
    ];
    
    const results = [];
    
    // 일부 엔드포인트만 테스트 (너무 많으면 시간 초과)
    const limitedEndpoints = endpoints.slice(0, 8);
    
    for (const endpoint of limitedEndpoints) {
      for (let reqIndex = 0; reqIndex < testRequests.length; reqIndex++) {
        const testRequest = testRequests[reqIndex];
        
        try {
          console.log(`🔍 Testing: ${endpoint} with request format ${reqIndex + 1}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testRequest)
          });
          
          const responseText = await response.text();
          
          const result = {
            endpoint,
            requestFormat: reqIndex + 1,
            status: response.status,
            statusText: response.statusText,
            success: response.ok,
            response: responseText.substring(0, 300),
            requestBody: testRequest
          };
          
          results.push(result);
          
          if (response.ok) {
            console.log(`✅ Working combination found: ${endpoint} with format ${reqIndex + 1}`);
            return NextResponse.json({
              success: true,
              message: 'Working endpoint found!',
              workingEndpoint: endpoint,
              workingFormat: testRequest,
              results
            });
          }
          
          // 404가 아닌 다른 오류면 이 엔드포인트는 존재하지만 요청 형식 문제
          if (response.status !== 404) {
            console.log(`🔧 Endpoint exists but has issues: ${endpoint} (${response.status})`);
            // 다른 요청 형식도 시도
            continue;
          } else {
            // 404면 이 엔드포인트는 존재하지 않으므로 다음 엔드포인트로
            break;
          }
          
        } catch (error: any) {
          results.push({
            endpoint,
            requestFormat: reqIndex + 1,
            error: error.message,
            success: false
          });
        }
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