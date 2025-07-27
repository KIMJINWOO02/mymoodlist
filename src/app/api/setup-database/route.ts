import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up database tables...');
    
    // music_generation_tasks 테이블 생성
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.music_generation_tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        task_id TEXT UNIQUE NOT NULL,
        audio_url TEXT,
        title TEXT,
        duration INTEGER,
        image_url TEXT,
        status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        error TEXT,
        raw_data JSONB
      );
    `;
    
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableQuery });
    
    if (tableError) {
      console.error('Table creation error:', tableError);
      // RPC가 없으면 직접 테이블 생성 시도
      const { error: directError } = await supabase
        .from('music_generation_tasks')
        .select('count')
        .limit(1);
        
      if (directError && directError.message.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Cannot create table automatically. Please run SQL manually in Supabase dashboard.',
          sql: createTableQuery,
          instructions: [
            '1. Go to https://supabase.com/dashboard',
            '2. Select your project: mqalnmnpseengvzvtudt',
            '3. Open SQL Editor',
            '4. Run the SQL provided in the "sql" field above'
          ]
        }, { status: 500 });
      }
    }
    
    // 인덱스 생성
    const createIndexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_task_id ON public.music_generation_tasks(task_id);',
      'CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_status ON public.music_generation_tasks(status);',
      'CREATE INDEX IF NOT EXISTS idx_music_generation_tasks_created_at ON public.music_generation_tasks(created_at DESC);'
    ];
    
    // RLS 정책 설정
    const rlsPolicies = [
      'ALTER TABLE public.music_generation_tasks ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY IF NOT EXISTS "Public read access for music generation tasks" ON public.music_generation_tasks FOR SELECT USING (true);`,
      `CREATE POLICY IF NOT EXISTS "Public insert access for music generation tasks" ON public.music_generation_tasks FOR INSERT WITH CHECK (true);`,
      `CREATE POLICY IF NOT EXISTS "Public update access for music generation tasks" ON public.music_generation_tasks FOR UPDATE USING (true);`
    ];
    
    // 테이블 존재 확인
    const { data: tableCheck, error: checkError } = await supabase
      .from('music_generation_tasks')
      .select('count')
      .limit(1);
    
    if (checkError) {
      return NextResponse.json({
        success: false,
        error: 'Table still does not exist after creation attempt',
        message: 'Please create the table manually using Supabase SQL Editor',
        sql: createTableQuery + '\n\n' + createIndexQueries.join('\n') + '\n\n' + rlsPolicies.join('\n')
      }, { status: 500 });
    }
    
    console.log('✅ Database setup completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      tables: ['music_generation_tasks'],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to setup database',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}