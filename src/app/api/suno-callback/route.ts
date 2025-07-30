import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  // 콜백 수신 시각 기록
  const receivedTime = new Date().toISOString();
  console.log(`🎵 CALLBACK RECEIVED AT ${receivedTime}!!!`);
  console.log('📡 Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('🌐 Request URL:', request.url);
  console.log('🔗 Request method:', request.method);
  
  try {
    const body = await request.json();
    
    console.log('🎵 SUNO CALLBACK DATA RECEIVED:', body);
    console.log('📄 FULL CALLBACK JSON:', JSON.stringify(body, null, 2));
    console.log('🔍 CALLBACK TaskId extraction attempt...');
    
    // taskId 추출 (여러 가능한 필드에서)
    const taskId = body.taskId || body.task_id || body.id || body.requestId || 
                   body.data?.task_id || body.data?.taskId || body.data?.id;
    
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
  console.log('🔍 GET request to suno-callback endpoint at:', new Date().toISOString());
  return NextResponse.json({
    message: 'Suno callback endpoint is ready',
    timestamp: new Date().toISOString()
  });
}

// 모든 HTTP 메서드 처리
export async function PUT(request: NextRequest) {
  console.log('🔍 PUT request to suno-callback:', new Date().toISOString());
  return POST(request);
}

export async function PATCH(request: NextRequest) {
  console.log('🔍 PATCH request to suno-callback:', new Date().toISOString());
  return POST(request);
}