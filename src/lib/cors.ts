import { NextResponse } from 'next/server';

// 허용된 도메인 목록
const ALLOWED_ORIGINS = [
  'https://mymoodlist.com',
  'https://www.mymoodlist.com',
  ...(process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000'] 
    : [])
];

// CORS 헤더 설정
export function setCorsHeaders(response: NextResponse, origin?: string): NextResponse {
  // Origin 검증
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token'
  );
  response.headers.set('Access-Control-Max-Age', '86400'); // 24시간 캐시

  return response;
}

// OPTIONS 요청 처리
export function handleCorsOptions(request: Request): NextResponse {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 200 });
  
  return setCorsHeaders(response, origin || undefined);
}

// API 응답에 CORS 헤더 추가
export function corsResponse(data: any, status = 200, origin?: string): NextResponse {
  const response = NextResponse.json(data, { status });
  return setCorsHeaders(response, origin);
}