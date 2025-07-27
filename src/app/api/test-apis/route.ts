import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = {
      gemini: {
        configured: !!process.env.GEMINI_API_KEY,
        apiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not Set'
      },
      suno: {
        configured: !!process.env.SUNO_API_KEY && !!process.env.SUNO_API_URL,
        apiKey: process.env.SUNO_API_KEY ? 'Set' : 'Not Set',
        apiUrl: process.env.SUNO_API_URL || 'Not Set'
      }
    };

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check API status' },
      { status: 500 }
    );
  }
}