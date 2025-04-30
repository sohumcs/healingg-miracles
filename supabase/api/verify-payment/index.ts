import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Commented out payment verification logic temporarily
    // const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    // const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
    // const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    // const { provider, paymentId, orderId, signature } = await req.json();

    // let verificationResult = { success: false };

    // switch (provider.toLowerCase()) {
    //   case 'stripe':
    //     if (!STRIPE_SECRET_KEY) throw new Error('Stripe secret key not configured');
    //     verificationResult = await verifyStripePayment(STRIPE_SECRET_KEY, paymentId, orderId);
    //     break;

    //   case 'razorpay':
    //     if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) throw new Error('Razorpay keys not configured');
    //     verificationResult = await verifyRazorpayPayment(RAZORPAY_KEY_SECRET, orderId, paymentId, signature);
    //     break;

    //   default:
    //     throw new Error(`Payment provider ${provider} not supported`);
    // }

    // Return dummy response while payment logic is commented out
    return new Response(
      JSON.stringify({ message: 'Payment verification logic is commented out for now.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

// Commented out payment verification functions
// async function verifyStripePayment(secretKey: string, paymentId: string, orderId: string) {
//   const stripeModule = await import('https://esm.sh/stripe@8.222.0');
//   const stripe = stripeModule.default(secretKey);

//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

//   const success = paymentIntent.status === 'succeeded' && paymentIntent.metadata.orderId === orderId;

//   return { success, paymentStatus: paymentIntent.status, lastError: paymentIntent.last_payment_error };
// }

// async function verifyRazorpayPayment(keySecret: string, orderId: string, paymentId: string, signature: string) {
//   const cryptoModule = await import('https://deno.land/std@0.170.0/node/crypto.ts');
//   const crypto = cryptoModule;

//   const generatedSignature = crypto.createHmac('sha256', keySecret)
//     .update(orderId + "|" + paymentId)
//     .digest('hex');

//   const success = generatedSignature === signature;

//   return { success, paymentId };
// }

export const POST = handler;
