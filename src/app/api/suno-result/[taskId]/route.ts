import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';
import { corsResponse, handleCorsOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleCorsOptions(request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const origin = request.headers.get('origin');
  
  try {
    const { taskId } = params;
    
    console.log('🔍 Checking Suno result status for taskId:', taskId);
    
    // 저장소에서 결과 조회
    const result = await callbackStorage.getResult(taskId);
    
    if (!result) {
      console.log('❓ No result found for taskId:', taskId);
      
      return corsResponse({
        success: false,
        data: {
          id: taskId,
          status: 'processing',
          message: 'Music generation in progress...'
        }
      }, 200, origin || undefined);
    }
    
    if (result.status === 'pending') {
      console.log('⏳ Task still pending for taskId:', taskId);
      return corsResponse({
        success: false,
        data: {
          id: taskId,
          status: 'processing',
          message: 'Music generation in progress...'
        }
      }, 200, origin || undefined);
    }
    
    if (result.status === 'failed') {
      console.log('❌ Task failed for taskId:', taskId);
      return corsResponse({
        success: false,
        data: {
          id: taskId,
          status: 'failed',
          error: result.error || 'Music generation failed'
        }
      }, 200, origin || undefined);
    }
    
    if (result.status === 'completed' && result.audioUrl) {
      console.log('✅ Music generation completed for taskId:', taskId);
      
      return corsResponse({
        success: true,
        data: {
          id: taskId,
          status: 'completed',
          audio_url: result.audioUrl,
          title: result.title || 'AI Generated Music',
          duration: result.duration,
          image_url: result.imageUrl
        }
      }, 200, origin || undefined);
    }
    
    // 완료되었지만 오디오 URL이 없는 경우
    console.log('⚠️ Task completed but no audio URL available for taskId:', taskId);
    return corsResponse({
      success: false,
      data: {
        id: taskId,
        status: 'failed',
        error: 'Audio generation failed - no audio URL'
      }
    }, 200, origin || undefined);
    
  } catch (error) {
    console.error('❌ Suno result check error:', error);
    
    return corsResponse({
      success: false,
      error: 'Failed to check music generation status'
    }, 500, origin || undefined);
  }
}