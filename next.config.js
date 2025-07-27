/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션에서 console.log 자동 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config, { dev, isServer }) => {
    // favicon.ico 파일을 raw-loader로 처리해서 메타데이터 로더 회피
    config.module.rules.push({
      test: /favicon\.ico$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });
    
    return config;
  }
}

module.exports = nextConfig