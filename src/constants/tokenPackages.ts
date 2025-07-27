import { TokenPackage } from '@/types';

export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'starter',
    name: '스타터',
    tokens: 10,
    price: 9900,
    description: '음악 10곡 생성 가능\n개인 사용자에게 적합',
  },
  {
    id: 'basic',
    name: '베이직',
    tokens: 30,
    price: 26910,
    originalPrice: 29900,
    discount: 10,
    description: '음악 30곡 생성 가능\n10% 할인 혜택',
  },
  {
    id: 'pro',
    name: '프로',
    tokens: 60,
    price: 50490,
    originalPrice: 59400,
    discount: 15,
    description: '음악 60곡 생성 가능\n15% 할인 혜택',
  },
];

export const TOKENS_PER_GENERATION = 1; // 음악 1곡 생성 시 필요한 토큰 수
export const FREE_TOKENS = 3; // 신규 사용자 무료 토큰