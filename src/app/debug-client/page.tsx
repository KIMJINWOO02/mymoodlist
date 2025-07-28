'use client';

import { useEffect, useState } from 'react';

export default function DebugClientPage() {
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    // 클라이언트 사이드에서 환경변수 확인
    const clientEnv = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      // 브라우저 환경변수 직접 접근 시도
      window_env_check: typeof window !== 'undefined' ? {
        location_origin: window.location.origin,
        user_agent: navigator.userAgent.substring(0, 50)
      } : null
    };

    setEnvVars(clientEnv);
    console.log('Client-side environment variables:', clientEnv);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Client-Side Environment Debug</h1>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <h2>Manual Tests</h2>
      <button onClick={() => {
        console.log('=== Manual Environment Check ===');
        console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        console.log('BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
      }}>
        Log Environment Variables
      </button>
    </div>
  );
}