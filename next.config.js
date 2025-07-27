/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션에서 console.log 자동 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // 정적 파일 최적화
  images: {
    unoptimized: true
  },
  // 트레일링 슬래시 설정
  trailingSlash: false,
  // 출력 모드
  output: 'standalone'
}

module.exports = nextConfig