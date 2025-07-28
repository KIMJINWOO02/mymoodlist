import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase login');
    
    const { email = "test@test.com", password = "testpassword123" } = await request.json();
    
    // 환경변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl,
      keyLength: supabaseAnonKey?.length
    });
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase environment variables missing',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      });
    }
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false // 테스트용이므로 세션 저장 안함
      }
    });
    
    console.log('Supabase client created');
    
    // 로그인 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    console.log('Login attempt result:', {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message
    });
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Login failed',
        details: error.message,
        code: error.name
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        created_at: data.user?.created_at
      },
      hasSession: !!data.session
    });
    
  } catch (error: any) {
    console.error('Login test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Login test failed',
      details: error.message,
      stack: error.stack?.substring(0, 500)
    });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to test Supabase login',
    example: {
      method: 'POST',
      body: { 
        email: 'your@email.com', 
        password: 'yourpassword' 
      }
    }
  });
}