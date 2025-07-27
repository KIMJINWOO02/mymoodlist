# 감정 기반 음악 생성기 (Emotion-Based Music Generator)

감정과 상상력을 바탕으로 AI가 맞춤형 음악을 생성하는 Next.js 웹 애플리케이션입니다.

## 🎵 주요 기능

- **7단계 멀티스텝 폼**: 분위기, 감정, 길이, 장르, 용도, 악기, 추가 설명
- **AI 감정 분석**: Google Gemini API를 통한 감정 기반 프롬프트 생성
- **실시간 음악 생성**: Suno API를 통한 고품질 음악 생성
- **음악 재생 및 다운로드**: 웹 플레이어와 다운로드 기능
- **반응형 UI**: TailwindCSS를 활용한 모바일 친화적 디자인

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **AI Services**: Google Gemini API, Suno AI API
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── generate-prompt/
│   │   ├── generate-music/
│   │   └── demo-audio/
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx          # 메인 페이지
├── components/            # React 컴포넌트
│   ├── steps/            # 멀티스텝 폼 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   ├── MultiStepForm.tsx
│   └── ResultPage.tsx
├── lib/                  # 유틸리티 및 API
│   └── api.ts
├── types/                # TypeScript 타입 정의
│   └── index.ts
└── constants/            # 상수 및 옵션
    └── options.ts
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Suno API Key  
SUNO_API_KEY=your_suno_api_key_here

# Next.js Environment
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 🎯 사용 방법

1. **시작하기**: 메인 페이지에서 "음악 만들기 시작하기" 버튼 클릭
2. **정보 입력**: 7단계 폼을 통해 원하는 음악의 특성 입력
3. **음악 생성**: AI가 감정을 분석하고 음악을 생성할 때까지 대기
4. **결과 확인**: 생성된 음악을 재생하고 다운로드

## 📋 7단계 입력 과정

1. **분위기 (Scene)**: 음악이 연상시킬 장면이나 배경
2. **감정 (Mood)**: 음악에 담길 주된 감정이나 분위기  
3. **길이 (Duration)**: 30초부터 5분까지 선택 가능
4. **장르 (Genre)**: 로파이, 앰비언트, 재즈 등 또는 AI 자동 선택
5. **용도 (Use Case)**: 공부용, 수면용, 영상 배경음악 등
6. **악기 (Instruments)**: 원하는 악기 구성
7. **추가 설명**: 더 구체적인 장면이나 감정 묘사 (선택사항)

## 🔧 API 설정

### Gemini API
Google AI Studio에서 API 키를 발급받아 `GEMINI_API_KEY`에 설정하세요.

### Suno API  
Suno AI 플랫폼에서 API 키를 발급받아 `SUNO_API_KEY`에 설정하세요.

## 🎨 커스터마이징

### 옵션 추가/수정
`src/constants/options.ts` 파일에서 각 단계의 선택 옵션을 수정할 수 있습니다.

### 스타일 변경
`src/app/globals.css`와 TailwindCSS 클래스를 통해 디자인을 커스터마이징할 수 있습니다.

## 📱 반응형 지원

- 모바일, 태블릿, 데스크톱 환경에서 최적화된 사용자 경험
- 터치 친화적 인터페이스
- 적응형 레이아웃

## 🚀 배포

### Vercel 배포

```bash
npm run build
```

Vercel, Netlify 등의 플랫폼에 배포 시 환경 변수를 설정하는 것을 잊지 마세요.

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes  
4. Push to the branch
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## ⚠️ 주의사항

- 실제 Suno API 연동을 위해서는 해당 API의 정확한 엔드포인트와 인증 방식을 확인해야 합니다
- 생성된 음악의 상업적 이용 시 저작권을 확인해주세요
- API 사용량에 따른 비용이 발생할 수 있습니다

## 📞 지원

문의사항이나 버그 리포트는 GitHub Issues를 통해 알려주세요.