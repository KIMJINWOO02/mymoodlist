import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    const apiKey = process.env.SUNO_API_KEY;
    const apiUrl = process.env.SUNO_API_URL;
    
    console.log('🔍 Checking Suno status for taskId:', taskId);
    
    if (!apiKey || !apiUrl) {
      return NextResponse.json({
        error: 'API configuration missing',
        taskId: taskId
      }, { status: 500 });
    }

    console.log('🔍 Skipping Suno API status check (endpoints not supported)');
    console.log('💡 Relying on callback mechanism instead');

    // 상태 확인 실패 - 로컬 저장소에서 확인
    const localResult = await callbackStorage.getResult(taskId);
    
    if (localResult) {
      return NextResponse.json({
        success: true,
        status: localResult.status,
        taskId: taskId,
        source: 'local_storage',
        data: localResult
      });
    }

    // 모든 방법 실패
    return NextResponse.json({
      success: false,
      status: 'unknown',
      taskId: taskId,
      message: 'Could not determine task status',
      debug: {
        triedMethods: ['local_storage', 'callback_mechanism'],
        hasLocalStorage: false,
        skippedSunoAPI: 'endpoints_not_supported'
      }
    }, { status: 404 });

  } catch (error) {
    console.error('❌ Status check error:', error);
    
    return NextResponse.json({
      error: 'Failed to check task status',
      taskId: params.taskId,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}