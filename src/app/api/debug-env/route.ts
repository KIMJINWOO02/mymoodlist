import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 모든 NEXT_PUBLIC_ 환경변수 확인
    const publicEnvs = Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .reduce((acc, key) => {
        acc[key] = {
          exists: !!process.env[key],
          length: process.env[key]?.length || 0,
          prefix: process.env[key]?.substring(0, 20) + '...' || 'undefined'
        };
        return acc;
      }, {} as any);

    // 특별히 확인할 환경변수들
    const specificCheck = {
      NEXT_PUBLIC_SUPABASE_URL: {
        raw: process.env.NEXT_PUBLIC_SUPABASE_URL,
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || 'undefined'
      }
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      publicEnvs,
      specificCheck,
      totalEnvCount: Object.keys(process.env).length,
      allKeys: Object.keys(process.env).sort()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check environment variables',
      details: error.message
    }, { status: 500 });
  }
}