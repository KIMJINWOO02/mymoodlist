import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { TokenProvider } from '@/contexts/TokenContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SupabaseTokenProvider } from '@/contexts/SupabaseTokenContext'
import { ToastProvider } from '@/components/ui/Toast'
import { GlobalErrorBoundary } from '@/components/ui/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'myMoodlist - 감정으로 완성하는 나만의 음악',
  description: '당신의 감정, 분위기, 상황을 입력하면 AI가 완벽한 고품질 음악을 생성합니다. 프로페셔널 음원, 즉시 다운로드, 무제한 재생.',
  keywords: ['AI 음악 생성', '감정 기반 음악', '고품질 음원', '음악 다운로드', 'BGM 제작', '맞춤 음악'],
  authors: [{ name: 'myMoodlist' }],
  robots: 'index, follow',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://mymoodlist.netlify.app'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'myMoodlist - 감정으로 완성하는 나만의 음악',
    description: '고도화된 AI가 당신의 감정을 분석하여 프로급 퀄리티의 음악을 생성합니다',
    type: 'website',
    locale: 'ko_KR',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <SupabaseTokenProvider>
                <TokenProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </TokenProvider>
              </SupabaseTokenProvider>
            </AuthProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        {/* Nicepay Forstart Script */}
        <Script
          src="https://pay.nicepay.co.kr/v1/js/"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}