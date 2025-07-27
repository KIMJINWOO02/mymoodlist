import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate music with Suno API
    const sunoResponse = await SunoService.generateMusic(prompt, duration || 60);
    
    // 실제 재생 가능한 데모 음악으로 응답
    const mockResponse = {
      prompt,
      audioUrl: '/api/demo-audio', // 실제 재생 가능한 데모 오디오
      title: 'AI Generated Music',
      duration: 5, // 실제 데모 음악 길이
      imageUrl: null
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error in generate-music API:', error);
    return NextResponse.json(
      { error: 'Failed to generate music' },
      { status: 500 }
    );
  }
}