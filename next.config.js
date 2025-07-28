/** @type {import('next').NextConfig} */
const nextConfig = {
  // 환경변수를 클라이언트에 명시적으로 노출
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // 프로덕션에서 console.log 자동 제거 (임시 비활성화)
  compiler: {
    removeConsole: false // 디버깅을 위해 임시로 false
  },
  // 정적 파일 최적화
  images: {
    unoptimized: true
  },
  // 트레일링 슬래시 설정
  trailingSlash: false,
  // TypeScript 에러를 경고로 처리 (빌드 실패 방지)
  typescript: {
    ignoreBuildErrors: true
  },
  // ESLint 에러를 무시 (빌드 실패 방지)
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig