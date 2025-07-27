import { NextRequest, NextResponse } from 'next/server';
import { paymentInitSchema, sanitizeInput, sanitizeErrorMessage } from '@/lib/validation';
import { createRateLimitMiddleware, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 POST /api/payment/init - Starting payment initialization');
    
    // 레이트 리미팅 체크
    const rateLimitCheck = createRateLimitMiddleware(RATE_LIMITS.PAYMENT)(request);
    if (!rateLimitCheck.success) {
      return NextResponse.json({
        success: false,
        error: rateLimitCheck.error,
        retryAfter: rateLimitCheck.retryAfter
      }, { status: 429 });
    }
    
    const body = await request.json();
    console.log('🎯 Request body received');
    
    // 입력 검증
    const validationResult = paymentInitSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('❌ Payment validation failed:', validationResult.error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid payment parameters',
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { packageId, amount, tokens, userId, paymentMethod } = validationResult.data;

    // 주문 ID 생성 (고유값)
    const orderId = `token_${packageId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 결제 초기화 데이터 준비
    const paymentData = {
      orderId,
      amount,
      goodsName: sanitizeInput(`토큰 ${tokens}개 (${packageId} 패키지)`),
      packageId,
      tokens,
      userId,
      paymentMethod,
      timestamp: new Date().toISOString()
    };

    console.log('🎯 Payment initialization successful:', { orderId, amount, tokens });

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      goodsName: paymentData.goodsName,
      clientId: process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      paymentData
    });

  } catch (error) {
    console.error('❌ Payment initialization error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Payment initialization failed',
        details: sanitizeErrorMessage(error)
      },
      { status: 500 }
    );
  }
}