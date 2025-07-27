import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '✅ NEW CODE DEPLOYED SUCCESSFULLY!',
    deploymentTime: new Date().toISOString(),
    version: '2.0-fixed-polling',
    currentTime: new Date().toLocaleString('ko-KR'),
    fixes: [
      'Real polling system implemented',
      'Demo fallback removed from main generation',
      'Direct Suno API status checking added',
      'Loading UI improved',
      'Client-side polling removed'
    ],
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSunoKey: !!process.env.SUNO_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    }
  });
}