import { NextRequest, NextResponse } from 'next/server';
import { callbackStorage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // 테스트 작업 추가
    if (action === 'test') {
      const testTaskId = 'test-' + Date.now();
      callbackStorage.registerTask(testTaskId);
      console.log('🧪 Test task registered:', testTaskId);
    }
    
    // 방금 생성된 작업 ID 재등록
    if (action === 'register') {
      const taskId = searchParams.get('taskId') || 'a85f1304e8011812722caf5c8479b428';
      callbackStorage.registerTask(taskId);
      console.log('🔄 Task re-registered:', taskId);
    }
    
    const allTasks = callbackStorage.getAllTasks();
    const completedTasks = callbackStorage.getCompletedTasks();
    
    return NextResponse.json({
      success: true,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: allTasks.filter(t => t.status === 'pending').length,
      failedTasks: allTasks.filter(t => t.status === 'failed').length,
      allTasks: allTasks,
      completedTasks: completedTasks,
      lastAction: action
    });
    
  } catch (error) {
    console.error('❌ Debug storage error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to debug storage'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cleaned = callbackStorage.cleanup(0); // 모든 작업 삭제
    
    return NextResponse.json({
      success: true,
      message: 'Storage cleared',
      deletedCount: cleaned
    });
    
  } catch (error) {
    console.error('❌ Clear storage error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to clear storage'
    }, { status: 500 });
  }
}