import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    
    console.log('🔍 Fetching Suno result for taskId:', taskId);
    
    // 저장소 상태 디버깅
    const allTasks = await callbackStorage.getAllTasks();
    console.log('📊 Current storage state:', {
      totalTasks: allTasks.length,
      taskIds: allTasks.map(t => t.taskId),
      requestedTaskId: taskId
    });
    
    // 저장소에서 결과 조회
    const result = await callbackStorage.getResult(taskId);
    console.log('🎯 Query result for', taskId, ':', result ? 'FOUND' : 'NOT FOUND');
    
    if (!result) {
      console.log('❓ No result found for taskId:', taskId);
      console.log('📋 Available tasks:', allTasks.map(t => ({ id: t.taskId, status: t.status })));
      
      return NextResponse.json({
        error: 'Task not found',
        taskId: taskId,
        status: 'not_found',
        debug: {
          availableTasks: allTasks.length,
          taskIds: allTasks.map(t => t.taskId)
        }
      }, { status: 404 });
    }
    
    if (result.status === 'pending') {
      console.log('⏳ Task still pending for taskId:', taskId);
      return NextResponse.json({
        message: 'Music generation still in progress',
        taskId: taskId,
        status: 'pending',
        createdAt: result.createdAt
      }, { status: 202 });
    }
    
    if (result.status === 'failed') {
      console.log('❌ Task failed for taskId:', taskId);
      return NextResponse.json({
        error: 'Music generation failed',
        taskId: taskId,
        status: 'failed',
        details: result.error
      }, { status: 500 });
    }
    
    if (result.status === 'completed' && result.audioUrl) {
      console.log('✅ Serving completed audio for taskId:', taskId);
      
      // Suno API에서 받은 실제 오디오 URL로 프록시
      try {
        const audioResponse = await fetch(result.audioUrl);
        
        if (audioResponse.ok) {
          const audioBuffer = await audioResponse.arrayBuffer();
          
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': audioResponse.headers.get('content-type') || 'audio/mpeg',
              'Content-Length': audioBuffer.byteLength.toString(),
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=3600',
              'X-Generated-Title': result.title || 'AI Generated Music',
              'X-Generation-Duration': result.duration?.toString() || 'unknown'
            },
          });
        } else {
          throw new Error(`Failed to fetch audio from Suno: ${audioResponse.status}`);
        }
      } catch (audioError) {
        console.error('❌ Failed to fetch Suno audio:', audioError);
        
        // Suno 오디오 가져오기 실패시 데모 오디오로 폴백
        console.log('🔄 Falling back to demo audio');
        const fallbackResponse = await fetch('http://localhost:3000/api/demo-audio');
        
        if (fallbackResponse.ok) {
          const audioBuffer = await fallbackResponse.arrayBuffer();
          
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/wav',
              'Content-Length': audioBuffer.byteLength.toString(),
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=300',
              'X-Fallback-Audio': 'true'
            },
          });
        }
      }
    }
    
    // 완료되었지만 오디오 URL이 없는 경우
    console.log('⚠️ Task completed but no audio URL available, returning demo audio');
    const response = await fetch('http://localhost:3000/api/demo-audio');
    
    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': audioBuffer.byteLength.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=300',
          'X-Demo-Audio': 'true'
        },
      });
    } else {
      throw new Error('Failed to fetch demo audio');
    }
    
  } catch (error) {
    console.error('❌ Suno result fetch error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch music result',
      taskId: params.taskId,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}