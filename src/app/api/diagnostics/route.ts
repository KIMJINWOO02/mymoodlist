import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Environment Variables Check
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSunoKey: !!process.env.SUNO_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'not-set',
      nodeEnv: process.env.NODE_ENV || 'not-set'
    };

    // API Health Checks
    const apiEndpoints = [
      '/api/health',
      '/api/test-deployment', 
      '/api/test-real-suno',
      '/api/simple-test',
      '/api/debug-storage'
    ];

    const endpointTests = await Promise.allSettled(
      apiEndpoints.map(async (endpoint) => {
        try {
          const response = await fetch(`${envCheck.baseUrl}${endpoint}`);
          return {
            endpoint,
            status: response.status,
            accessible: response.ok
          };
        } catch (error) {
          return {
            endpoint,
            status: 'error',
            accessible: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Supabase Connection Test
    let supabaseTest = null;
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.from('music_generation_tasks').select('count').limit(1);
      supabaseTest = {
        connected: !error,
        error: error?.message || null
      };
    } catch (error) {
      supabaseTest = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      deployment: {
        environment: envCheck,
        endpoints: endpointTests.map(result => 
          result.status === 'fulfilled' ? result.value : { error: result.reason }
        ),
        database: supabaseTest
      },
      recommendations: {
        critical: envCheck.hasSupabaseUrl && envCheck.hasSunoKey ? [] : [
          !envCheck.hasSupabaseUrl && 'Missing NEXT_PUBLIC_SUPABASE_URL',
          !envCheck.hasSunoKey && 'Missing SUNO_API_KEY'
        ].filter(Boolean),
        warnings: [
          envCheck.baseUrl === 'not-set' && 'NEXT_PUBLIC_BASE_URL not configured'
        ].filter(Boolean)
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}