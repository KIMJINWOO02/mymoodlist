import { z } from 'zod';
import DOMPurify from 'dompurify';

// XSS 보호를 위한 입력 정리 함수
export function sanitizeInput(input: string): string {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서 DOMPurify 사용
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], // HTML 태그 완전 제거
      ALLOWED_ATTR: []  // 속성 완전 제거
    }).trim();
  } else {
    // 서버 사이드에서 기본 정리
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script 태그 제거
      .replace(/<[^>]+>/g, '') // 모든 HTML 태그 제거
      .replace(/javascript:/gi, '') // javascript: 제거
      .replace(/on\w+\s*=/gi, '') // on이벤트 속성 제거
      .trim();
  }
}

// 음악 생성 폼 데이터 검증 스키마
export const musicFormSchema = z.object({
  scene: z.string()
    .min(1, '장면을 선택해주세요')
    .max(500, '장면 설명이 너무 깁니다 (최대 500자)')
    .transform(sanitizeInput),
  
  mood: z.string()
    .min(1, '분위기를 선택해주세요')
    .max(500, '분위기 설명이 너무 깁니다 (최대 500자)')
    .transform(sanitizeInput),
  
  duration: z.number()
    .min(10, '최소 10초 이상이어야 합니다')
    .max(300, '최대 5분까지 가능합니다'),
  
  genre: z.string()
    .min(1, '장르를 선택해주세요')
    .max(500, '장르 설명이 너무 깁니다 (최대 500자)')
    .transform(sanitizeInput),
  
  useCase: z.string()
    .min(1, '용도를 선택해주세요')
    .max(500, '용도 설명이 너무 깁니다 (최대 500자)')
    .transform(sanitizeInput),
  
  instruments: z.string()
    .min(1, '악기를 선택해주세요')
    .max(500, '악기 설명이 너무 깁니다 (최대 500자)')
    .transform(sanitizeInput),
  
  additional: z.string()
    .max(1000, '추가 설명이 너무 깁니다 (최대 1000자)')
    .optional()
    .transform((val) => val ? sanitizeInput(val) : ''),
});

// 결제 데이터 검증 스키마
export const paymentInitSchema = z.object({
  packageId: z.string()
    .min(1, '패키지 ID가 필요합니다')
    .regex(/^[a-zA-Z0-9_-]+$/, '잘못된 패키지 ID 형식입니다'),
  
  amount: z.number()
    .min(1000, '최소 결제 금액은 1000원입니다')
    .max(100000, '최대 결제 금액은 100,000원입니다'),
  
  tokens: z.number()
    .min(1, '최소 1개 토큰이 필요합니다')
    .max(10000, '최대 10,000개 토큰까지 구매 가능합니다'),
  
  userId: z.string()
    .uuid('올바른 사용자 ID가 아닙니다')
    .optional(),
  
  paymentMethod: z.enum(['card', 'phone', 'bank'], {
    errorMap: () => ({ message: '올바른 결제 수단을 선택해주세요' })
  })
});

// 사용자 프로필 업데이트 검증 스키마
export const userProfileSchema = z.object({
  full_name: z.string()
    .min(1, '이름을 입력해주세요')
    .max(100, '이름이 너무 깁니다 (최대 100자)')
    .transform(sanitizeInput)
    .optional(),
  
  email: z.string()
    .email('올바른 이메일 주소를 입력해주세요')
    .max(255, '이메일이 너무 깁니다')
    .optional(),
});

// API 요청 레이트 리미팅을 위한 키 생성
export function createRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${sanitizeInput(ip)}:${sanitizeInput(endpoint)}`;
}

// 입력값이 안전한지 검증하는 함수
export function isInputSafe(input: string): boolean {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // script 태그
    /javascript:/gi, // javascript: 프로토콜
    /on\w+\s*=/gi, // 이벤트 핸들러
    /data:text\/html/gi, // data URL
    /vbscript:/gi, // VBScript
    /expression\s*\(/gi, // CSS expression
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// SQL 인젝션 방지를 위한 기본 검증
export function validateSqlInput(input: string): boolean {
  const sqlPatterns = [
    /('|(\\))/i, // 따옴표 이스케이프
    /(;|\||&)/i, // SQL 구분자
    /(union|select|insert|update|delete|drop|create|alter|exec)/i, // SQL 키워드
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
}

// 파일 업로드 시 안전한 파일명 생성
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 특수문자를 밑줄로 변경
    .replace(/_{2,}/g, '_') // 연속된 밑줄 제거
    .substring(0, 255); // 최대 길이 제한
}

// 에러 메시지 정리 (민감한 정보 제거)
export function sanitizeErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return sanitizeInput(error);
  }
  
  if (error instanceof Error) {
    return sanitizeInput(error.message);
  }
  
  return '알 수 없는 오류가 발생했습니다.';
}

// 타입 가드 함수들
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}