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
    
    // 1단계: 저장소에서 결과 조회
    let result = await callbackStorage.getResult(taskId);
    console.log('💾 Storage result:', result ? {
      status: result.status,
      hasAudioUrl: !!result.audioUrl,
      title: result.title
    } : 'null');
    
    // 2단계: 저장소에 결과가 없거나 pending이면 ALWAYS Suno API에 직접 상태 확인
    if (!result || result.status === 'pending') {
      console.log('🔍 Always checking Suno API directly for taskId:', taskId);
      
      try {
        // Suno API에 직접 상태 확인
        const sunoStatus = await checkSunoTaskStatusDirect(taskId);
        
        if (sunoStatus) {
          console.log('📥 Retrieved status from Suno API:', {
            status: sunoStatus.status,
            hasAudioUrl: !!sunoStatus.audio_url,
            title: sunoStatus.title,
            fullResponse: sunoStatus
          });
          
          // 완료된 경우 저장소에 결과 저장
          if (sunoStatus.status === 'completed' || sunoStatus.status === 'complete') {
            await callbackStorage.saveCallback(taskId, {
              audio_url: sunoStatus.audio_url,
              title: sunoStatus.title,
              duration: sunoStatus.duration,
              image_url: sunoStatus.image_url,
              status: 'completed'
            });
            
            // 업데이트된 결과 다시 조회
            result = await callbackStorage.getResult(taskId);
          } else if (sunoStatus.status === 'failed' || sunoStatus.status === 'error') {
            await callbackStorage.saveCallback(taskId, {
              status: 'failed',
              error: sunoStatus.error || 'Generation failed'
            });
            result = await callbackStorage.getResult(taskId);
          }
        }
      } catch (directCheckError) {
        console.warn('⚠️ Direct Suno API check failed:', directCheckError);
        // 직접 확인 실패해도 계속 진행
      }
    }
    
    // 3단계: 결과 없으면 처리 중으로 응답
    if (!result) {
      console.log('❓ No result found for taskId:', taskId);
      
      const responseData = {
        success: false,
        data: {
          id: taskId,
          status: 'processing',
          message: 'Music generation in progress...'
        }
      };
      console.log('📤 Returning processing response:', responseData);
      
      return corsResponse(responseData, 200, origin || undefined);
    }
    
    // 4단계: 상태별 응답 처리
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

// Suno API에 직접 상태 확인하는 헬퍼 함수
async function checkSunoTaskStatusDirect(taskId: string) {
  const apiKey = process.env.SUNO_API_KEY;
  const apiUrl = process.env.SUNO_API_URL;
  
  if (!apiKey || !apiUrl) {
    console.log('⚠️ Suno API credentials not available for direct check');
    return null;
  }
  
  try {
    console.log('📡 Checking Suno API status for taskId:', taskId);
    console.log('🔧 Using API URL:', `${apiUrl}/api/v1/query?taskId=${taskId}`);
    console.log('🔑 API Key available:', !!apiKey, 'Length:', apiKey?.length);
    
    // SunoAPI.org의 query 엔드포인트 사용
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃으로 증가
    
    const response = await fetch(`${apiUrl}/api/v1/query?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    console.log('📡 Suno API Response Status:', response.status, response.statusText);
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('⚠️ Suno API status check failed:', response.status);
      return null;
    }
    
    const result = await response.json();
    console.log('📥 Suno API raw response:', JSON.stringify(result, null, 2));
    
    if (result.code === 200 && result.data) {
      const sunoData = result.data;
      console.log('🔍 Parsed Suno data:', {
        status: sunoData.status,
        hasAudioUrl: !!sunoData.audio_url,
        title: sunoData.title,
        created_at: sunoData.created_at,
        model_name: sunoData.model_name
      });
      
      return {
        id: taskId,
        status: sunoData.status === 'complete' ? 'completed' : sunoData.status,
        audio_url: sunoData.audio_url,
        title: sunoData.title,
        duration: sunoData.duration,
        image_url: sunoData.image_url,
        error: sunoData.error
      };
    } else {
      console.log('❌ Unexpected Suno API response format:', {
        code: result.code,
        hasData: !!result.data,
        message: result.message
      });
    }
    
    return null;
  } catch (error) {
    console.warn('⚠️ Direct Suno API check error:', error);
    return null;
  }
}