import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('✅ POST /api/payment/verify - Starting payment verification');
    
    const body = await request.json();
    console.log('✅ Verification request:', body);
    
    const { orderId, paymentKey, amount, status, userId, packageData } = body;

    // 요청 데이터 검증
    if (!orderId || !amount) {
      console.error('❌ Missing required verification fields');
      return NextResponse.json(
        { error: 'Missing required fields for verification' },
        { status: 400 }
      );
    }

    // 결제 성공 시에만 토큰 지급
    if (status === 'success' && paymentKey) {
      console.log('💰 Processing successful payment:', { orderId, amount });

      try {
        // 1. 토큰 거래 기록 추가
        if (userId && packageData) {
          const { error: transactionError } = await supabase
            .from('token_transactions')
            .insert({
              user_id: userId,
              transaction_type: 'purchase',
              amount: packageData.tokens,
              description: `${packageData.name} 패키지 구매`,
              package_name: packageData.name,
              payment_method: packageData.paymentMethod || 'card',
              payment_amount: amount,
            });

          if (transactionError) {
            console.error('❌ Failed to record transaction:', transactionError);
            throw transactionError;
          }

          console.log('✅ Token transaction recorded successfully');
        }

        return NextResponse.json({
          success: true,
          message: 'Payment verified and tokens added successfully',
          orderId,
          tokensAdded: packageData?.tokens || 0
        });

      } catch (dbError) {
        console.error('❌ Database error during token addition:', dbError);
        return NextResponse.json(
          { error: 'Payment successful but failed to add tokens. Please contact support.' },
          { status: 500 }
        );
      }

    } else {
      console.log('❌ Payment failed or cancelled:', { orderId, status });
      return NextResponse.json(
        { error: 'Payment was not successful' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}