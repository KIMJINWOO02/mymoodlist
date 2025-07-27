import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎵 Suno callback received:', body);
    console.log('📄 Callback data:', JSON.stringify(body, null, 2));
    
    // taskId 추출 (여러 가능한 필드에서)
    const taskId = body.taskId || body.task_id || body.id || body.requestId;
    
    if (taskId) {
      // 콜백 데이터 저장
      callbackStorage.saveCallback(taskId, body);
      console.log('✅ Callback data saved for taskId:', taskId);
    } else {
      console.warn('⚠️ No taskId found in callback data');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Callback received and processed',
      taskId: taskId,
      receivedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Suno callback error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process callback'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Suno callback endpoint is ready',
    timestamp: new Date().toISOString()
  });
}