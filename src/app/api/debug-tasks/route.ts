import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Getting all tasks from storage');
    
    // 모든 작업 조회
    const allTasks = await callbackStorage.getAllTasks();
    
    console.log(`📊 Found ${allTasks.length} tasks in storage`);
    
    // 최근 10개 작업만 반환 (보안상)
    const recentTasks = allTasks.slice(0, 10).map(task => ({
      taskId: task.taskId,
      status: task.status,
      hasAudioUrl: !!task.audioUrl,
      title: task.title,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      error: task.error
    }));
    
    return NextResponse.json({
      success: true,
      totalTasks: allTasks.length,
      recentTasks: recentTasks,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Debug tasks error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve tasks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}