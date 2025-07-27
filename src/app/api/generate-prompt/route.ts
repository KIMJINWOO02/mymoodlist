import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';
import { FormData as MusicFormData } from '@/types';

export async function POST(request: NextRequest) {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://mymoodlist.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData: MusicFormData = await request.json();
    
    // Validate required fields
    if (!formData.scene || !formData.mood) {
      return NextResponse.json(
        { error: 'Scene and mood are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = await GeminiService.generateMusicPrompt(formData);
    
    return NextResponse.json({ prompt }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in generate-prompt API:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://mymoodlist.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}