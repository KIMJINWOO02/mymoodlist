# Suno AI 실제 구현 가이드

## 1. Suno API 키 발급 방법

### 옵션 A: Suno 공식 API (권장)
1. [Suno AI 웹사이트](https://suno.com)에 가입
2. API 키 신청 (현재 베타 버전)
3. `.env.local` 파일에 추가:
```
SUNO_API_KEY=your_suno_api_key_here
SUNO_BASE_URL=https://api.sunoai.ai/v1
```

### 옵션 B: Suno Proxy API (더 안정적)
1. [Suno API Proxy](https://github.com/SunoAI/suno-api) 서비스 이용
2. 프록시 서비스에 API 키 신청
3. `.env.local` 파일에 추가:
```
SUNO_PROXY_URL=https://suno-api-beta.vercel.app/api
SUNO_PROXY_KEY=your_proxy_key_here
```

### 옵션 C: 커뮤니티 API (무료, 제한적)
```
SUNO_PROXY_URL=https://suno-api-proxy.vercel.app/api
SUNO_PROXY_KEY=demo_key
```

## 2. 환경 설정

`.env.local` 파일 생성:
```env
# Suno AI 설정 (옵션 선택)
SUNO_API_KEY=your_suno_api_key
SUNO_BASE_URL=https://api.sunoai.ai/v1

# 또는 프록시 사용
SUNO_PROXY_URL=https://suno-api-beta.vercel.app/api
SUNO_PROXY_KEY=your_proxy_key

# 기존 설정
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. 테스트 방법

1. 환경 변수 설정 후 서버 재시작
```bash
npm run dev
```

2. 브라우저 콘솔에서 로그 확인:
   - `🎼 Generating music with Suno AI...` - Suno API 호출 시작
   - `✅ Suno AI generation successful` - 성공
   - `⚠️ Suno AI failed, using demo fallback` - 실패시 데모 사용

## 4. API 비용 및 제한사항

### Suno AI 공식:
- 무료 티어: 월 50회 생성
- 프로 플랜: $10/월, 500회 생성
- 최대 길이: 4분

### 프록시 서비스:
- 요금제에 따라 다름
- 일반적으로 더 저렴

## 5. 문제 해결

### API 키 없음:
- 데모 음악으로 자동 폴백
- 콘솔에 경고 메시지 출력

### API 호출 실패:
- 자동으로 다른 API 시도
- 최종적으로 데모로 폴백

### 음질 개선:
- `model: 'chirp-v3-5'` (최신 모델)
- `wait_audio: true` (완전한 생성 대기)

## 6. 프로덕션 배포

Vercel/Netlify 등에서 환경 변수 설정:
- Dashboard → Settings → Environment Variables
- 모든 `SUNO_*` 변수 추가

## 7. 대안 서비스들

API 키 발급이 어려운 경우:
1. **ElevenLabs Music**: 더 쉬운 API 접근
2. **HuggingFace MusicGen**: 완전 무료
3. **Replicate**: 사용하기 쉬운 API

현재 구현은 API 키가 없어도 데모로 작동하므로 점진적으로 실제 API를 추가할 수 있습니다.