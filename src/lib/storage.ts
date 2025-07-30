import { supabase } from './supabase';

// Global type declaration for callback storage
declare global {
  var __musicAppCallbackStorage: any;
}

// 데이터베이스 기반 콜백 데이터 저장소
interface CallbackData {
  taskId: string;
  audioUrl?: string;
  title?: string;
  duration?: number;
  imageUrl?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  rawData?: any;
}

class CallbackStorage {
  private supabaseClient = supabase;

  // 새 작업 등록
  async registerTask(taskId: string): Promise<void> {
    const taskData = {
      task_id: taskId,
      status: 'pending' as const,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Registering task in database:', taskId);
    
    const { error } = await this.supabaseClient
      .from('music_generation_tasks')
      .insert(taskData);

    if (error) {
      console.error('❌ Failed to register task:', error);
      throw new Error(`Failed to register task: ${error.message}`);
    }
    
    console.log('✅ Task registered successfully:', taskId);
  }

  // 콜백 데이터 저장
  async saveCallback(taskId: string, callbackData: any): Promise<void> {
    console.log('💾 Saving callback data for task:', taskId);
    
    // 기존 데이터 조회 (안전하게)
    const { data: existingArray, error: selectError } = await this.supabaseClient
      .from('music_generation_tasks')
      .select('*')
      .eq('task_id', taskId);
    
    const existing = existingArray && existingArray.length > 0 ? existingArray[0] : null;
    
    if (selectError) {
      console.warn('⚠️ Error checking existing task:', selectError);
    }

    if (!existing) {
      console.warn('⚠️ Callback received for unknown task, creating:', taskId);
      await this.registerTask(taskId);
    }

    // 업데이트할 데이터 준비
    const updateData: any = {
      raw_data: callbackData,
      completed_at: new Date().toISOString()
    };

    // Suno API 응답 구조에 따른 데이터 추출
    if (callbackData.audio_url || callbackData.audioUrl) {
      updateData.audio_url = callbackData.audio_url || callbackData.audioUrl;
      updateData.status = 'completed';
    }

    if (callbackData.title) {
      updateData.title = callbackData.title;
    }

    if (callbackData.duration) {
      updateData.duration = callbackData.duration;
    }

    if (callbackData.image_url || callbackData.imageUrl) {
      updateData.image_url = callbackData.image_url || callbackData.imageUrl;
    }

    // 에러 처리
    if (callbackData.error || callbackData.status === 'error') {
      updateData.status = 'failed';
      updateData.error = callbackData.error || 'Unknown error';
    }

    const { error } = await this.supabaseClient
      .from('music_generation_tasks')
      .update(updateData)
      .eq('task_id', taskId);

    if (error) {
      console.error('❌ Failed to save callback:', error);
      throw new Error(`Failed to save callback: ${error.message}`);
    }

    console.log('✅ Callback data saved successfully:', taskId);
  }

  // 결과 조회 (안전하게)
  async getResult(taskId: string): Promise<CallbackData | null> {
    const { data: resultArray, error } = await this.supabaseClient
      .from('music_generation_tasks')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      console.error('❌ Failed to get result:', error);
      return null;
    }
    
    const data = resultArray && resultArray.length > 0 ? resultArray[0] : null;

    if (!data) return null;

    return {
      taskId: data.task_id,
      audioUrl: data.audio_url,
      title: data.title,
      duration: data.duration,
      imageUrl: data.image_url,
      status: data.status,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      error: data.error,
      rawData: data.raw_data
    };
  }

  // 모든 작업 조회 (디버깅용)
  async getAllTasks(): Promise<CallbackData[]> {
    const { data, error } = await this.supabaseClient
      .from('music_generation_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to get all tasks:', error);
      return [];
    }

    return data.map(item => ({
      taskId: item.task_id,
      audioUrl: item.audio_url,
      title: item.title,
      duration: item.duration,
      imageUrl: item.image_url,
      status: item.status,
      createdAt: new Date(item.created_at),
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
      error: item.error,
      rawData: item.raw_data
    }));
  }

  // 완료된 작업만 조회
  async getCompletedTasks(): Promise<CallbackData[]> {
    const { data, error } = await this.supabaseClient
      .from('music_generation_tasks')
      .select('*')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to get completed tasks:', error);
      return [];
    }

    return data.map(item => ({
      taskId: item.task_id,
      audioUrl: item.audio_url,
      title: item.title,
      duration: item.duration,
      imageUrl: item.image_url,
      status: item.status,
      createdAt: new Date(item.created_at),
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
      error: item.error,
      rawData: item.raw_data
    }));
  }

  // 오래된 작업 정리 (데이터베이스 관리)
  async cleanup(maxAgeHours: number = 24): Promise<number> {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await this.supabaseClient
      .from('music_generation_tasks')
      .delete()
      .lt('created_at', cutoff)
      .select('task_id');

    if (error) {
      console.error('❌ Failed to cleanup old tasks:', error);
      return 0;
    }

    const deleted = data?.length || 0;
    if (deleted > 0) {
      console.log(`🧹 Cleaned up ${deleted} old tasks from database`);
    }

    return deleted;
  }
}

// 데이터베이스 기반 스토리지 싱글톤
let callbackStorageInstance: CallbackStorage;

if (typeof globalThis !== 'undefined') {
  if (!globalThis.__musicAppCallbackStorage) {
    globalThis.__musicAppCallbackStorage = new CallbackStorage();
    console.log('🔧 Created NEW Database CallbackStorage instance');
  }
  callbackStorageInstance = globalThis.__musicAppCallbackStorage;
} else {
  callbackStorageInstance = new CallbackStorage();
  console.log('🔧 Created NEW Database CallbackStorage instance (local)');
}

export const callbackStorage = callbackStorageInstance;