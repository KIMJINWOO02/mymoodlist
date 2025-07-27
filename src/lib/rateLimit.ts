// 간단한 메모리 기반 레이트 리미터 (실제 프로덕션에서는 Redis 사용 권장)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 5분마다 만료된 항목 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // 레이트 리미트 체크
  check(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // 새로운 윈도우 시작
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs
      };
      this.store.set(key, newEntry);
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: newEntry.resetTime
      };
    }

    if (entry.count >= limit) {
      // 리미트 초과
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // 카운트 증가
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetTime: entry.resetTime
    };
  }

  // 특정 키의 카운트 리셋
  reset(key: string) {
    this.store.delete(key);
  }

  // 전체 스토어 클리어
  clear() {
    this.store.clear();
  }

  // 인스턴스 정리
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// 전역 레이트 리미터 인스턴스
const globalRateLimiter = new RateLimiter();

// 레이트 리미트 설정 타입
export interface RateLimitConfig {
  limit: number;        // 허용 요청 수
  windowMs: number;     // 시간 윈도우 (밀리초)
  keyGenerator?: (request: Request) => string; // 키 생성 함수
  message?: string;     // 리미트 초과 시 메시지
  skipSuccessfulRequests?: boolean; // 성공한 요청은 카운트에서 제외
  skipFailedRequests?: boolean;     // 실패한 요청은 카운트에서 제외
}

// IP 주소 추출
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('x-remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || remoteAddr || 'unknown';
}

// 기본 키 생성기
function defaultKeyGenerator(request: Request): string {
  const ip = getClientIP(request);
  const url = new URL(request.url);
  return `${ip}:${url.pathname}`;
}

// 레이트 리미트 체크 함수
export function checkRateLimit(
  request: Request, 
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const keyGenerator = config.keyGenerator || defaultKeyGenerator;
  const key = keyGenerator(request);
  
  const result = globalRateLimiter.check(key, config.limit, config.windowMs);
  
  return {
    ...result,
    retryAfter: result.allowed ? undefined : Math.ceil((result.resetTime - Date.now()) / 1000)
  };
}

// API 라우트에서 사용할 레이트 리미터 미들웨어
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return (request: Request) => {
    const result = checkRateLimit(request, config);
    
    if (!result.allowed) {
      const message = config.message || 'Too many requests. Please try again later.';
      
      return {
        success: false,
        error: message,
        retryAfter: result.retryAfter,
        resetTime: result.resetTime
      };
    }
    
    return {
      success: true,
      remaining: result.remaining,
      resetTime: result.resetTime
    };
  };
}

// 사전 정의된 레이트 리미트 설정들
export const RATE_LIMITS = {
  // 일반 API (분당 60회)
  GENERAL: {
    limit: 60,
    windowMs: 60 * 1000,
    message: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 음악 생성 API (분당 10회)
  MUSIC_GENERATION: {
    limit: 10,
    windowMs: 60 * 1000,
    message: '음악 생성 요청이 많습니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 결제 API (분당 5회)
  PAYMENT: {
    limit: 5,
    windowMs: 60 * 1000,
    message: '결제 요청이 많습니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 인증 API (분당 10회)
  AUTH: {
    limit: 10,
    windowMs: 60 * 1000,
    message: '인증 요청이 많습니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 엄격한 리미트 (시간당 100회)
  STRICT: {
    limit: 100,
    windowMs: 60 * 60 * 1000,
    message: '요청 한도를 초과했습니다. 1시간 후 다시 시도해주세요.'
  }
} as const;

// 사용자별 레이트 리미팅 (인증된 사용자)
export function createUserRateLimit(userId: string) {
  return {
    keyGenerator: () => `user:${userId}`,
    limit: 1000, // 인증된 사용자는 더 높은 한도
    windowMs: 60 * 60 * 1000, // 1시간
    message: '시간당 요청 한도를 초과했습니다.'
  };
}

// IP별 레이트 리미팅
export function createIPRateLimit() {
  return {
    keyGenerator: (request: Request) => `ip:${getClientIP(request)}`,
    limit: 100,
    windowMs: 60 * 60 * 1000, // 1시간
    message: 'IP별 요청 한도를 초과했습니다.'
  };
}

// 엔드포인트별 레이트 리미팅
export function createEndpointRateLimit(endpoint: string) {
  return {
    keyGenerator: (request: Request) => `${getClientIP(request)}:${endpoint}`,
    limit: 20,
    windowMs: 60 * 1000, // 1분
    message: `${endpoint} 엔드포인트 요청 한도를 초과했습니다.`
  };
}

// 레이트 리미터 통계
export function getRateLimitStats() {
  return {
    totalKeys: globalRateLimiter['store'].size,
    entries: Array.from(globalRateLimiter['store'].entries()).map(([key, entry]) => ({
      key,
      count: entry.count,
      resetTime: new Date(entry.resetTime),
      remainingTime: Math.max(0, entry.resetTime - Date.now())
    }))
  };
}

// 개발 환경에서 레이트 리미터 리셋
export function resetRateLimit(key?: string) {
  if (process.env.NODE_ENV === 'development') {
    if (key) {
      globalRateLimiter.reset(key);
    } else {
      globalRateLimiter.clear();
    }
  }
}

export default globalRateLimiter;