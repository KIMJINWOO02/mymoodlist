import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎵 CALLBACK RECEIVED!!! Suno callback received:', body);
    console.log('📄 CALLBACK DATA:', JSON.stringify(body, null, 2));
    console.log('🔍 CALLBACK TaskId extraction attempt...');
    
    // taskId 추출 (여러 가능한 필드에서)
    const taskId = body.taskId || body.task_id || body.id || body.requestId;
    
    console.log('🔍 Extracted TaskId:', taskId);
    console.log('🔍 Available fields:', Object.keys(body));
    console.log('🔍 Possible TaskId fields:', {
      taskId: body.taskId,
      task_id: body.task_id, 
      id: body.id,
      requestId: body.requestId
    });
    
    if (taskId) {
      // 콜백 데이터 저장
      await callbackStorage.saveCallback(taskId, body);
      console.log('✅ CALLBACK SAVED! TaskId:', taskId);
    } else {
      console.error('❌ NO TASKID FOUND! Available keys:', Object.keys(body));
      console.error('❌ Full body:', body);
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