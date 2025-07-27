import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';
import { FormData as MusicFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData: MusicFormData = await request.json();
    
    // Validate required fields
    if (!formData.scene || !formData.mood) {
      return NextResponse.json(
        { error: 'Scene and mood are required' },
        { status: 400 }
      );
    }

    const prompt = await GeminiService.generateMusicPrompt(formData);
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error in generate-prompt API:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}