import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    routes: {
      'POST /api/generate-prompt': 'Available',
      'POST /api/music/generate': 'Available',
      'GET /api/health': 'Available'
    },
    environment: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      sunoConfigured: !!process.env.SUNO_API_KEY
    }
  });
}